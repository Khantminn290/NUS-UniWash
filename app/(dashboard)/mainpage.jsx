import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WashingMachineContext } from '../../context/WashingMachineContext';

const MainPage = () => {
  const { booking } = useContext(WashingMachineContext);

  // List of all machines
  const allMachines = ['M1', 'M2', 'M3'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Laundry Dashboard</Text>
        <Text style={styles.subtitle}>Current Machine Status</Text>
      </View>

      {/* Status Summary */}
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

      {/* Machines List */}
      <FlatList
        data={allMachines}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const machineBooking = booking.find(b => b.machineNumber === item);
          const isAvailable = !machineBooking;

          return (
            <View style={[styles.card, isAvailable ? styles.available : styles.inUse]}>
              <View style={styles.machineHeader}>
                <Image 
                  source={require('../../assets/washing_machine_animated.jpg')} 
                  style={styles.machineIcon}
                />
                <Text style={styles.machineText}>{item}</Text>
                <View style={[styles.statusIndicator, isAvailable ? styles.availableIndicator : styles.inUseIndicator]}>
                  <Text style={styles.statusIndicatorText}>
                    {isAvailable ? 'Available' : 'In Use'}
                  </Text>
                </View>
              </View>

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
                    <Text style={styles.infoValue}>{machineBooking.selectedSlot}</Text>
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