import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WashingMachineContext } from '../../context/WashingMachineContext'; // Shared booking data context
import dayjs from 'dayjs';

const MainPage = () => {
  const { booking } = useContext(WashingMachineContext); // List of current bookings from global context
  const [currentTime, setCurrentTime] = useState(dayjs()); // Real-time clock to update remaining time

  // Update current time every second (to show real-time countdowns)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Static list of all washing machines
  const allMachines = ['M1', 'M2', 'M3','M4','M5','M6','M7'];

  // Converts remaining seconds into MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculates how much time is left for an ongoing booking
  const getTimeLeft = (selectedDate, selectedSlot) => {
    const [start] = selectedSlot.split(' - '); // Only need start time
    const startTime = dayjs(`${selectedDate}T${start}:00`);
    const endTime = startTime.add(1, 'hour');
    const secondsLeft = endTime.diff(currentTime, 'second');
    const isActive = currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    return isActive && secondsLeft > 0 ? formatTime(secondsLeft) : null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Laundry Dashboard</Text>
        <Text style={styles.subtitle}>Current Machine Status</Text>
      </View>

      {/* Summary Statistics */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{booking.length}</Text>
          <Text style={styles.summaryText}>In Use</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{allMachines.length - booking.length}</Text>
          <Text style={styles.summaryText}>Available</Text>
        </View>
      </View>

      {/* List of All Machines */}
      <FlatList
        data={allMachines}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const machineBooking = booking.find(b => b.machineNumber === item); // Find if this machine is booked
          const isAvailable = !machineBooking; // Check availability

          let timeLeft = null;
          if (machineBooking) {
            timeLeft = getTimeLeft(machineBooking.selectedDate, machineBooking.selectedSlot); // Get time remaining
          }

          return (
            <View style={[styles.card, isAvailable ? styles.available : styles.inUse]}>
              {/* Machine Header Row */}
              <View style={styles.machineHeader}>
                <Image 
                  source={require('../../assets/washing_machine_animated.jpg')} 
                  style={styles.machineIcon}
                />
                <Text style={styles.machineText}>{item}</Text>

                {/* Status Badge */}
                <View style={[styles.statusIndicator, isAvailable ? styles.availableIndicator : styles.inUseIndicator]}>
                  <Text style={styles.statusIndicatorText}>
                    {isAvailable ? 'Available' : 'In Use'}
                  </Text>
                </View>
              </View>

              {/* Booking Details */}
              {!isAvailable && (
                <View style={styles.bookingInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>User:</Text>
                    <Text style={styles.infoValue}>{machineBooking.userName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{machineBooking.selectedDate}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Time Slot:</Text>
                    <Text style={styles.infoValue}>
                      {machineBooking.selectedSlot}
                      {timeLeft && ` | ${timeLeft} left`} {/* Live countdown */}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1', // Cream background
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6B35', // Orange header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B35', // Orange
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  available: {
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50', // Green
  },
  inUse: {
    borderLeftWidth: 6,
    borderLeftColor: '#FF6B35', // Orange
  },
  machineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  machineIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    backgroundColor: '#FFF5E1', // Your cream color
    borderRadius: 8,
  },
  machineText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  availableIndicator: {
    backgroundColor: '#E8F5E9', // Light green
  },
  inUseIndicator: {
    backgroundColor: '#FFEBEE', // Light red
  },
  statusIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
