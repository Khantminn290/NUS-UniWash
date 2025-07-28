import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

// Constants for Appwrite database and collection IDs
const DATABASE_ID = "6843fa14001fa0d2b7e6";
const COLLECTION_ID = "6843fa25003cb5d52a58";

export const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [booking, setBooking] = useState([]); // State to store booking data
    const { user } = useUser(); // Get currently logged-in user

    // Fetch bookings for the current user that are today or in the future
    async function fetchBooking() {
        try {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.greaterThanEqual('selectedDate', todayStr), // Only include today's and future bookings
                    Query.equal('userId', user.$id), // Filter bookings for current user
                ]
            );
            setBooking(response.documents); // Update state with fetched bookings

        } catch (error) {
            console.log(error);
        }
    }

    // Create a new booking for the current user
    async function createBooking(machineNumber, selectedDate, selectedSlot, userName) {
        try {
            const newBooking = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(), // Generate unique ID for booking
                {
                    machineNumber,
                    selectedDate,
                    selectedSlot,
                    userId: user.$id,
                    userName
                },
                [
                    Permission.read(Role.user(user.$id)),   // Only this user can read
                    Permission.update(Role.user(user.$id)), // Only this user can update
                    Permission.delete(Role.user(user.$id))  // Only this user can delete
                ]
            );
            console.log("New booking created:", newBooking);
        } catch (error) {
            console.log(error);
        }
    }

    // Delete a booking by document ID
    async function deleteBooking(id) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            );
        } catch (error) {
            console.log(eror); // Typo here: should be `error`
        }
    }

    useEffect(() => {
        let unsubscribe;
        const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`; // Real-time channel path

        if (user) {
            fetchBooking(); // Initial fetch on mount or user change

            // Subscribe to real-time events from Appwrite
            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response;

                const now = new Date();
                const todayStr = now.toISOString().split('T')[0]; // Current date
                const currentTimeStr = now.toTimeString().slice(0, 5); // Current time in HH:mm

                const { selectedDate, selectedSlot } = payload;
                const [startTime, endTime] = selectedSlot.split(' - ').map((s) => s.trim());

                // Check if the booking is relevant (today or future)
                const isOngoing = selectedDate >= todayStr;

                if (!isOngoing) return; // Ignore past bookings

                // If new booking created, add it to state
                if (events[0].includes('create')) {
                    setBooking((prevBooking) => [...prevBooking, payload]);
                }

                // If booking deleted, remove from state
                if (events[0].includes('delete')) {
                    setBooking((prevBooking) => prevBooking.filter((booking) => booking.$id !== payload.$id));
                }
            });
        } else {
            setBooking([]); // If user logs out, clear booking state
        }

        return () => {
            if (unsubscribe) unsubscribe(); // Cleanup subscription on unmount
        };
    }, [user]);

    useEffect(() => {
        const now = new Date();

        // Calculate milliseconds until midnight (00:00 next day)
        const timeUntilMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // next day
            0, 0, 0, 0 // 00:00:00
        ) - now;

        // Set a timeout to refresh bookings exactly at midnight
        const timeout = setTimeout(() => {
            fetchBooking(); // Refresh daily bookings
        }, timeUntilMidnight);

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, []);

    return (
        <BookingContext.Provider value={{ booking, fetchBooking, createBooking, deleteBooking }}>
            {children}
        </BookingContext.Provider>
    );
}
