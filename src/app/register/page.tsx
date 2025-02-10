'use client';
import Form from "next/form";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import styles from "./page.module.css";

export default function Register() {

    // Fetch

    // fetch(`http://127.0.0.1:${process.env.BE_PORT}/user/register`, {method: "POST"})
    // .then(req => req.body)


    ///

    // Handle input data
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    // const handleFirstName = (e : ChangeEvent | any) =>  {
    //     setFirstName(e.currentTarget.value);
    // }
    // const handleLastName = (e : ChangeEvent | any) =>  {
    //     setLastName(e.currentTarget.value);
    // }
    // const handleEmail = (e : ChangeEvent | any) =>  {
    //     setEmail(e.currentTarget.value);
    // }
    // const handlePassword = (e : ChangeEvent | any) =>  {
    //     setPassword(e.currentTarget.value);
    // }
    // const handleConfirmPassword = (e : ChangeEvent | any) =>  {
    //     setConfirmPassword(e.currentTarget.value);
    // }
    // const handlePhone = (e : ChangeEvent | any) =>  {
    //     setPhone(e.currentTarget.value);
    // }

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    async function handleSubmit(e : FormEvent<HTMLFormElement>){
        e.preventDefault();

        password.length < 6 ? setPasswordError("Your password is too short!") : setPasswordError("");
        confirmPassword !== password ? setConfirmPasswordError("Password doesn't match!") : setConfirmPasswordError("");

    }

    const [contacts, setContacts] = useState(
        [{'id': 1, 'name': 'Name', 'phone' : 'Number'}]
    )
    const [showPlus, setShowPlus] = useState(true)
    const [showMinus, setShowMinus] = useState(false)
    // For emergency contacts, we need a minimum of 1, and max of 3
    // these functions handle when to show the buttons to add or remove them
    function handleAdd() {
        setContacts([...contacts, {'id': contacts.length + 1, 'name': 'Name', 'phone' : 'Number'}])
    }
    const handleDelete = (index: number) => {
        setContacts(oldValues => {
            return oldValues.filter((_, i) => i !== index)
        })
    }
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
                        </li>
                        <li>
                            Emergency Contacts:
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input onChange={(e) => {contact.name = e.target.value}} className={styles.input} type="text" placeholder={contact.name}/>
                                        </li>
                                        <li>
                                            <input onChange={(e) => {contact.phone = e.target.value}} className={styles.inputb} type="text" placeholder={contact.phone}/>
                                        </li>
                                    </ul>
                                </div>
                            ))}

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
