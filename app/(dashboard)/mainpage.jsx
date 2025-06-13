import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WashingMachineContext } from '../../context/WashingMachineContext';

const mainpage = () => {
  const { booking } = useContext(WashingMachineContext);

  // List of all available machines
  const allMachines = ['M1', 'M2', 'M3']; // You can fetch this from a backend if needed

  // Extract all currently booked machines from context
  const activeMachines = booking.map((b) => b.machineNumber);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Washing Machine Dashboard</Text>
      </View>

      <FlatList
        data={booking}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                Machines currently being used:
                {item.machineNumber}
              </Text>
              <Text>
                {item.selectedSlot}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default mainpage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  header: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: 'center',
  },
  available: {
    backgroundColor: '#C8E6C9', // Light green
  },
  booked: {
    backgroundColor: '#FFCDD2', // Light red
  },
  machineText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
});