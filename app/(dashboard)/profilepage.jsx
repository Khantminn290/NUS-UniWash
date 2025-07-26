import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { databases } from '../../lib/appwrite'; // Update this to match your setup
import { Query } from 'react-native-appwrite';
import dayjs from 'dayjs';

const ProfilePage = () => {
  const { logout, user } = useUser();
  const [timeLeft, setTimeLeft] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);

  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00',
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const today = dayjs().format('YYYY-MM-DD');
        const now = dayjs();
        
        const response = await databases.listDocuments("6843fa14001fa0d2b7e6","6843fa25003cb5d52a58" , [
          Query.equal('userId', user.$id),
          Query.equal('selectedDate', today)
        ]);

        const bookingsToday = response.documents;

        for (let booking of bookingsToday) {
          const [start, end] = booking.selectedSlot.split(' - ');
          const startTime = dayjs(`${today}T${start}:00`);
          const endTime = dayjs(`${today}T${end}:00`);

          if (now.isAfter(startTime) && now.isBefore(endTime)) {
            setActiveBooking(booking);
            setTimeLeft(endTime.diff(now));
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();

    const interval = setInterval(() => {
      if (timeLeft !== null) {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const formatTimeLeft = (milliseconds) => {
    const mins = Math.floor(milliseconds / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logout Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutWrapper} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#FFA552" />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Countdown Timer */}
      {activeBooking && timeLeft > 0 && (
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>
            ⏳ Booking on {activeBooking.machineNumber} ends in {formatTimeLeft(timeLeft)}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./updateparticulars')}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Update Particulars</Text>
        </TouchableOpacity>

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
  timerBox: {
    backgroundColor: '#FFF3C4',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
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