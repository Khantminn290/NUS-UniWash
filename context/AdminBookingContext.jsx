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
    const todayStr = now.toISOString().split('T')[0];
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.greaterThanEqual('selectedDate', todayStr),
        Query.orderAsc('selectedSlot'),
        Query.limit(100),
      ]
    );
    setBooking(response.documents);

  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

useEffect(() => {
  let unsubscribe;
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

  if (user) {
    getAllBookings();

    unsubscribe = client.subscribe(channel, (response) => {
      const { payload, events } = response;

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