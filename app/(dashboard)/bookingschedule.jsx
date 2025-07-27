import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useAdminBooking } from '../../hooks/useAdminBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import dayjs from 'dayjs';

// different time slots given to users to book the machines
const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
  '20:00 - 21:00','21:00 - 22:00','22:00 - 23:00','23:00 - 24:00',
];

// machines available at Helix House
const machineList = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'];

// number of days in advance to enable users to book the washing machines
const next7Days = Array.from({ length: 7 }, (_, i) =>
  dayjs().add(i, 'day').format('YYYY-MM-DD')
);

const BookingSchedule = () => {
  const { booking } = useAdminBooking();
  const [selectedDate, setSelectedDate] = useState(next7Days[0]);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const bookingsForDate = booking.filter(b => b.selectedDate === selectedDate);

  const getSlotInfo = (machine, slot) => {
    const match = bookingsForDate.find(
      b => b.machineNumber === machine && b.selectedSlot === slot
    );
    return match ? { booked: true, userName: match.userName } : { booked: false };
  };

  const visibleMachines = selectedMachine ? [selectedMachine] : machineList;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Bookings</Text>
        <Pressable
          style={styles.bookButton}
          onPress={() => router.push('./bookingpage')}
        >
          <Text style={styles.bookButtonText}>Create Booking</Text>
        </Pressable>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateSelectorContent}
        >
          {next7Days.map(date => (
            <Pressable
              key={date}
              style={[styles.dateButton, selectedDate === date && styles.selectedDateButton]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                {dayjs(date).format('ddd, MMM D')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Machine Filter */}
      <View style={styles.machineSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* All Machines Button */}
          <Pressable
            onPress={() => setSelectedMachine(null)}
            style={[styles.machineButton, selectedMachine === null && styles.selectedMachineButton]}
          >
            <Text style={styles.machineText}>All Machines</Text>
          </Pressable>

          {machineList.map(machine => (
            <Pressable
              key={machine}
              onPress={() => setSelectedMachine(machine === selectedMachine ? null : machine)}
              style={[styles.machineButton, selectedMachine === machine && styles.selectedMachineButton]}
            >
              <Text style={styles.machineText}>{machine}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Booking Table */}
      <ScrollView horizontal style={styles.tableWrapper}>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.timeColumn]}>
              <Text style={styles.headerText}>Time</Text>
            </View>
            {visibleMachines.map(machine => (
              <View key={machine} style={styles.headerCell}>
                <Text style={styles.headerText}>{machine}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          <ScrollView style={{ maxHeight: '75%' }}>
            {timeSlots.map(slot => (
              <View key={slot} style={styles.row}>
                <View style={[styles.cell, styles.timeColumn]}>
                  <Text numberOfLines={1} style={styles.cellText}>{slot}</Text>
                </View>
                {visibleMachines.map(machine => {
                  const info = getSlotInfo(machine, slot);
                  return (
                    <View
                      key={machine}
                      style={[styles.cell, info.booked ? styles.bookedCell : styles.availableCell]}
                    >
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cellText}>
                        {info.booked ? info.userName : 'Available'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSchedule;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  dateSelectorContainer: {
    height: 50,
    marginBottom: 8,
  },
  dateSelectorContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFE5B4',
    marginRight: 12,
    borderRadius: 8,
  },
  selectedDateButton: {
    backgroundColor: '#FFB347',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  selectedDateText: {
    fontWeight: '700',
    color: '#FFF',
  },
  machineSelectorContainer: {
    height: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  machineButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFE5B4',
    marginRight: 10,
    borderRadius: 8,
  },
  selectedMachineButton: {
    backgroundColor: '#FFB347',
  },
  machineText: {
    fontSize: 14,
    color: '#333',
  },
  tableWrapper: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FCD5B4',
    paddingVertical: 10,
  },
  headerCell: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  timeColumn: {
    width: 120,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  cell: {
    width: 100,
    padding: 8,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  cellText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  availableCell: {
    backgroundColor: '#C9F7C9',
  },
  bookedCell: {
    backgroundColor: '#F8D7DA',
  },
});
