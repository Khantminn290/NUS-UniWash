import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { databases } from '../../lib/appwrite';
import { Query } from 'react-native-appwrite';
import dayjs from 'dayjs';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const ProfilePage = () => {
  const { logout, user } = useUser(); // Get logout function and user info from context
  const [activeBooking, setActiveBooking] = useState(null); // Store the current booking (if active)
  const [timeLeft, setTimeLeft] = useState(null); // Countdown time left for active booking
  const [bookingDuration, setBookingDuration] = useState(3600); // Default booking duration in seconds (1 hour)

  useEffect(() => {
    // Set an interval to check for active bookings every second
    const interval = setInterval(async () => {
      try {
        const today = dayjs().format('YYYY-MM-DD'); // Current date
        const now = dayjs(); // Current time

        // Fetch all bookings for the current user on today's date
        const response = await databases.listDocuments(
          "6843fa14001fa0d2b7e6", // Database ID
          "6843fa25003cb5d52a58", // Collection ID
          [
            Query.equal('userId', user.$id),
            Query.equal('selectedDate', today)
          ]
        );

        const bookingsToday = response.documents;
        let foundBooking = null;

        // Loop through bookings to find one currently active
        for (let booking of bookingsToday) {
          if (!booking.selectedSlot) continue;

          const [start, end] = booking.selectedSlot.split(' - ');
          const startTime = dayjs(`${today}T${start}:00`);
          const endTime = dayjs(`${today}T${end}:00`);

          // If now is between booking time
          if (now.isAfter(startTime) && now.isBefore(endTime)) {
            foundBooking = booking;
            const duration = endTime.diff(startTime, 'second'); // Calculate total duration
            const diff = endTime.diff(now, 'second'); // Calculate remaining time
            setTimeLeft(diff);
            setBookingDuration(duration);
            break;
          }
        }

        setActiveBooking(foundBooking);
        if (!foundBooking) setTimeLeft(null); // Reset if no booking found
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    }, 1000); // Repeat every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [user]);

  // Helper to format seconds to MM:SS
  const formatTimeLeft = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section with logout button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutWrapper} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Display user's profile info */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#FFA552" />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Display countdown timer only if a booking is active */}
      {activeBooking && timeLeft > 0 && (
        <View style={styles.circularWrapper}>
          <AnimatedCircularProgress
            size={160}
            width={12}
            fill={(timeLeft / bookingDuration) * 100} // Progress percentage
            tintColor="#FF6B35"
            backgroundColor="#FFE4C9"
            rotation={0}
            lineCap="round"
          >
            {
              () => (
                <Text style={styles.circularText}>
                  ⏳ {formatTimeLeft(timeLeft)}
                </Text>
              )
            }
          </AnimatedCircularProgress>
          <Text style={styles.machineText}>
            Booking on {activeBooking.machineNumber}
          </Text>
        </View>
      )}

      {/* Action buttons for navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>

        {/* Navigate to update particulars page */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./updateparticulars')}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Update Particulars</Text>
        </TouchableOpacity>

        {/* Navigate to view booking summary */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./userbookingsummary')}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>View My Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;

// Style definitions
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  header: {
    alignItems: 'flex-end',
    padding: 16,
  },
  logoutWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  circularWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circularText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  machineText: {
    marginTop: 8,
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
