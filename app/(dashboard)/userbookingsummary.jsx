import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const UserBookingSummary = () => {
  const { booking, deleteBooking } = useBooking();

  const handleDelete = (id) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBooking(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.push('./profilepage')}>
        <Ionicons name="arrow-back" size={24} color="#FF6B35" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.title}>My Booking Summary</Text>

      <FlatList
        data={booking}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>Machine: {item.machineNumber}</Text>
              <Text style={styles.cardText}>Date: {item.selectedDate}</Text>
              <Text style={styles.cardText}>Time Slot: {item.selectedSlot}</Text>
            </View>
            <Pressable onPress={() => handleDelete(item.$id)}>
              <Ionicons name="trash" size={24} color="#FF6B35" />
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default UserBookingSummary;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 16,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
});
