"use client"
import styles from "./page.module.css"
import {useState} from "react";
import Image from "next/image";

export default function Profile() {

    // todo : will use PUT api endpoint

    /* todo : this will be a protected route requiring authentication */

    const [isEditing, setIsEditing] = useState(false)

    const [firstName, setFirstName] = useState("joe")
    const [lastName, setLastName] = useState("doe")
    const [email, setEmail] = useState("joe@doe.com")
    const [phone, setPhone] = useState("514")
    const [password, setPassword] = useState("abcdefgh")
    const profileData = {
        first_name : firstName,
        last_name : lastName,
        email : email,
        phone : phone,
        password: password,
    }

    // Contacts are obtained via a different route, using the userId
    const [contacts, setContacts] = useState(
        [{'id': 5, 'name': 'the_Devil', 'phone' : '666'}, {'id': 7, 'name': 'the_Devil', 'phone' : '666'}]
    )

    async function handleSubmit() {

        setIsEditing(!isEditing)
        console.log(contacts)

    }

    return (
        <div className={styles.page}>
            {/* Navbar will go here, it's in-dev with home page branch */}
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
                                placeholder={profileData.email}
                                onChange={e => setEmail(e.target.value)}/>
                            <li className={styles.heading}>Your first name:</li>
                            <input
                                placeholder={profileData.first_name}
                                onChange={e => setFirstName(e.target.value)}/>
                            <li className={styles.heading}>Your last name:</li>
                            <input
                                placeholder={profileData.last_name}
                                onChange={e => setLastName(e.target.value)}/>
                            <li className={styles.heading}>Your phone number:</li>
                            <input
                                placeholder={profileData.phone}
                                onChange={e => setPhone(e.target.value)}/>
                            <li className={styles.heading}>Your password:</li>
                            {/* Pop up to inform the password is changed would be nice */}
                            <input
                                placeholder="Enter new password"
                                type="password"
                                onChange={e => setPassword(e.target.value)}/>
                            <li className={styles.heading}>Your emergency contacts:</li>
                            {contacts.map(contact => (
                                <div key={contact.id}>
                                    <ul>
                                        <li>
                                            <input className={styles.input} onChange={(e) => (contact.name = e.target.value)} placeholder={contact.name}/>
                                        </li>
                                        <li>
                                            <input className={styles.inputb} onChange={(e) => (contact.phone = e.target.value)} placeholder={contact.phone}/>
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
                            <li>{profileData.email}</li>
                            <li className={styles.heading}>Your first name:</li>
                            <li>{profileData.first_name}</li>
                            <li className={styles.heading}>Your last name:</li>
                            <li>{profileData.last_name}</li>
                            <li className={styles.heading}>Your phone number:</li>
                            <li>{profileData.phone}</li>
                            <li className={styles.heading}>Your password:</li>
                            <li>****</li>
                            <li className={styles.heading}>Your emergency contacts:</li>
                            <li>
                                {contacts.map(contact => (
                                    <div key={contact.id}>
                                        <ul>
                                            <li> {contact.name} </li>
                                            <li> {contact.phone} </li>
                                        </ul>
                                    </div>
                                ))}
                            </li>
                        </ol>
                    </div>
                }

                {isEditing?
                    <a className={'text-center'} onClick={() => handleSubmit()}>I'm done editing</a> :
                    <a className={'text-center'} onClick={() => setIsEditing(!isEditing)}>Edit</a>
                }
            </main>
        </div>
    )
}