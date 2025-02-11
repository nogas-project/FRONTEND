'use client';
import Form from "next/form";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import styles from "./page.module.css";

export default function Register() {

    // Fetch
    //
    // fetch(`http://127.0.0.1:${process.env.BE_PORT}/user/register`, {method: "POST"})
    // .then(req => req.body)

    // Handle input data
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    // Placeholder values for emergency contacts
    const [contacts, setContacts] = useState(
        [{'id': 1, 'name': '', 'phone' : ''}]
    )

    // Handle input verification
    const phoneRegex : RegExp = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [contactsError, setContactsError] = useState("");
    const [contactsNameError, setContactsNameError] = useState("");
    const [contactsPhoneError, setContactsPhoneError] = useState("");
    async function handleSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Better practice would be to autocorrect it for the client
        phoneRegex.test(phone) ? setPhoneError("") : setPhoneError("Your phone number should look like this: 555-555-5555") ;
        emailRegex.test(email) ? setEmailError("") : setEmailError("Your email should look like this: example@email.com")

        // Checks if there's at least one emergency contact, if they all have names,
        // and if they all have proper phone numbers
        let hasInvalidPhone = false;
        let hasInvalidName = false;
        !contacts[0].name && !contacts[0].phone ? setContactsError("Make sure to have at least one emergency contact") : setContactsError("");
        for (let i = 0; i < contacts.length; i++) {
            if (!contacts[i].name) {
                hasInvalidName = true;
                break;
            } else {
            }

            if (!phoneRegex.test(contacts[i].phone)) {
                hasInvalidPhone = true;
                break;
            } else {
                setContactsPhoneError("One of your contacts' phone number is missing or incorrect, it should look like this: 555-555-5555");
            }
        }
        hasInvalidName ? setContactsNameError("One of your contacts' name is missing") : setContactsNameError("");
        hasInvalidPhone ? setContactsPhoneError("One of your contacts' phone number is missing or incorrect, it should look like this: 555-555-5555") : setContactsPhoneError("");

        // Password checks, could add more
        password.length < 6 ? setPasswordError("Your password must be at least 8 characters") : setPasswordError("");
        confirmPassword !== password ? setConfirmPasswordError("Your password doesn't match") : setConfirmPasswordError("");
    }

    // For emergency contacts, we need a minimum of 1, and max of 3
    // these functions handle when to show the buttons to add or remove them
    const [showPlus, setShowPlus] = useState(true)
    const [showMinus, setShowMinus] = useState(false)
    function handleAdd() {
        setContacts([...contacts, {'id': contacts.length + 1, 'name': '', 'phone' : ''}])
    }
    const handleDelete = (index: number) => {
        setContacts(oldValues => {
            return oldValues.filter((_, i) => i !== index)
        })
    }

    // Render each time contacts is changed to accurately show + and -
    useEffect(() => {
        console.log(contacts)
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
                <Form action="/">
                    <ol>
                        <li>
                            First Name:
                            <input onChange={(e) => {setFirstName(e.target.value)}} className={styles.input} type="text"
                                   placeholder="First Name"/>
                        </li>
                        <li>
                            Last Name:
                            <input onChange={(e) => {setLastName(e.target.value)}} className={styles.input} type="text" placeholder="Last Name"/>
                        </li>
                        <li>
                            Email:
                            <input onChange={(e) => {setEmail(e.target.value)}} className={styles.input} type="text" placeholder="Email"/>
                            <ol>{emailError}</ol>
                        </li>
                        <li>
                            Password:
                            <input onChange={(e) => {setPassword(e.target.value)}} className={styles.input} type="password" placeholder="Password"/>
                            <ol>{passwordError}</ol>
                        </li>
                        <li>
                            Confirm Password:
                            <input onChange={(e) => {setConfirmPassword(e.target.value)}} className={styles.input} type="password" placeholder="Password"/>
                            <ol>{confirmPasswordError}</ol>

                        </li>
                        <li>
                            Phone:
                            <input onChange={(e) => {setPhone(e.target.value)}} className={styles.input} type="text" placeholder="Number"/>
                            <ol>{phoneError}</ol>
                        </li>
                        <li>
                            Emergency Contacts:
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input onChange={(e) => {contact.name = e.target.value}} className={styles.input} type="text" placeholder="Name"/>
                                        </li>
                                        <li>
                                            <input onChange={(e) => {contact.phone = e.target.value}} className={styles.inputb} type="text" placeholder="Phone"/>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                            <ol>
                                <li>{contactsError}</li>
                                <li>{contactsNameError}</li>
                                <li>{contactsPhoneError}</li>
                            </ol>

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
                        <button className={styles.submit} type='submit' onClick={handleSubmit}>[ Submit ]</button>
                    </div>

                </Form>
            </main>

        </div>
    )
}
