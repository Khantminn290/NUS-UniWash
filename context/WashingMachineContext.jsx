import { createContext, useEffect, useState } from "react";
import { databases, client } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

// Define Appwrite database and collection IDs
const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

// Create context for washing machine booking data
export const WashingMachineContext = createContext();

export function WashingMachineProvider({ children }) {
  const [booking, setBooking] = useState([]); // Holds the current ongoing bookings
  const { user } = useUser(); // Get logged-in user

  // Fetch bookings that are currently ongoing
  async function getCurrentBookings() {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
      const currentTimeStr = now.toTimeString().slice(0, 5); // Format: "HH:mm"

      // Query Appwrite for bookings that match today's date
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('selectedDate', todayStr),
          Query.orderAsc('selectedSlot'), // Sort by time slot
          Query.limit(100),
        ]
      );

      // Filter bookings to only include ones that are ongoing or upcoming today
      const filtered = response.documents.filter(booking => {
        const { selectedDate, selectedSlot } = booking;

        if (selectedDate > todayStr) return true; // Future dates

        if (selectedDate === todayStr) {
          const [startTime, endTime] = selectedSlot.split(' - ').map(s => s.trim());
          return currentTimeStr <= endTime && currentTimeStr >= startTime; // Ongoing
        }

        return false; // Past bookings are excluded
      });

      setBooking(filtered); // Update state with relevant bookings
    } catch (error) {
      console.error("Error fetching current bookings:", error);
    }
  }

  // Subscribe to real-time updates for the bookings collection
  useEffect(() => {
    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user) {
      getCurrentBookings(); // Initial fetch on login

      // Subscribe to create, delete, update events
      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentTimeStr = now.toTimeString().slice(0, 5);

        const { selectedDate, selectedSlot } = payload;
        const [startTime, endTime] = selectedSlot.split(' - ').map((s) => s.trim());

        const isOngoing =
          selectedDate === todayStr &&
          currentTimeStr >= startTime &&
          currentTimeStr <= endTime;

        if (!isOngoing) return; // Ignore bookings not relevant now

        // Handle real-time creation of a new booking
        if (events[0].includes('create')) {
          setBooking((prevBooking) => [...prevBooking, payload]);
        }

        // Handle deletion of a booking
        if (events[0].includes('delete')) {
          setBooking((prevBooking) =>
            prevBooking.filter((b) => b.$id !== payload.$id)
          );
        }

        // Handle updates to an existing booking
        if (events[0].includes('update')) {
          setBooking((prevBooking) =>
            prevBooking.map((b) => (b.$id === payload.$id ? payload : b))
          );
        }
      });
    } else {
      setBooking([]); // Clear bookings if user logs out
    }

    // Clean up subscription on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Auto-refresh bookings every 1 minute
  useEffect(() => {
    if (user) {
      getCurrentBookings(); // Immediate fetch
      const interval = setInterval(getCurrentBookings, 60 * 1000); // Repeat every 60 seconds
      return () => clearInterval(interval); // Clear interval on unmount
    }
  }, [user]);

  // Provide booking state and fetch function to children
  return (
    <WashingMachineContext.Provider value={{ booking, getCurrentBookings }}>
      {children}
    </WashingMachineContext.Provider>
  );
}
