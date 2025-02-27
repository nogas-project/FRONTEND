import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {Navbar} from "../../components/navbar";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush, // Mock the push function
    }),
}));

describe('Navbar Component', () => {
    it('renders correctly and handle navigation', () => {
        jest.spyOn(window, "alert").mockImplementation(() => {});
        render(<Navbar />);

        const homeLink = screen.getByText("Home").closest("a");
        const aboutLink = screen.getByText("About").closest("a");
        const profileLink = screen.getByText("Profile").closest("a");
        const logoutButton = screen.getByText("Logout");
        const notificationButton = screen.getByText("Notification");

        expect(screen.getByText("The Nogas Web Interface")).toBeInTheDocument();
        expect(homeLink).toBeInTheDocument();
        expect(aboutLink).toBeInTheDocument();
        expect(profileLink).toBeInTheDocument();
        expect(logoutButton).toBeInTheDocument();
        expect(notificationButton).toBeInTheDocument();

        expect(homeLink).toHaveAttribute("href", "/home");
        expect(aboutLink).toHaveAttribute("href", "/about");
        expect(profileLink).toHaveAttribute("href", "/profile");


        fireEvent.click(notificationButton);
        expect(window.alert).toHaveBeenCalledWith("Notification are disabled");
        window.alert.mockRestore();

        fireEvent.click(logoutButton);
        expect(mockPush).toBeCalledWith("/");

    })

})