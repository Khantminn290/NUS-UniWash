import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useAdminBooking } from '../../hooks/useAdminBooking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const machineOptions = ['M1', 'M2', 'M3'];

const bookingschedule = () => {
  const { booking } = useAdminBooking();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const filterBookings = booking.filter((item) => {
  const dateMatch = selectedDate ? item.selectedDate === selectedDate : true;
  const machineMatch = selectedMachine ? item.machineNumber === selectedMachine : true;
  return dateMatch && machineMatch;
});


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Bookings</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Create Booking */}
      <Pressable
        style={styles.bookButton}
        onPress={() => router.push('./bookingpage')}
      >
        <Text style={styles.bookButtonText}>Create New Booking</Text>
      </Pressable>

      {/* List */}
      <FlatList
        data={filterBookings}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>Machine: {item.machineNumber}</Text>
            <Text style={styles.cardText}>Date: {item.selectedDate}</Text>
            <Text style={styles.cardText}>Time: {item.selectedSlot}</Text>
            <Text style={styles.userText}>User: {item.userName}</Text>
          </View>
        )}
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Bookings</Text>

            {/* Date options */}
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.optionsContainer}>
              {getNext7Days().map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.optionButton,
                    selectedDate === date && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={styles.optionText}>{date}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Machine options */}
            <Text style={styles.sectionTitle}>Select Machine</Text>
            <View style={styles.optionsContainer}>
              {machineOptions.map((machine) => (
                <TouchableOpacity
                  key={machine}
                  style={[
                    styles.optionButton,
                    selectedMachine === machine && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedMachine(machine)}
                >
                  <Text style={styles.optionText}>Machine {machine}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => {
                  setSelectedDate(null);
                  setSelectedMachine(null);
                }}
              >
                <Text style={styles.modalButtonText}>Clear</Text>
              </Pressable>

              <Pressable
                style={styles.modalButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default bookingschedule;

const styles = StyleSheet.create({
  safeArea: {
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
  filterButton: {
    padding: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
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
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#EEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#FF9B55',
  },
  optionText: {
    color: '#333',
    fontSize: 14,
  },
  modalButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
});
