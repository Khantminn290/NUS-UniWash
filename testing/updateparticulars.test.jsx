import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UpdateParticulars from '../app/(dashboard)/updateparticulars';
import { useUser } from '../hooks/useUser';
import { Alert } from 'react-native';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('../hooks/useUser');
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('UpdateParticulars Component', () => {
  const mockChangeUserName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({
      user: { name: 'John Doe' },
      changeUserName: mockChangeUserName,
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  // 1. Renders current user name in input field
  it('1. displays the user\'s current name in the input', () => {
    const { getByDisplayValue } = render(<UpdateParticulars />);
    expect(getByDisplayValue('John Doe')).toBeTruthy();
  });

  // 2. Allows user to type and update input value
  it('2. updates input value when typing', () => {
    const { getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');

    fireEvent.changeText(input, 'Jane Doe');
    expect(input.props.value).toBe('Jane Doe');
  });

  // 3. Shows error alert if user tries to save with an empty name
  it('3. shows alert if name is empty on save', () => {
    const { getByText, getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');
    const saveButton = getByText('Save Changes');

    fireEvent.changeText(input, '  ');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Name cannot be empty');
    expect(mockChangeUserName).not.toHaveBeenCalled();
  });

  // 4. Successfully changes name and shows success alert
  it('4. calls changeUserName and shows success alert on valid input', async () => {
    mockChangeUserName.mockResolvedValueOnce();

    const { getByText, getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');
    fireEvent.changeText(input, 'New Name');

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(mockChangeUserName).toHaveBeenCalledWith('New Name');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Name updated successfully');
    });
  });

  // 5. Handles backend error when updating name fails
  it('5. shows error alert if changeUserName throws an error', async () => {
    mockChangeUserName.mockRejectedValueOnce(new Error('Something failed'));

    const { getByText, getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');
    fireEvent.changeText(input, 'Another Name');

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Something went wrong while updating');
    });
  });

  // 6. Navigates back to profile page on button press
  it('6. navigates back when back button is pressed', () => {
    const { getByText } = render(<UpdateParticulars />);
    fireEvent.press(getByText('Back'));

    expect(router.push).toHaveBeenCalledWith('./profilepage');
  });
});
