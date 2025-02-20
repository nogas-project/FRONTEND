import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../app/login/page";
import "@testing-library/jest-dom";
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe("Login Component", () => {
  const push = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(); 
    useRouter.mockReturnValue({ push });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    return render(ui);
  };

  it("renders login form", () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("[ Submit ]")).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    renderWithRouter(<Login />);
    fireEvent.click(screen.getByText("[ Submit ]"));
    expect(await screen.findByText("Your email is required")).toBeInTheDocument();
    expect(await screen.findByText("Your password is required")).toBeInTheDocument();
  });

  it("submits form and navigates on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => "mockedToken",
    });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("[ Submit ]"));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/home");
    });
  });

  it("shows credential error on failed login", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByText("[ Submit ]"));

    expect(await screen.findByText("Incorrect credentials")).toBeInTheDocument();
  });

  it("shows server error on fetch failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Server error"));

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("[ Submit ]"));

    expect(await screen.findByText("Something went wrong on our end, Sorry, try again later")).toBeInTheDocument();
  });
});
