import React, { useState } from 'react';
import {View, Text, TextInput, ScrollView, Pressable,
         StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, SafeAreaView} from 'react-native';
import dayjs from 'dayjs';
import { databases, client } from "../../lib/appwrite";
import { useUser } from '../../hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBooking } from '../../hooks/useBooking';
import { ID, Permission, Query, Role } from "react-native-appwrite";

const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

const BookingPage = () => {
  const { user } = useUser();
  const [machineNumber, setMachineNumber] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { createBooking } = useBooking();

  const machines = ["M1", "M2", "M3"];
  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00',
  ];
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day');
    return {
      label: date.format('ddd (MMM D)'),
      value: date.format('YYYY-MM-DD'),
    };
  });

  const handleBooking = async () => {
    if (!machineNumber || !selectedSlot || !selectedDate) {
      Alert.alert('Missing Info', 'Please select machine, date, and time slot.');
      return;
    }
    try {
      const existing = await databases.listDocuments(
                  DATABASE_ID,
                  COLLECTION_ID,
                  [
                      Query.equal('machineNumber', machineNumber),
                      Query.equal('selectedDate', selectedDate),
                      Query.equal('selectedSlot', selectedSlot),
                  ]
              );
              console.log("Existing bookings found:", existing.documents.length);
      
              if (existing.documents.length > 0) {
                  throw new Error("This time slot has already been booked.");
              }
    await createBooking(machineNumber, selectedDate, selectedSlot, user.name);

    // send an alert once the booking has been created
    Alert.alert(
      'Booking Confirmed',
      `User: ${user?.name}\nMachine: ${machineNumber}\nDate: ${selectedDate}\nSlot: ${selectedSlot}`
    );

    // reset fields
    setMachineNumber("");
    setSelectedSlot("");
    setSelectedDate("");

    // redirect once a booking has been made
    router.push('./bookingschedule');
  } catch (error) {
    Alert.alert("Booking Failed", error.message);
  }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.push('./bookingschedule')}
        >
          <Ionicons name="arrow-back" size={24} color="#FF6B35" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Make a Booking</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={user?.name || ''}
            editable={false}
            style={[styles.input, { backgroundColor: '#f0f0f0', color: '#999' }]}
          />

          <Text style={styles.label}>Select Machine</Text>
          <View style={styles.buttonRow}>
            {machines.map((machine) => (
              <Pressable
                key={machine}
                onPress={() => setMachineNumber(machine)}
                style={[
                  styles.machineButton,
                  machineNumber === machine && styles.selectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    machineNumber === machine && { color: '#fff' },
                  ]}
                >
                  {machine}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Select Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot}
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

          <Pressable style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.buttonText}>Book Now</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default BookingPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF3DD',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginVertical: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  machineButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FF8C42',
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  slotButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#FF8C42',
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
