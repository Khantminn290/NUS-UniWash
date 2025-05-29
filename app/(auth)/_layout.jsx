// app/(auth)/_layout.jsx
import { Slot } from "expo-router";
import { UserProvider } from "../../context/UserContext"; // adjust path as needed

export default function AuthLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}