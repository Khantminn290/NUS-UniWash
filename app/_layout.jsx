import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { BookingProvider } from "../context/BookingContext";
import { AdminBookingProvider } from "../context/AdminBookingContext";
import { WashingMachineProvider } from "../context/WashingMachineContext";

export default function RootLayout() {

  return (
      <UserProvider>
        <BookingProvider>
          <AdminBookingProvider>
            <WashingMachineProvider>
              <Slot />
            </WashingMachineProvider>
          </AdminBookingProvider>
        </BookingProvider>
      </UserProvider>
  );
}