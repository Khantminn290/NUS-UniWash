import { Slot } from "expo-router";
import { UserProvider } from "../../context/UserContext"; // adjust path as needed
import UserOnly from "../../components/auth/UserOnly";



export default function DashboardLayout() {
  return (
    <UserOnly>
      <UserProvider>
        <Slot />
      </UserProvider>
    </UserOnly>
    
  );
}