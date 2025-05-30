// app/(auth)/_layout.jsx
import { Slot } from "expo-router";
import { UserProvider } from "../../context/UserContext"; // adjust path as needed
import GuestOnly from "../../components/auth/GuestOnly";


export default function AuthLayout() {
  return (
    <GuestOnly>
      <UserProvider>
        <Slot />
      </UserProvider>
    </GuestOnly>
  );
}