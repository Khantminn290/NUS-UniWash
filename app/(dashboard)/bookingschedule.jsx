import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useAdminBooking } from '../../hooks/useAdminBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import dayjs from 'dayjs';

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
  '20:00 - 21:00', '21:00 - 22:00'
];

const machineList = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7'];

const next7Days = Array.from({ length: 7 }, (_, i) =>
  dayjs().add(i, 'day').format('YYYY-MM-DD')
);

const BookingSchedule = () => {
  const { booking } = useAdminBooking();
  const [selectedDate, setSelectedDate] = useState(next7Days[0]);

  const bookingsForDate = booking.filter(b => b.selectedDate === selectedDate);

  const getSlotInfo = (machine, slot) => {
    const match = bookingsForDate.find(
      b => b.machineNumber === machine && b.selectedSlot === slot
    );
    return match ? { booked: true, userName: match.userName } : { booked: false };
  };

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

      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.timeColumn]}>Time</Text>
            {machineList.map(machine => (
              <Text key={machine} style={styles.headerCell}>Machine {machine}</Text>
            ))}
          </View>

          {/* Table Rows */}
          <ScrollView style={styles.scrollView}>
            {timeSlots.map(slot => (
              <View key={slot} style={styles.row}>
                <Text style={[styles.cell, styles.timeColumn]}>{slot}</Text>
                {machineList.map(machine => {
                  const info = getSlotInfo(machine, slot);
                  return (
                    <View
                      key={machine}
                      style={[styles.cell, info.booked ? styles.bookedCell : styles.availableCell]}
                    >
                      <Text style={styles.cellText}>
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
    marginBottom: 15,
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FCD5B4',
    paddingVertical: 10,
  },
  headerCell: {
    minWidth: 100,
    fontWeight: '700',
    textAlign: 'center',
  },
  timeColumn: {
    minWidth: 120,
  },
  scrollView: {
    maxHeight: '75%', // limits scroll area so header stays visible
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cell: {
    minWidth: 100,
    padding: 8,
    margin: 2,
    alignItems: 'center',
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
