import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import GuestOnly from "../components/auth/GuestOnly";

export default function RootLayout() {

  return (
      <UserProvider>
          <Slot />
      </UserProvider>
  );
}