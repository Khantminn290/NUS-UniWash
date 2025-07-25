import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookingSchedule from '../app/(dashboard)/bookingschedule';
import { useAdminBooking } from '../hooks/useAdminBooking';
import { router } from 'expo-router';
import dayjs from 'dayjs';

jest.mock('../hooks/useAdminBooking');
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const mockBookings = [
  {
    $id: '1',
    machineNumber: 'M2',
    selectedDate: dayjs().format('YYYY-MM-DD'),
    selectedSlot: '10:00 - 11:00',
    userName: 'Alice',
  },
];

describe('BookingSchedule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with title and create booking button', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getByText } = render(<BookingSchedule />);
    expect(getByText('All Bookings')).toBeTruthy();
    expect(getByText('Create Booking')).toBeTruthy();
  });

  it('highlights selected date correctly', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const todayFormatted = dayjs().format('ddd, MMM D');
    const { getByText } = render(<BookingSchedule />);

    const selectedDateButton = getByText(todayFormatted);
    const styles = selectedDateButton.props.style;

    const isHighlighted = Array.isArray(styles)
      ? styles.some(style => style?.fontWeight === '700')
      : styles?.fontWeight === '700';

    expect(isHighlighted).toBe(true);
  });

  it('shows "Available" when no booking exists for that slot', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getAllByText } = render(<BookingSchedule />);
    expect(getAllByText('Available').length).toBeGreaterThan(0);
  });

  it('updates view when a different date is selected', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getByText } = render(<BookingSchedule />);
    const targetDate = dayjs().add(1, 'day').format('ddd, MMM D');

    const dateButton = getByText(targetDate);
    fireEvent.press(dateButton);

    const styles = dateButton.props.style;
    const isHighlighted = Array.isArray(styles)
      ? styles.some(style => style?.fontWeight === '700')
      : styles?.fontWeight === '700';

    expect(isHighlighted).toBe(true);
  });

  it('displays user name in booked slot', () => {
    useAdminBooking.mockReturnValue({ booking: mockBookings });

    const { getByText } = render(<BookingSchedule />);
    expect(getByText('Alice')).toBeTruthy();
  });

  it('navigates to booking page when "Create Booking" is pressed', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getByText } = render(<BookingSchedule />);
    fireEvent.press(getByText('Create Booking'));

    expect(router.push).toHaveBeenCalledWith('./bookingpage');
  });
});
