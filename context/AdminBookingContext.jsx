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
    const todayStr = now.toISOString().split('T')[0]; // "2025-06-12"
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.greaterThanEqual('selectedDate', todayStr),
        Query.orderAsc('selectedDate'),
        Query.orderAsc('selectedSlot'),
        Query.limit(100),
      ]
    );

    const filtered = response.documents.filter(booking => {
      const { selectedDate, selectedSlot } = booking;

      if (selectedDate > todayStr) return true;

      if (selectedDate === todayStr) {
        const [startTime] = selectedSlot.split('-').map(s => s.trim()); // "09:00"
        return startTime <= currentTimeStr;
      }

      return false; // Ignore past dates
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
    getAllBookings(); // Initial fetch

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

      const bookingDate = payload.selectedDate;
      const [startTime] = payload.selectedSlot.split('-').map((s) => s.trim());

      const isBookingValid =
        bookingDate > todayStr ||
        (bookingDate === todayStr && startTime >= currentTimeStr);

      if (!isBookingValid) {
        return; // Ignore outdated bookings
      }

      if (events[0].includes('create')) {
        setBooking((prevBooking) => [...prevBooking, payload]);
      }

      if (events[0].includes('delete')) {
        setBooking((prevBooking) =>
          prevBooking.filter((b) => b.$id !== payload.$id)
        );
      }

      if (events[0].includes('update')) {
        setBooking((prevBooking) =>
          prevBooking.map((b) => (b.$id === payload.$id ? payload : b))
        );
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