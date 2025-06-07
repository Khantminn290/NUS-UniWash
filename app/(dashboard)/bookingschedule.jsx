import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const BookingSchedule = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('./bookingpage')}>
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // center vertically
    alignItems: 'center',      // center horizontally
    backgroundColor: '#FFF5E1', // cream theme background
  },
  button: {
    backgroundColor: '#FF6B35', // orange
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});