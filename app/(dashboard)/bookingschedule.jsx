import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import React from 'react';
import { useAdminBooking } from '../../hooks/useAdminBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BookingSchedule = () => {
  const { booking, getAllBookings} = useAdminBooking();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with title and refresh button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FF6B35" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        
        <Text style={styles.title}>All Bookings</Text>
        
        <Pressable onPress={getAllBookings} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FF6B35" />
        </Pressable>
      </View>

      {/* Book Button */}
      <Pressable 
        style={styles.bookButton}
        onPress={() => router.push('./bookingpage')}
      >
        <Text style={styles.bookButtonText}>Create New Booking</Text>
      </Pressable>

      {/* Bookings List */}
      <FlatList
        data={booking}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>Machine: {item.machineNumber}</Text>
              <Text style={styles.cardText}>Date: {item.selectedDate}</Text>
              <Text style={styles.cardText}>Time: {item.selectedSlot}</Text>
              <Text style={styles.userText}>User: {item.userName}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default BookingSchedule;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  refreshButton: {
    padding: 8,
  borderRadius: 20,
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFE5B4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
});