import { createContext, useEffect, useState} from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

// Define database and collection IDs from Appwrite
const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

// Create a context for admin-level booking access
export const AdminBookingContext = createContext();

export function AdminBookingProvider({ children }) {
    const [booking, setBooking] = useState([])
    const { user } = useUser()

// Function to fetch all bookings (from today onward)
async function getAllBookings() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.greaterThanEqual('selectedDate', todayStr), // Only future bookings
        Query.orderAsc('selectedSlot'), // Order by time slot
        Query.limit(1000), // Max limit of results
      ]
    );
    setBooking(response.documents); // Save to state

  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

// useEffect to subscribe to Appwrite real-time changes
useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

  if (user) {
    // Initial fetch
    getAllBookings();

    // Real-time subscription to listen for changes in bookings
    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

      const { selectedDate, selectedSlot } = payload;
      const [startTime, endTime] = selectedSlot.split(' - ').map((s) => s.trim());
      // Only consider bookings from today onward
      const isOngoing =
        selectedDate >= todayStr;

      if (!isOngoing) return; // Ignore irrelevant bookings

      if (events[0].includes('create')) {
        setBooking((prevBooking) => [...prevBooking, payload]);
      }
      if (events[0].includes('delete')) {
        // Remove deleted booking
        setBooking((prevBooking) =>
          prevBooking.filter((b) => b.$id !== payload.$id)
        );
      }
      if (events[0].includes('update')) {
        // Update modified booking
        setBooking((prevBooking) =>
          prevBooking.map((b) => (b.$id === payload.$id ? payload : b))
        );
      }
    });
  } else {
    // Reset booking data when user logs out
    setBooking([]);
  }
  // Cleanup subscription on unmount
  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user]);
// useEffect to refresh bookings automatically at midnight
useEffect(() => {
        const now = new Date();

        // Calculate time left until midnight
        const timeUntilMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // next day
            0, 0, 0, 0 // 00:00:00
        ) - now;

        const timeout = setTimeout(() => {
            getAllBookings(); // refresh bookings at midnight
        }, timeUntilMidnight);

        return () => clearTimeout(timeout);
        }, []);
    // Provide context to child components      
    return (
        <AdminBookingContext.Provider value={{ booking, getAllBookings}}>
            {children}
        </AdminBookingContext.Provider>
    )
}