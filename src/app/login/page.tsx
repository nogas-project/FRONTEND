import Form from "next/form";
import styles from "./page.module.css";

export default function Login() {
    
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Form action="/" className={styles.login}>
                    {/* On submission, the input value will be appended to
              the URL, e.g. /search?query=abc */}
                    <p className={styles.title}>== LOGIN ==</p>
                    <ol>
                        <li>
                            Username:
                            <input name="query" className={styles.input} placeholder="Username" />
                        </li>
                        <li>
                            Password:
                            <input name="query" className={styles.input} placeholder="Password" />
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
