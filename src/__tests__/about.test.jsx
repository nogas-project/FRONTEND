import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../app/about/page';
import '@testing-library/jest-dom';

describe('About Component', () => {
    it('renders the About page', () => {
        render(<About />);

        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('renders the English description', () => {
        render(<About />);

        const englishDescription =
            'Nogas, the gas warning system, is a project made to combat against deadly CO2 contents. ' +
            'It does this with a gas analog sensor, equipped on a Raspberry Pi. This allows us to ' +
            'display a history of the room\'s air contents and warn the user whether or not they ' +
            'are in danger, and if they need to evacuate.';

        expect(screen.getByText(englishDescription)).toBeInTheDocument();
    });

    it('renders the French description', () => {
        render(<About />);

        const frenchDescription =
            'Nogas, le système d\'alerte gaz, est un projet réalisé pour lutter contre les teneurs mortelles en CO2. ' +
            'Il le fait grâce à un capteur analogique de gaz, équipé sur un Raspberry Pi. Cela nous permet d\'afficher ' +
            'un historique du contenu de l\'air de la pièce et avertir l\'utilisateur s\'il est ou non ' +
            'en danger et s\'il doit évacuer.';

        expect(screen.getByText(frenchDescription)).toBeInTheDocument();
    });

    it('renders the "Go back" link', () => {
        render(<About />);

        const goBackLink = screen.getByRole('link', { name: /go back/i });
        expect(goBackLink).toBeInTheDocument();
        expect(goBackLink).toHaveAttribute('href', '/..');
    });

    it('renders the footer with creators\' names', () => {
        render(<About />);

        const creatorsText = 'Created in part by Yves-Shaheem Shedid & Mathieu Gouveia Sousa.';
        expect(screen.getByText(creatorsText)).toBeInTheDocument();
    });
});