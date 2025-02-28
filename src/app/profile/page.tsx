"use client"
import styles from "./page.module.css"
import {useEffect, useState} from "react";
import Image from "next/image";
import {deleteCookie} from "cookies-next";
import {useRouter} from "next/navigation";
import {getTokenFromCookie, validateToken} from "../../../lib/auth.lib";
import {Navbar} from "../../../components/navbar";

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false)

    let userId: any;
    let token: any;
    const [firstName, setFirstName] = useState("Loading...")
    const [lastName, setLastName] = useState("Loading...")
    const [email, setEmail] = useState("Loading...")
    const [phone, setPhone] = useState("Loading...")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [contacts, setContacts] = useState([{"id": 1, "name": "n/a", "email": "n/a@email.com"}])

    async function loadProfileData() {
        token = getTokenFromCookie();
        const port = process.env.BE_PORT || 3001;
        if (token) {
            // todo: possibly decode locally using frontend env secret instead
            const decodedData = await validateToken(token);
            userId = decodedData.id

            const response = await fetch(`http://localhost:${port}/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            const data = await response.json();
            if (data) {
                return data;
            }
        } else {
            throw new Error("Unable to load profile data.")
        }
    }
    async function loadContactsData() {

        try {
            const response = await fetch(`http://localhost:3001/contacts/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json();
            if (data) {
                return data;
            }
        } catch (error) {
            throw new Error("Unable to load contacts data.")
        }
    }

    // Use useEffect to load data once when the component mounts
    useEffect(() => {
        console.log("loading data")
        loadProfileData().then(data => {
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setEmail(data.email);
            setPhone(data.phone);
            // Load contacts
            loadContactsData().then(data => {
                setContacts(data);
            });
        });
    }, []); // Empty dependency array ensures this runs only once

    // Mostly code from register page from here, it all should be in a component of some sort
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

    async function handleSubmit() {
        // is in editing-mode
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
        // and if they all have proper email numbers
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
        hasInvalidEmail ? setContactsEmailError("One of your contacts' email") : setContactsEmailError("");

        if (!isValid) {
            console.log("Validation failed. Please fix the errors.");
            return;
        }

        const profileData = {
            first_name: firstName,
            last_name: lastName,
            phone,
            email,
            password
        }

        const contactData = {
            contacts,
        }

        // Everything is valid, send PUT
        const port = process.env.BE_PORT || 3001;
        const token : any = getTokenFromCookie();
        const decoded = await validateToken(token);
        const userId = decoded.id

        // Profile PUT
        try {
            const response = await fetch(`http://localhost:${port}/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                console.log("Something went wrong")
                throw response;
            }

            const data = await response.json();
            console.log(data);

        } catch (error) {
            throw error
        }

        // Contacts PUT
        try {
            for (let i = 0; i < contacts.length; i++) {
                console.log(contactData.contacts[i])
                const contactResponse = await fetch(`http://localhost:${port}/contacts/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(contactData.contacts[i]),
                });

                if (!contactResponse.ok) {
                    throw new Error("Couldn't add contact");
                }
                console.log('Success:', contactResponse);
            }
        } catch (error) {
            throw error
        }


        // Exit editing mode
        setIsEditing(!isEditing)
    }

    function logout() {
        deleteCookie("token");
        router.push("/login");
    }

    return (
        <>
            <Navbar/>
        <div className={styles.page}>
            <main className={isEditing ? styles.mainEdit : styles.main}>
                <Image
                    className={styles.logo}
                    src="/fire.svg"
                    alt="nogas-logo"
                    width={200}
                    height={50}
                    priority
                />
                {isEditing ?
                    /* In editing mode */
                    <div>
                        <ol>
                            <li className={styles.heading}>Your email:</li>
                            <input
                                placeholder={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                            <li>{emailError}</li>
                            <li className={styles.heading}>Your first name:</li>
                            <input
                                placeholder={firstName}
                                onChange={(e) => setFirstName(e.target.value)}/>
                            <li>{firstNameError}</li>
                            <li className={styles.heading}>Your last name:</li>
                            <input
                                placeholder={lastName}
                                onChange={e => setLastName(e.target.value)}/>
                            <li>{lastNameError}</li>
                            <li className={styles.heading}>Your phone number:</li>
                            <input
                                placeholder={phone}
                                onChange={e => setPhone(e.target.value)}/>
                            <li>{phoneError}</li>
                            <li className={styles.heading}>Your password:</li>
                            <input
                                placeholder="Enter new password"
                                type="password"
                                onChange={e => setPassword(e.target.value)}/>
                            <li>{passwordError}</li>
                            <li>
                                <input
                                    placeholder="Confirm new password"
                                    type="password"
                                    onChange={e => setConfirmPassword(e.target.value)}/>
                                <ol>{confirmPasswordError}</ol>
                            </li>

                            <li className={styles.heading}>Your emergency contacts:</li>
                            <li>{contactsNameError}</li>
                            <li>{contactsEmailError}</li>
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input
                                                   onChange={(e) => (contact.name = e.target.value)}
                                                   placeholder={contact.name}/>
                                        </li>
                                        <li>
                                            <input
                                                   onChange={(e) => (contact.email = e.target.value)}
                                                   placeholder={contact.email}/>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </ol>
                    </div> :
                    /* In normal mode */
                    <div>
                        <ol>
                            <li className={styles.heading}>Your email:</li>
                            <li>{email}</li>
                            <li className={styles.heading}>Your first name:</li>
                            <li>{firstName}</li>
                            <li className={styles.heading}>Your last name:</li>
                            <li>{lastName}</li>
                            <li className={styles.heading}>Your phone number:</li>
                            <li>{phone}</li>
                            <li className={styles.heading}>Your password:</li>
                            <li>********</li>
                            <li className={styles.heading}>Your emergency contacts:</li>
                            <li>
                                {contacts.map(contact => (
                                    <div key={contact.id}>
                                        <ul>
                                            <li> {contact.name} </li>
                                            <li> {contact.email} </li>
                                        </ul>
                                    </div>
                                ))}
                            </li>
                        </ol>
                    </div>
                }

                {isEditing ?
                    <a className={'text-center'} onClick={() => handleSubmit()}>I'm done editing</a> :
                    <a className={'text-center'} onClick={() => setIsEditing(!isEditing)}>Edit</a>
                }
                <a className={styles.logout} onClick={() => logout()}>
                    Logout
                </a>

            </main>
        </div>
        </>
    )
}