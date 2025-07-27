import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../app/(auth)/loginpage';

// Mock the router to test navigation behavior
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the useUser hook for login functionality
const mockLogin = jest.fn();
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({
    login: mockLogin,
  }),
}));

describe('LoginPage', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Basic form submission test
  it('1. renders and submits login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    // Fill in email and password
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Press the login button
    fireEvent.press(getByText('Log In'));

    // Expect login to be called with the correct credentials
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  // 2. Valid login without showing any errors
  it('2. logs in with valid credentials and shows no error', async () => {
    mockLogin.mockResolvedValueOnce(); // Simulate successful login

    const { getByPlaceholderText, getByText, queryByText } = render(<LoginPage />);

    // Provide valid email and password
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'StrongPassword123!');
    fireEvent.press(getByText('Log In'));

    // Ensure login is called correctly and no error messages are shown
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'StrongPassword123!');
      expect(queryByText(/Please enter a valid email address/i)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();
    });
  });

  // 3. Invalid email format should trigger validation error
  it('3. shows validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginPage />);

    // Enter invalid email and attempt to log in
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Log In'));

    // Expect a validation error to be shown and login not to be called
    const error = await findByText(/please enter a valid email address/i);
    expect(error).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // 4. Login failure should display error message
  it('4. shows error if login throws', async () => {
    // Simulate login failure with error message
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText, findByText } = render(<LoginPage />);

    // Enter incorrect credentials and attempt login
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Log In'));

    // Expect an error message to appear
    const error = await findByText(/invalid credentials/i);
    expect(error).toBeTruthy();
    expect(mockLogin).toHaveBeenCalled();
  });
});
