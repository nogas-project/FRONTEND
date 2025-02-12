'use client';
import Form from "next/form";
import {useEffect, useState} from "react";
import styles from "./page.module.css";

export default function Register() {

    const [contacts, setContacts] = useState(
        [{'id': 1, 'name': 'Name', 'phone' : 'Number'}]
    )
    const [showPlus, setShowPlus] = useState(true)
    const [showMinus, setShowMinus] = useState(false)
    // For emergency contacts, we need a minimum of 1, and max of 3
    // frontend button to expand and lower the amount
    function handleAdd() {
        setContacts([...contacts, {'id': contacts.length + 1, 'name': 'Name', 'phone' : 'Number'}])
    }
    const handleDelete = (index: number) => {
        setContacts(oldValues => {
            return oldValues.filter((_, i) => i !== index)
        })
    }
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
                <Form action="/login">
                    <ol>
                        <li>
                            First Name:
                            <input className={styles.input} type="text" placeholder="First Name"/>
                        </li>
                        <li>
                            Last Name:
                            <input className={styles.input} type="text" placeholder="Last Name"/>
                        </li>
                        <li>
                            Email:
                            <input className={styles.input} type="text" placeholder="Email"/>
                        </li>
                        <li>
                            Password:
                            <input className={styles.input} type="password" placeholder="Password"/>
                        </li>
                        <li>
                            Phone:
                            <input className={styles.input} type="text" placeholder="Number"/>
                        </li>
                        <li>
                            Emergency Contacts:
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input className={styles.input} type="text" placeholder={contact.name}/>
                                        </li>
                                        <li>
                                            <input className={styles.inputb} type="text" placeholder={contact.phone}/>
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
                        <button className={styles.submit} type='submit'>[ Submit ]</button>
                    </div>

                </Form>
            </main>

        </div>
    )
}
