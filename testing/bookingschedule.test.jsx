import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookingSchedule from '../app/(dashboard)/bookingschedule';
import { useAdminBooking } from '../hooks/useAdminBooking';
import { router } from 'expo-router';
import dayjs from 'dayjs';

// Mock hooks and router
jest.mock('../hooks/useAdminBooking');
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock booking data for today
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
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render header title and Create Booking button
  it('1. renders header with title and create booking button', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getByText } = render(<BookingSchedule />);
    expect(getByText('All Bookings')).toBeTruthy();
    expect(getByText('Create Booking')).toBeTruthy();
  });

  // 2. Selected date is visually highlighted (bold)
  it('2. highlights selected date correctly', () => {
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

  // 3. All empty slots should show "Available"
  it('3. shows "Available" when no booking exists for that slot', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getAllByText } = render(<BookingSchedule />);
    expect(getAllByText('Available').length).toBeGreaterThan(0);
  });

  // 4. View updates when another date is pressed
  it('4. updates view when a different date is selected', () => {
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

  // 5. Displays user name in booked time slot
  it('5. displays user name in booked slot', () => {
    useAdminBooking.mockReturnValue({ booking: mockBookings });

    const { getByText } = render(<BookingSchedule />);
    expect(getByText('Alice')).toBeTruthy();
  });

  // 6. Pressing Create Booking navigates to booking page
  it('6. navigates to booking page when "Create Booking" is pressed', () => {
    useAdminBooking.mockReturnValue({ booking: [] });

    const { getByText } = render(<BookingSchedule />);
    fireEvent.press(getByText('Create Booking'));

    expect(router.push).toHaveBeenCalledWith('./bookingpage');
  });
});
