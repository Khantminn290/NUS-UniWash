import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { BookingProvider } from "../context/BookingContext";
import { AdminBookingProvider } from "../context/AdminBookingContext";
import { WashingMachineProvider } from "../context/WashingMachineContext";
import { IssueReportingProvider } from "../context/IssueReportingContext";

export default function RootLayout() {

  return (
      <UserProvider>
        <BookingProvider>
          <AdminBookingProvider>
            <WashingMachineProvider>
              <IssueReportingProvider>
              <Slot />
              </IssueReportingProvider>
            </WashingMachineProvider>
          </AdminBookingProvider>
        </BookingProvider>
      </UserProvider>
  );
}