"use client"
import Form from "next/form";
import styles from "./page.module.css";
import {FormEvent, useEffect, useState} from "react";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Input verification
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [credentialsError, setCredentialsError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let isValid = true;

        if (!email) {
            isValid = false
            setEmailError("Your email is required");
        } else {
            setEmailError("");
        }

        if (!password) {
            isValid = false
            setPasswordError("Your password is required");
        } else {
            setPasswordError("");
        }

        if (!isValid) {
            console.log("Validation failed. Please fix the errors.");
            return;
        }

        // Prepare data
        const data = {
            email: email,
            password: password,
        };

        const port = process.env.BE_PORT || 3001;
        try {
            console.log(JSON.stringify(data));
            const response = await fetch('http://localhost:3001/user/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // setIsLoading(false);
                setCredentialsError("Incorrect credentials");
                throw new Error("Bad credentials");
            } else {
                setCredentialsError("Logging in...");
            }

            const result = await response.json();
            console.log('Success:', result);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
    }, [email])

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Form onSubmit={handleSubmit} action="/" className={styles.login}>
                    <p className={styles.title}>== LOGIN ==</p>
                    <ol>
                        <li>{credentialsError}</li>
                        <li>
                            Email:
                            <input onChange={(e) => setEmail(e.target.value)}
                                   type="text"
                                   className={styles.input}
                                   placeholder="Email" />
                            <ol>{emailError}</ol>
                        </li>
                        <li>
                            Password:
                            <input onChange={(e) => setPassword(e.target.value)}
                                   type="password"
                                   className={styles.input}
                                   placeholder="Password" />
                            <ol>{passwordError}</ol>
                        </li>
                    </ol>

                    <div className={styles.submit}>
                        <button type="submit" className={styles.button}>[ Submit ]</button>
                    </div>
                </Form>
            </main>

        </div>

    )
}
