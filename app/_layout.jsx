import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { BookingProvider } from "../context/BookingContext";
import { AdminBookingProvider } from "../context/AdminBookingContext";

export default function RootLayout() {

  return (
      <UserProvider>
        <BookingProvider>
          <AdminBookingProvider>
            <Slot />
          </AdminBookingProvider>
        </BookingProvider>
      </UserProvider>
  );
}