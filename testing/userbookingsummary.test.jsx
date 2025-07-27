import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import UserBookingSummary from '../app/(dashboard)/userbookingsummary';
import { useBooking } from '../hooks/useBooking';
import { Alert } from 'react-native';

// Mock the router.push function
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock useBooking hook
jest.mock('../hooks/useBooking');

describe('UserBookingSummary Unit Tests', () => {
  const mockDeleteBooking = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Alert.alert behavior
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const deleteButton = buttons.find(button => button.text === 'Delete');
      if (deleteButton?.onPress) deleteButton.onPress();
    });
  });

  it('renders booking data correctly', () => {
    useBooking.mockReturnValue({
      booking: [
        {
          $id: '1',
          machineNumber: 'M1',
          selectedDate: '2025-07-25',
          selectedSlot: '10:00 - 11:00',
        },
      ],
      deleteBooking: mockDeleteBooking,
    });

    const { getByText } = render(<UserBookingSummary />);

    expect(getByText('Machine: M1')).toBeTruthy();
    expect(getByText('Date: 2025-07-25')).toBeTruthy();
    expect(getByText('Time Slot: 10:00 - 11:00')).toBeTruthy();
  });

  it('calls Alert.alert with correct params when delete button pressed', async () => {
    useBooking.mockReturnValue({
      booking: [
        {
          $id: '1',
          machineNumber: 'M1',
          selectedDate: '2025-07-25',
          selectedSlot: '10:00 - 11:00',
        },
      ],
      deleteBooking: mockDeleteBooking,
    });

    const { getByTestId } = render(<UserBookingSummary />);

    await act(async () => {
      fireEvent.press(getByTestId('delete-button-1'));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Cancel Booking",
      "Are you sure you want to delete this booking?",
      expect.any(Array)
    );
  });

  it('calls deleteBooking when Alert "Delete" button pressed', async () => {
    useBooking.mockReturnValue({
      booking: [
        {
          $id: '1',
          machineNumber: 'M1',
          selectedDate: '2025-07-25',
          selectedSlot: '10:00 - 11:00',
        },
      ],
      deleteBooking: mockDeleteBooking,
    });

    const { getByTestId } = render(<UserBookingSummary />);

    await act(async () => {
      fireEvent.press(getByTestId('delete-button-1'));
    });

    await waitFor(() => {
      expect(mockDeleteBooking).toHaveBeenCalledWith('1');
    });
  });
});
