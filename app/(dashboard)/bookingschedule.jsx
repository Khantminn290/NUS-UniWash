import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAdminBooking } from '../../hooks/useAdminBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import dayjs from 'dayjs';

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
  '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00'
];

const machineList = ['M1', 'M2', 'M3'];

const next7Days = Array.from({ length: 7 }, (_, i) =>
  dayjs().add(i, 'day').format('YYYY-MM-DD')
);

const BookingSchedule = () => {
  const { booking } = useAdminBooking();
  const [selectedDate, setSelectedDate] = useState(next7Days[0]);

  // Filter bookings for selected date
  const bookingsForDate = booking.filter(b => b.selectedDate === selectedDate);

  // Helper to get status
  const getSlotStatus = (machine, slot) => {
    const match = bookingsForDate.find(
      b => b.machineNumber === machine && b.selectedSlot === slot
    );
    if (match) return `❌ ${match.userName}`;
    return '✅ Available';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
        {next7Days.map(date => (
          <Pressable
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.selectedDateButton
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === date && styles.selectedDateText
              ]}
            >
              {dayjs(date).format('ddd, MMM D')}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Time</Text>
        {machineList.map(machine => (
          <Text key={machine} style={styles.headerCell}>Machine {machine}</Text>
        ))}
      </View>

      {/* Table Body */}
      <ScrollView style={styles.scrollView}>
        {timeSlots.map(slot => (
          <View key={slot} style={styles.row}>
            <Text style={styles.cell}>{slot}</Text>
            {machineList.map(machine => (
              <Text key={machine} style={styles.cell}>
                {getSlotStatus(machine, slot)}
              </Text>
            ))}
          </View>
        ))}
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
  dateSelector: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFE5B4',
    marginRight: 10,
    borderRadius: 8,
  },
  selectedDateButton: {
    backgroundColor: '#FFD580',
  },
  dateText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFE5B4',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFF',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
});
