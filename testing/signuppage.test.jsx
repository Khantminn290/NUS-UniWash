import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupPage from '../app/(auth)/signuppage';

// Mocks
const mockRegister = jest.fn();
const mockPush = jest.fn();
const mockCreateVerification = jest.fn(() => Promise.resolve());

// Mocking router push
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mocking user registration logic
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({ 
    register: mockRegister, 
    user: null 
  }),
}));

// Mocking Appwrite's email verification call
jest.mock('../lib/appwrite', () => ({
  account: {
    createVerification: mockCreateVerification,
  },
}));

describe('SignupPage', () => {
  // Clear mock data before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Show validation error for non-NUS email
  it('1. shows error for invalid NUS email', () => {
    const { getByPlaceholderText, getByTestId, queryByText } = render(<SignupPage />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid@gmail.com');
    fireEvent.press(getByTestId('signup-button')); 
    
    expect(queryByText(/Please enter a valid NUS email address/)).toBeTruthy();
  });

  // 2. Show error for weak password that doesn't meet criteria
  it('2. shows an error for weak password', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<SignupPage />);
    
    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'e1234567@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'weakpass'); // Weak password
    fireEvent.press(getByTestId('signup-button'));

    const errorMessage = await findByText(/Password must contain/i);
    expect(errorMessage).toBeTruthy();
  });

  // 3. Show error if registration fails (e.g., network/server error)
  it('3. shows error if register throws', async () => {
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
