import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UpdateParticulars from '../app/(dashboard)/updateparticulars';
import { useUser } from '../hooks/useUser';
import { Alert } from 'react-native';
import { router } from 'expo-router';

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

  it('displays the user\'s current name in the input', () => {
    const { getByDisplayValue } = render(<UpdateParticulars />);
    expect(getByDisplayValue('John Doe')).toBeTruthy();
  });

  it('updates input value when typing', () => {
    const { getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');

    fireEvent.changeText(input, 'Jane Doe');
    expect(input.props.value).toBe('Jane Doe');
  });

  it('shows alert if name is empty on save', () => {
    const { getByText, getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');
    const saveButton = getByText('Save Changes');

    fireEvent.changeText(input, '  ');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Name cannot be empty');
    expect(mockChangeUserName).not.toHaveBeenCalled();
  });

  it('calls changeUserName and shows success alert on valid input', async () => {
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

  it('shows error alert if changeUserName throws an error', async () => {
    mockChangeUserName.mockRejectedValueOnce(new Error('Something failed'));

    const { getByText, getByPlaceholderText } = render(<UpdateParticulars />);
    const input = getByPlaceholderText('Enter your name');
    fireEvent.changeText(input, 'Another Name');

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Something went wrong while updating');
    });
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<UpdateParticulars />);
    fireEvent.press(getByText('Back'));

    expect(router.push).toHaveBeenCalledWith('./profilepage');
  });
});