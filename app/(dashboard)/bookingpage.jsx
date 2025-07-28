import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, SafeAreaView
} from 'react-native';
import dayjs from 'dayjs';
import { databases } from "../../lib/appwrite";
import { useUser } from '../../hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBooking } from '../../hooks/useBooking';
import { Query } from "react-native-appwrite";

// Appwrite Database and Collection IDs
const DATABASE_ID = "6843fa14001fa0d2b7e6";
const COLLECTION_ID = "6843fa25003cb5d52a58";

const BookingPage = () => {
  const { user } = useUser(); // Get the current logged-in user
  const [machineNumber, setMachineNumber] = useState(""); // Selected washing machine
  const [selectedSlot, setSelectedSlot] = useState(""); // Selected time slot
  const [selectedDate, setSelectedDate] = useState(""); // Selected date
  const [bookedSlots, setBookedSlots] = useState([]); // Already booked slots for selected machine + date

  const { createBooking } = useBooking(); // Custom hook to handle creating bookings

  // List of available machines and time slots
  const machines = ["M1", "M2", "M3", "M4", "M5", "M6", "M7"];
  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', 
    '21:00 - 22:00', '22:00 - 23:00', '23:00 - 24:00'
  ];

  // Generate list of the next 8 days with labels and values
  const daysOfWeek = Array.from({ length: 8 }, (_, i) => {
    const date = dayjs().add(i, 'day');
    return {
      label: date.format('ddd (MMM D)'),
      value: date.format('YYYY-MM-DD'),
    };
  });

  // Fetch all booked slots for the selected machine and date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!machineNumber || !selectedDate) {
        setBookedSlots([]);
        return;
      }
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            Query.equal('machineNumber', machineNumber),
            Query.equal('selectedDate', selectedDate),
          ]
        );
        const slots = res.documents.map(doc => doc.selectedSlot);
        setBookedSlots(slots);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [machineNumber, selectedDate]);

  // Handle the booking when user clicks "Book Now"
  const handleBooking = async () => {
    const today = dayjs().format("YYYY-MM-DD");
    const weekAhead = dayjs().add(7, 'day').format("YYYY-MM-DD");

    // Check that all required info is filled in
    if (!machineNumber || !selectedSlot || !selectedDate) {
      Alert.alert('Missing Info', 'Please select machine, date, and time slot.');
      return;
    }

    try {
      // Check if the selected slot is already booked
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('machineNumber', machineNumber),
          Query.equal('selectedDate', selectedDate),
          Query.equal('selectedSlot', selectedSlot),
        ]
      );
      if (existing.documents.length > 0) {
        throw new Error("This time slot has already been booked.");
      }

      // Prevent multiple active bookings within a 7-day period
      const existingFutureBookings = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('userName', user.name),
          Query.between('selectedDate', today, weekAhead),
        ]
      );
      if (existingFutureBookings.documents.length > 0) {
        throw new Error("You already have an active booking within the next 7 days. You can only make another booking after that one ends.");
      }

      // Create the booking
      await createBooking(machineNumber, selectedDate, selectedSlot, user.name);

      // Show success message and clear selections
      Alert.alert(
        'Booking Confirmed',
        `User: ${user?.name}\nMachine: ${machineNumber}\nDate: ${selectedDate}\nSlot: ${selectedSlot}`
      );

      setMachineNumber("");
      setSelectedSlot("");
      setSelectedDate("");

      // Redirect to schedule page
      router.push('./bookingschedule');
    } catch (error) {
      Alert.alert("Booking Failed", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        {/* Back button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('./bookingschedule')}
        >
          <Ionicons name="arrow-back" size={24} color="#FF6B35" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Make a Booking</Text>

          {/* Display current user's name */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={user?.name || ''}
            editable={false}
            style={[styles.input, { backgroundColor: '#f0f0f0', color: '#999' }]}
          />

          {/* Select a washing machine */}
          <Text style={styles.label}>Select Machine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {machines.map((machine) => (
              <Pressable
                key={machine}
                onPress={() => setMachineNumber(machine)}
                style={[
                  styles.slotButton,
                  machineNumber === machine && styles.selectedSlot,
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
          </ScrollView>

          {/* Select a day */}
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

          {/* Select a time slot */}
          <Text style={styles.label}>Select Time Slot</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setSelectedSlot(slot)}
                  style={[
                    styles.slotButton,
                    isBooked
                      ? { backgroundColor: '#E74C3C' } // Red if already booked
                      : isSelected
                        ? styles.selectedSlot // Orange if selected
                        : { backgroundColor: '#2ECC71' } // Green if available
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (isBooked || isSelected) && { color: '#fff' },
                    ]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Book Now button */}
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

