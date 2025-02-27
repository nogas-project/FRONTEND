import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from "../app/home/page";
import '@testing-library/jest-dom';

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn()
    }),
}));
describe('Home Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders the realTime side', async () => {
        render(<Home/>)
        expect(screen.getByText("== No danger ! ==")).toBeInTheDocument();
        // Gauge only loaded on the client-side, not during server-side rendering because of next/dynamic
    });
    it('renders the history side',  () => {
        render(<Home/>)
        expect(screen.getByText("== No danger ! ==")).toBeInTheDocument();
        expect(screen.getByText("== History ==")).toBeInTheDocument();
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("CO amount")).toBeInTheDocument();
        expect(screen.getByText("TimeStamp")).toBeInTheDocument();
    });
})