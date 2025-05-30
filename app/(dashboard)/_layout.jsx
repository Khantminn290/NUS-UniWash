import { Slot } from "expo-router";
import { UserProvider } from "../../context/UserContext"; // adjust path as needed


export default function DashboardLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}