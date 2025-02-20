import Image from "next/image";
import styles from "./page.module.css";

export default function Index() {
  return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Image
              className={styles.logo}
              src="/fire.svg"
              alt="nogas-logo"
              width={200}
              height={50}
              priority
          />
          <ol>
            <li className={'text-lg'}>You've reached Nogas</li>
          </ol>

          <div className={styles.ctas}>
            <a
                className={styles.primary}
                href={'/register'}
                rel="noopener noreferrer"
            >
              Get started
            </a>
          </div>

        </main>
        <footer className={styles.footer}>
          <div>If you already have an account,
            <a
                className={'font-bold'}
                href={'/login'}
            >
                login here.
            </a>
          </div>
        </footer>
      </div>
  );
}
