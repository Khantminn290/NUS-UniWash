import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../app/(auth)/loginpage';

// Mock router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useUser hook
const mockLogin = jest.fn();
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({
    login: mockLogin,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and submits login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Log In'));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('logs in with valid credentials and shows no error', async () => {
    mockLogin.mockResolvedValueOnce();

    const { getByPlaceholderText, getByText, queryByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'StrongPassword123!');
    fireEvent.press(getByText('Log In'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'StrongPassword123!');
      expect(queryByText(/Please enter a valid email address/i)).toBeNull();
      expect(queryByText(/error/i)).toBeNull();
    });
  });

  it('shows validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Log In'));

    const error = await findByText(/please enter a valid email address/i);
    expect(error).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows error if login throws', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText, findByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Log In'));

    const error = await findByText(/invalid credentials/i);
    expect(error).toBeTruthy();
    expect(mockLogin).toHaveBeenCalled();
  });
});
