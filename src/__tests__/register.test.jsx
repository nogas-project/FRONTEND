import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../app/register/page';
import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    asPath: '/register',
    pathname: '/register',
    query: {},
    route: '/register',
  }),
  usePathname: () => '/register',
}));

describe('Register Component', () => {

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ mess: '5' }),
        })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui) => render(ui);

  it('renders all form fields', () => {
    renderWithRouter(<Register />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contact's Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contact's Email")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    renderWithRouter(<Register />);
    fireEvent.click(screen.getByText("[ Submit ]"));

    await waitFor(() => {
      expect(screen.getByText('You need to enter your first name')).toBeInTheDocument();
      expect(screen.getByText('You need to enter your last name')).toBeInTheDocument();
      expect(screen.getByText('Your email should look like this: example@email.com')).toBeInTheDocument();
      expect(screen.getByText('Your password must be at least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('Your phone number should look like this: 555-555-5555')).toBeInTheDocument();
      expect(screen.getByText("Make sure to have at least one emergency contact")).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithRouter(<Register />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText("[ Submit ]"));

    await waitFor(() => {
      expect(screen.getByText('Your email should look like this: example@email.com')).toBeInTheDocument();
    });
  });

  it('validates password match', async () => {
    renderWithRouter(<Register />);
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('Password');
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: 'mismatch' } });
    fireEvent.click(screen.getByText("[ Submit ]"));

    await waitFor(() => {
      expect(screen.getByText("Your password doesn't match")).toBeInTheDocument();
    });
  });

  it('handles successful form submission', async () => {
    fetch.mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ mess: 'user123' }) })
    );

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Number'), { target: { value: '555-555-5555' } });
    fireEvent.change(screen.getByPlaceholderText("Contact's Name"), { target: { value: 'Emergency Contact' } });
    fireEvent.change(screen.getByPlaceholderText("Contact's Email"), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByText("[ Submit ]"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3001/auth/register',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              password: 'password123',
              phone: '555-555-5555',
            }),
          })
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('adds and removes emergency contacts', async () => {
    renderWithRouter(<Register />);
    
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    expect(screen.getAllByPlaceholderText("Contact's Name")).toHaveLength(2);
    
    const removeButton = screen.getByText('-');
    fireEvent.click(removeButton);
    expect(screen.getAllByPlaceholderText("Contact's Name")).toHaveLength(1);
  });

});