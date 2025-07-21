import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupPage from '../app/(auth)/signuppage';

// ✅ Declare mocks at top level
const mockRegister = jest.fn();
const mockPush = jest.fn();

// ✅ Inject them into mocks
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
    createVerification: jest.fn(() => Promise.resolve()),
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

  it('calls register and sends verification email on valid input', async () => {
    const { account } = require('../lib/appwrite');

    mockRegister.mockResolvedValueOnce();
    account.createVerification.mockResolvedValueOnce();

    const { getByPlaceholderText, getByTestId } = render(<SignupPage />);
    
    fireEvent.changeText(getByPlaceholderText('Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'e1234567@u.nus.edu');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Valid1!Password');
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('e1234567@u.nus.edu', 'Valid1!Password', 'Test User');
      expect(account.createVerification).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/verifyemail');
    });
  });
});
