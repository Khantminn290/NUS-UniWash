import React from 'react';
import { render } from '@testing-library/react-native';
import MainPage from '../app/(dashboard)/mainpage';
import { WashingMachineContext } from '../context/WashingMachineContext';

const mockBooking = [
  {
    machineNumber: 'M2',
    userName: 'Alice',
    selectedDate: '2025-07-25',
    selectedSlot: '10:00 - 11:00',
  },
];

describe('MainPage', () => {
  it('renders all machines with correct availability', () => {
    const { getByText, getAllByText } = render(
      <WashingMachineContext.Provider value={{ booking: mockBooking }}>
        <MainPage />
      </WashingMachineContext.Provider>
    );

    expect(getByText('M1')).toBeTruthy();
    expect(getByText('M2')).toBeTruthy();
    expect(getByText('M3')).toBeTruthy();

    // Should render at least one "Available" and one "In Use"
    expect(getAllByText('Available').length).toBeGreaterThan(0);
    expect(getAllByText('In Use').length).toBeGreaterThan(0);

    // Check that M2 booking details are rendered
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('2025-07-25')).toBeTruthy();
    expect(getByText('10:00 - 11:00')).toBeTruthy();
  });

  it('shows all machines as available when no bookings', () => {
  const { getAllByText, queryByText } = render(
    <WashingMachineContext.Provider value={{ booking: [] }}>
      <MainPage />
    </WashingMachineContext.Provider>
  );

  const availableTexts = getAllByText('Available');
  expect(availableTexts.length).toBe(8); // 3 machines + 1 summary

  // Only "In Use" in the summary, no user booking info should be rendered
  expect(queryByText('User:')).toBeNull();
  expect(queryByText('Date:')).toBeNull();
  expect(queryByText('Time Slot:')).toBeNull();
});

  it('shows correct summary counts', () => {
    const { getByText } = render(
      <WashingMachineContext.Provider value={{ booking: mockBooking }}>
        <MainPage />
      </WashingMachineContext.Provider>
    );

    expect(getByText('M1')).toBeTruthy(); // In Use
    expect(getByText('M2')).toBeTruthy(); // Available
  });
});
