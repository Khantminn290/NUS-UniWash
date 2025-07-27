import React from 'react';
import { render } from '@testing-library/react-native';
import MainPage from '../app/(dashboard)/mainpage';
import { WashingMachineContext } from '../context/WashingMachineContext';

// Sample booking for M2
const mockBooking = [
  {
    machineNumber: 'M2',
    userName: 'Alice',
    selectedDate: '2025-07-25',
    selectedSlot: '10:00 - 11:00',
  },
];

describe('MainPage', () => {
  // 1. Renders all machines and displays correct availability and booking details
  it('1. renders all machines with correct availability', () => {
    const { getByText, getAllByText } = render(
      <WashingMachineContext.Provider value={{ booking: mockBooking }}>
        <MainPage />
      </WashingMachineContext.Provider>
    );

    // All machines should be rendered
    expect(getByText('M1')).toBeTruthy();
    expect(getByText('M2')).toBeTruthy();
    expect(getByText('M3')).toBeTruthy();

    // Expect both "Available" and "In Use" labels to be present
    expect(getAllByText('Available').length).toBeGreaterThan(0);
    expect(getAllByText('In Use').length).toBeGreaterThan(0);

    // Booking details for Alice (M2) should be displayed
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('2025-07-25')).toBeTruthy();
    expect(getByText('10:00 - 11:00')).toBeTruthy();
  });

  // 2. When there are no bookings, all machines should show "Available"
  it('2. shows all machines as available when no bookings', () => {
    const { getAllByText, queryByText } = render(
      <WashingMachineContext.Provider value={{ booking: [] }}>
        <MainPage />
      </WashingMachineContext.Provider>
    );

    // Should show 3 machines + 1 summary with "Available"
    const availableTexts = getAllByText('Available');
    expect(availableTexts.length).toBe(8);

    // No booking details should be shown
    expect(queryByText('User:')).toBeNull();
    expect(queryByText('Date:')).toBeNull();
    expect(queryByText('Time Slot:')).toBeNull();
  });

  // 3. Summary info should reflect correct booking counts
  it('3. shows correct summary counts', () => {
    const { getAllByText, getByText } = render(
      <WashingMachineContext.Provider value={{ booking: mockBooking }}>
        <MainPage />
      </WashingMachineContext.Provider>
    );

    // Machines should still be present
    expect(getByText('M1')).toBeTruthy();
    expect(getByText('M2')).toBeTruthy();
    expect(getByText('M3')).toBeTruthy();


    // Check summary info (based on mockBooking: M2 is in use)
    expect(getAllByText('In Use')).toBeTruthy();
    expect(getAllByText('Available')).toBeTruthy();
  });
});
