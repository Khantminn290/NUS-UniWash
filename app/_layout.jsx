import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import GuestOnly from "../components/auth/GuestOnly";
import { BookingProvider } from "../context/BookingContext";

export default function RootLayout() {

  return (
      <UserProvider>
        <BookingProvider>
          <Slot />
        </BookingProvider>
      </UserProvider>
  );
}