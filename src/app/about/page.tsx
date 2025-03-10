'use client'
import styles from "./page.module.css";
import {Navbar} from "../../../components/navbar";
import {getTokenFromCookie} from "../../../lib/auth.lib";
import {useEffect, useState} from "react";

export default function About() {

	// Fix Hydration error
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	// Only shows navbar if connected
	return (
		<>
			{getTokenFromCookie() ? <Navbar/> : null}
		<div className={styles.page}>
			<main className={styles.main}>
				<ol>
					<li className={'text-xl'}>
						About
					</li>
					{/* English */}
					<li className={'text-md'}>
						Nogas, the gas warning system, is a project made to combat against deadly CO2 contents.
						It does this with a gas analog sensor, equipped on a Raspberry Pi. This allows us to
						display a history of the room's air contents and warn the user whether or not they
						are in danger, and if they need to evacuate.
					</li>
					{/* French */}
					<li className={'text-md'}>
						Nogas, le système d'alerte gaz, est un projet réalisé pour lutter contre les teneurs mortelles en CO2.
						Il le fait grâce à un capteur analogique de gaz, équipé sur un Raspberry Pi. Cela nous permet d'afficher
						un historique du contenu de l'air de la pièce et avertir l'utilisateur s'il est ou non
						en danger et s'il doit évacuer.
					</li>
				</ol>
			</main>
			<footer className={styles.footer}>
				<ol>
					{getTokenFromCookie() ?
					null :
						<li className={'text-lg text-center font-bold'}>
							<a href={'/..'}> Go back </a>
						</li>}
					<li className={'text-lg'}>
						Created in part by Yves-Shaheem Shedid & Mathieu Gouveia Sousa.
					</li>
				</ol>
			</footer>
		</div>
		</>
	)
}
