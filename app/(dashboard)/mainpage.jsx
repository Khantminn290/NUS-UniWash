import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../hooks/useUser'

const initialMachines = [
  { id: 1, status: 'Available' },
  { id: 2, status: 'Available' },
  { id: 3, status: 'Available' },
  { id: 4, status: 'Available' },
  { id: 5, status: 'Available' },
  { id: 6, status: 'Available' },
  { id: 7, status: 'Available' },
];

const MainPage = () => {
  const { user } = useUser();
  const [machines, setMachines] = useState(initialMachines);

  const toggleStatus = (id) => {
    const updated = machines.map((machine) =>
      machine.id === id
        ? { ...machine, status: machine.status === 'Available' ? 'In Use' : 'Available' }
        : machine
    );
    setMachines(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
      </View>
      
      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>Washing Machine Status</Text>
        <ScrollView style={{ width: '100%' }}>
          {machines.map((machine) => (
            <View key={machine.id} style={styles.machineRow}>
              <Image
                source={require('../../assets/washing_machine_animated.jpg')}
                style={styles.machineIcon}
              />
              <View style={styles.machineInfo}>
                <Text style={styles.machineLabel}>Machine {machine.id}</Text>
                <Text
                  style={[
                    styles.machineStatus,
                    machine.status === 'Available' ? styles.statusAvailable : styles.statusInUse,
                  ]}
                >
                  {machine.status}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  machine.status !== 'Available' && { backgroundColor: '#ccc' },
                ]}
                onPress={() => toggleStatus(machine.id)}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dashboard: {
    flex: 1,
    alignItems: 'center',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  machineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  machineIcon: {
    width: 50,
    height: 40,
    marginRight: 12,
  },
  machineInfo: {
    flex: 1,
  },
  machineLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  machineStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  statusAvailable: {
    color: 'green',
  },
  statusInUse: {
    color: 'red',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});