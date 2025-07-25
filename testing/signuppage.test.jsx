import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupPage from '../app/(auth)/signuppage';

const mockRegister = jest.fn();
const mockPush = jest.fn();
const mockCreateVerification = jest.fn(() => Promise.resolve());

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../hooks/useUser', () => ({
  useUser: () => ({ 
    register: mockRegister, 
    user: null 
  }),
}));

jest.mock('../lib/appwrite', () => ({
  account: {
    createVerification: mockCreateVerification,
  },
}));

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error for invalid NUS email', () => {
    const { getByPlaceholderText, getByTestId, queryByText } = render(<SignupPage />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid@gmail.com');
    fireEvent.press(getByTestId('signup-button')); 
    
    expect(queryByText(/Please enter a valid NUS email address/)).toBeTruthy();
  });

  it('shows an error for weak password', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<SignupPage />);
    
    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'e1234567@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'weakpass');
    fireEvent.press(getByTestId('signup-button'));

    const errorMessage = await findByText(/Password must contain/i);
    expect(errorMessage).toBeTruthy();
  });

  it('shows error if register throws', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Registration failed'));

    const { getByPlaceholderText, getByTestId, findByText } = render(<SignupPage />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'e1234567@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'ValidPass123!');

    fireEvent.press(getByTestId('signup-button'));

    const errorMessage = await findByText(/Registration failed/i);
    expect(errorMessage).toBeTruthy();
  });
});
