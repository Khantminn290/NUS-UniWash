import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginPage from '../app/(auth)/loginpage';

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
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
  it('renders and submits login form', () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Log In'));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
