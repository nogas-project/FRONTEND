"use client"
import styles from "./page.module.css";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Input verification
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const [serverError, setServerError] = useState("");

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
            const response = await fetch(`http://localhost:${port}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // setIsLoading(false);
                setServerError("");
                setCredentialsError("Incorrect credentials");
                return;
            } else {
                setCredentialsError("Logging in...");
            }


            const token = await response.json();
            console.log('Success:', token);

            document.cookie = `token=${token}; path=/`
            router.push("/home");

        } catch (error) {
            setCredentialsError("")
            setServerError('Something went wrong on our end, Sorry, try again later');
            console.log(error);
        }
    }

    useEffect(() => {
    }, [email])

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <form onSubmit={handleSubmit} action="/" className={styles.login}>
                    <p className={styles.title}>== LOGIN ==</p>
                    <ol>
                        <li>{credentialsError}</li>
                        <li className={'text-red-500'} >{serverError}</li>
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
                </form>
            </main>

        </div>

    )
}
