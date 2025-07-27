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
