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

    const bookingsNow = response.documents.filter((booking) => {
      const [slotHour, slotMinute] = booking.selectedSlot.split(':').map(Number);
      const start = new Date(`${todayStr}T${booking.selectedSlot}:00`);
      const end = new Date(start);
      end.setHours(end.getHours() + 1); // assuming 1 hour duration

      return now >= start && now < end;
    });

    setBooking(bookingsNow);
  } catch (error) {
    console.error("Error fetching current bookings:", error);
  }
}

  useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

  if (user) {
    getCurrentBookings(); // fetch current active bookings on load

    unsubscribe = client.subscribe(channel, (response) => {
      const { events } = response;

      // Re-fetch bookings on any relevant change
      if (
        events.some((e) =>
          ['databases.*.collections.*.documents.*.create',
           'databases.*.collections.*.documents.*.delete',
           'databases.*.collections.*.documents.*.update'].some(type => e.includes(type))
        )
      ) {
        getCurrentBookings();
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
        <WashingMachineContext.Provider value={{ booking, getCurrentBookings}}>
            {children}
        </WashingMachineContext.Provider>
    )
}