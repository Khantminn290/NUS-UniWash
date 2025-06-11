import { createContext, useEffect, useState} from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

export const AdminBookingContext = createContext();

export function AdminBookingProvider({ children }) {
    const [booking, setBooking] = useState([])
    const { user } = useUser()

    async function getAllBookings() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // e.g. "2025-06-11"
    const currentTimeStr = now.toTimeString().slice(0, 5); // e.g. "14:30"

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.greaterThanEqual('selectedDate', todayStr), // only today or future dates
        Query.orderAsc('selectedDate'),
        Query.orderAsc('selectedSlot'),
        Query.limit(100)
      ]
    );

    // Filter out bookings today with slot before current time
    const filtered = response.documents.filter(booking => {
      if (booking.selectedDate === todayStr) {
        return booking.selectedSlot >= currentTimeStr;
      }
      return true; // future dates are included
    });

    setBooking(filtered);

  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

    useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

  if (user) {
    getAllBookings();

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

      // Check if the booking is valid (date/time >= now)
      const bookingDate = payload.selectedDate;
      const bookingSlot = payload.selectedSlot;

      const isBookingValid = 
        bookingDate > todayStr ||
        (bookingDate === todayStr && bookingSlot >= currentTimeStr);

      if (!isBookingValid) {
        // Ignore bookings that are past the current date/time
        return;
      }

      if (events[0].includes('create')) {
        setBooking((prevBooking) => [...prevBooking, payload]);
      }

      if (events[0].includes('delete')) {
        setBooking((prevBooking) => prevBooking.filter((b) => b.$id !== payload.$id));
      }
    });
  } else {
    setBooking([]);
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user]);

    return (
        <AdminBookingContext.Provider value={{ booking, getAllBookings}}>
            {children}
        </AdminBookingContext.Provider>
    )
}