import { render, screen } from "@testing-library/react";
import Index from "../app/page";
import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    const { priority, ...rest } = props;
    return <img {...rest} />;
  },
}));


describe("Home Page", () => {
  it("renders the logo image", () => {
    render(<Index />);
    const logo = screen.getByAltText("nogas-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/fire.svg");
  });

  it("renders welcome message", () => {
    render(<Index />);
    expect(screen.getByText("You've reached Nogas")).toBeInTheDocument();
  });

  it("renders 'Get started' button with correct link", () => {
    render(<Index />);
    const getStartedLink = screen.getByRole("link", { name: "Get started" });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute("href", "/register");
  });

  it("renders login link in the footer", () => {
    render(<Index />);
    const loginLink = screen.getByRole("link", { name: "login here." });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
