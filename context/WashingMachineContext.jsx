import { createContext, useEffect, useState} from "react";
import { databases, client } from "../lib/appwrite";
import { Query } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

const DATABASE_ID = "6843fa14001fa0d2b7e6"
const COLLECTION_ID = "6843fa25003cb5d52a58"

export const WashingMachineContext = createContext();

export function WashingMachineProvider({ children }) {
    const [booking, setBooking] = useState([])
    const { user } = useUser()

  async function getCurrentBookings() {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

    // Get all bookings for today
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('selectedDate', todayStr),
        Query.orderAsc('selectedSlot'),
        Query.limit(100),
      ]
    );

    const filtered = response.documents.filter(booking => {
      const { selectedDate, selectedSlot } = booking;

      if (selectedDate > todayStr) return true;

      if (selectedDate === todayStr) {
        const [startTime, endTime] = selectedSlot.split('-').map(s => s.trim());
        return currentTimeStr <= endTime && currentTimeStr >= startTime;
      }

      return false; // Ignore past dates
    });

    setBooking(filtered);
  
  } catch (error) {
    console.error("Error fetching current bookings:", error);
  }
}

  useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

  const filterValidBookings = (bookings) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

    return bookings.filter(booking => {
      const { selectedDate, selectedSlot } = booking;
      
      // If booking is for a future date, keep it
      if (selectedDate > todayStr) return true;
      
      // If booking is for today, check time slot
      if (selectedDate === todayStr) {
        const [startTime, endTime] = selectedSlot.split('-').map(s => s.trim());
        return currentTimeStr >= startTime && currentTimeStr <= endTime;
      }
      
      // Otherwise filter out (past dates)
      return false;
    });
  };

  if (user) {
    getCurrentBookings(); // Initial fetch

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentTimeStr = now.toTimeString().slice(0, 5);

      // Check if the payload is currently valid
      const isPayloadValid = () => {
        if (payload.selectedDate > todayStr) return true;
        if (payload.selectedDate === todayStr) {
          const [startTime, endTime] = payload.selectedSlot.split('-').map(s => s.trim());
          return currentTimeStr >= startTime && currentTimeStr <= endTime;
        }
        return false;
      };

      setBooking(prevBooking => {
        let newBookings = [...prevBooking];
        
        if (events[0].includes('create') && isPayloadValid()) {
          newBookings = [...newBookings, payload];
        }

        if (events[0].includes('delete')) {
          newBookings = newBookings.filter(b => b.$id !== payload.$id);
        }

        if (events[0].includes('update')) {
          if (isPayloadValid()) {
            newBookings = newBookings.map(b => b.$id === payload.$id ? payload : b);
          } else {
            newBookings = newBookings.filter(b => b.$id !== payload.$id);
          }
        }

        // Always filter the final result to ensure no invalid bookings slip through
        return filterValidBookings(newBookings);
      });
    });
  } else {
    setBooking([]);
  }

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user]);

    return (
        <WashingMachineContext.Provider value={{ booking, getCurrentBookings}}>
            {children}
        </WashingMachineContext.Provider>
    )
}