import React, { useState, useContext } from 'react';
import {View,Text,Button,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView, Keyboard, TouchableWithoutFeedback, Pressable} from 'react-native';
import dayjs from 'dayjs';
import { useUser } from '../../hooks/useUser';

const bookingpage = () => {
    const { user } = useUser();
    const [machineNumber, setMachineNumber] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const machines = ['M1', 'M2', 'M3'];
    const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
  ];

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day');
    return {
      label: date.format('ddd (MMM D)'), // e.g. Tue (Jun 4)
      value: date.format('YYYY-MM-DD'),  // for internal use
    };
  });

  const handleBooking = () => {
    if (!machineNumber || !selectedSlot || !selectedDate) {
      Alert.alert('Missing Info', 'Please select machine, date, and time slot.');
      return;
    }

    Alert.alert(
      'Booking Info',
      `User: ${user?.name}\nMachine: ${machineNumber}\nDate: ${selectedDate}\nSlot: ${selectedSlot}`
    );
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Make a Booking</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          value={user?.name || ''}
          editable={false}
          style={[styles.input, { backgroundColor: '#f0f0f0', color: '#999' }]}
        />

        <Text style={styles.label}>Select Machine</Text>
        <View style={styles.buttonRow}>
          {machines.map((m) => (
            <Pressable
              key={m}
              onPress={() => setMachineNumber(m)}
              style={[
                styles.machineButton,
                machineNumber === m && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  machineNumber === m && { color: '#fff' },
                ]}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Select Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {daysOfWeek.map((day) => (
            <Pressable
              key={day.value}
              onPress={() => setSelectedDate(day.value)}
              style={[
                styles.slotButton,
                selectedDate === day.value && styles.selectedSlot,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedDate === day.value && { color: '#fff' },
                ]}
              >
                {day.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Select Time Slot</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {timeSlots.map((slot, idx) => (
            <Pressable
              key={idx}
              onPress={() => setSelectedSlot(slot)}
              style={[
                styles.slotButton,
                selectedSlot === slot && styles.selectedSlot,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedSlot === slot && { color: '#fff' },
                ]}
              >
                {slot}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default bookingpage

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FAF3DD',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 28,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#333',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF8C42',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  machineButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FF8C42',
  },
  slotButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 90,
  },
  selectedSlot: {
    backgroundColor: '#FF8C42',
  },
});
