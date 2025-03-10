'use client';
import {FormEvent, useEffect, useState} from "react";
import styles from "./page.module.css";
import {useRouter} from "next/navigation";
import {deleteCookie} from "cookies-next";

export default function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Input data
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [contacts, setContacts] = useState(
        [{'id': 1, 'name': '', 'email' : ''}]
    )

    // Handle input verification
    const phoneRegex : RegExp = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [contactsError, setContactsError] = useState("");
    const [contactsNameError, setContactsNameError] = useState("");
    const [contactsEmailError, setContactsEmailError] = useState("");
    const [serverError, setServerError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let isValid = true;

        if (!firstName) {
            isValid = false;
            setFirstNameError("You need to enter your first name");
        } else {
            setFirstNameError("");
        }

        if (!lastName) {
            isValid = false;
            setLastNameError("You need to enter your last name");
        } else {
            setLastNameError("");
        }

        if (!emailRegex.test(email)) {
            isValid = false;
            setEmailError("Your email should look like this: example@email.com");
        } else {
            setEmailError("");
        }

        if (!phoneRegex.test(phone)) {
            isValid = false;
            setPhoneError("Your phone number should look like this: 555-555-5555");
        } else {
            setPhoneError("");
        }

        if (password.length < 8) {
            isValid = false;
            setPasswordError("Your password must be at least 8 characters");
        } else {
            setPasswordError("");
        }

        if (confirmPassword !== password) {
            isValid = false;
            setConfirmPasswordError("Your password doesn't match");
        } else {
            setConfirmPasswordError("");
        }

        // Checks if there's at least one emergency contact, if they all have names,
        // and if they all have proper emails
        let hasInvalidEmail = false;
        let hasInvalidName = false;
        if (!contacts[0].name && !contacts[0].email) {
            setContactsError("Make sure to have at least one emergency contact")
            isValid = false;
        } else {
            setContactsError("");
        }
        for (let i = 0; i < contacts.length; i++) {
            if (!contacts[i].name) {
                isValid = false;
                hasInvalidName = true;
                break;
            }
            if (!emailRegex.test(contacts[i].email)) {
                isValid = false;
                hasInvalidEmail = true;
                break;
            }
        }
        hasInvalidName ? setContactsNameError("One of your contacts' name is missing") : setContactsNameError("");
        hasInvalidEmail ? setContactsEmailError("One of your contacts' email is missing or incorrect") : setContactsEmailError("");

        if (!isValid) {
            console.log("Validation failed. Please fix the errors.");
            return;
        }

        // Prepare data
        const data = {
            first_name : firstName,
            last_name : lastName,
            email,
            password,
            phone,
        };

        // Send data to BE using fetch
        let port = process.env.BE_PORT || 3001;
        setIsLoading(true);
        try {
            console.log("Trying to reach BE...")
            const response = await fetch(`http://localhost:${port}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                setIsLoading(false);
                let feedback = await response.json()
                if (feedback === "An account with this email already exists") {
                    setEmailError("An account with this email already exists, please use another email");
                    return;
                } else {
                    throw new Error("BE is down");
                }
            }

            const result = await response.json();

            // Login before adding emergency contacts, fix to contacts risk highlighted in QA Check Trello
            const loginData = {
                email,
                password,
            }
            const loginResponse = await fetch(`http://localhost:${port}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(loginData),
            })

            if (!response.ok) {
                setIsLoading(false);
                throw new Error("login after registering failed")
            }

            const loginResult = await loginResponse.json()

            // Contacts are done separately because of the oneToMany
            // relation done in the backend.
            // this revision takes in mind that the backend returns the id
            // of the user in the POST response.

            // Individually adds each contact
            for (let i = 0; i < contacts.length; i++) {
                console.log(contacts[i])
                const contactResponse = await fetch(`http://localhost:${port}/contacts/${result.mess}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginResult}`,
                    },
                    body: JSON.stringify(contacts[i]),
                });

                if (!contactResponse.ok) {
                    throw new Error("Couldn't add contact");
                }
                console.log('Success:', contactResponse);
            }

            // Send to login page and delete cookie used for posting contacts
            deleteCookie("token");
            router.push('/login');

        } catch (error) {
            setIsLoading(false);
            setServerError("There's a problem on our end. Sorry, try again later");
            console.error('Error:', error);
        }

    }

    // For emergency contacts, we need a minimum of 1, and max of 3
    // these functions handle when to show the buttons to add or remove them
    const [showPlus, setShowPlus] = useState(true)
    const [showMinus, setShowMinus] = useState(false)
    function handleAdd() {
        setContacts([...contacts, {'id': contacts.length + 1, 'name': '', 'email' : ''}])
    }
    const handleDelete = (index: number) => {
        setContacts(oldValues => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    // Render each time contacts is changed to accurately show + and -
    useEffect(() => {
        switch (contacts.length) {
            case 1:
                setShowPlus(true)
                setShowMinus(false)
                break;
            case 2:
                setShowMinus(true)
                setShowPlus(true)
                break;
            case 3:
                setShowMinus(true)
                setShowPlus(false)
                break;
        }
    }, [contacts])

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <p className={styles.title}>== SIGN UP ==</p>
                <form onSubmit={handleSubmit}>
                    <ol>
                        <li className={"text-red-500"}>{serverError}</li>
                        <li>
                            First Name:
                            <input onChange={(e) => {
                                setFirstName(e.target.value)
                            }}
                                   className={styles.input}
                                   type="text"
                                   placeholder="First Name"/>
                            <ol>{firstNameError}</ol>
                        </li>
                        <li>
                            Last Name:
                            <input onChange={(e) => {
                                setLastName(e.target.value)
                            }}
                                   className={styles.input}
                                   type="text"
                                   placeholder="Last Name"/>
                            <ol>{lastNameError}</ol>
                        </li>
                        <li>
                            Email:
                            <input onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                                   className={styles.input}
                                   type="text"
                                   placeholder="Email"/>
                            <ol>{emailError}</ol>
                        </li>
                        <li>
                            Password:
                            <input onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                                   className={styles.input}
                                   type="password"
                                   placeholder="Password"/>
                            <ol>{passwordError}</ol>
                        </li>
                        <li>
                            Confirm Password:
                            <input onChange={(e) => {
                                setConfirmPassword(e.target.value)
                            }}
                                   className={styles.input}
                                   type="password"
                                   placeholder="Confirm password"/>
                            <ol>{confirmPasswordError}</ol>

                        </li>
                        <li>
                            Phone:
                            <input onChange={(e) => {
                                setPhone(e.target.value)
                            }}
                                   className={styles.input}
                                   type="text"
                                   placeholder="Number"/>
                            <ol>{phoneError}</ol>
                        </li>
                        <li>
                            Emergency Contacts:
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input onChange={(e) => {
                                                contact.name = e.target.value
                                            }}
                                                   className={styles.input}
                                                   type="text"
                                                   placeholder="Contact's Name"/>
                                        </li>
                                        <li>
                                            <input onChange={(e) => {
                                                contact.email = e.target.value
                                            }}
                                                   className={styles.inputb}
                                                   type="text"
                                                   placeholder="Contact's Email"/>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                            {/* Contacts errors */}
                            <ol>
                                <li>{contactsError}</li>
                                <li>{contactsNameError}</li>
                                <li>{contactsEmailError}</li>
                            </ol>

                            {/* + and - buttons */}
                            <div>
                                {showPlus ?
                                    <p className={styles.button}
                                       onClick={handleAdd}
                                    >
                                        + </p> : null}
                                {showMinus ?
                                    <p className={styles.button}
                                       onClick={() => handleDelete(contacts.length - 1)}
                                    >
                                        - </p> : null}
                            </div>
                        </li>
                    </ol>

                    <div className={'text-center'}>
                        <button className={styles.submit} type='submit'>[ Submit ]</button>
                    </div>
                </form>

                {/* Loading overlay when reaching to BE, spinner would be nicer */}
                {isLoading && (
                    <div className={styles.overlay}>
                        <div className={styles.loadingText}>Loading...</div>
                    </div>
                )}
            </main>
            <footer className={styles.footer}>If you already have an account,
                <a
                    className={'font-bold '}
                    href={'/login'}
                >
                    login here.
                </a>
            </footer>

        </div>
    )
}
