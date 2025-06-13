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
        const [startTime, endTime] = selectedSlot.split(' - ').map(s => s.trim());
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

  if (user) {
    getCurrentBookings();

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:mm"

      const { selectedDate, selectedSlot } = payload;
      const [startTime, endTime] = selectedSlot.split(' - ').map((s) => s.trim());

      const isOngoing =
        selectedDate === todayStr &&
        currentTimeStr >= startTime &&
        currentTimeStr <= endTime;

      if (!isOngoing) return; // Ignore irrelevant bookings

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

//auto-refresh every minute
useEffect(() => {
  if (user) {
    getCurrentBookings(); // initial fetch
    const interval = setInterval(getCurrentBookings, 60 * 1000); // fetch every 60s
    return () => clearInterval(interval); // clean up
  }
}, [user]);

    return (
        <WashingMachineContext.Provider value={{ booking, getCurrentBookings}}>
            {children}
        </WashingMachineContext.Provider>
    )
}