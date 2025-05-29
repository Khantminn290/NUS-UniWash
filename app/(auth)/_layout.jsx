// app/(auth)/_layout.jsx
import { Slot } from "expo-router";
import { UserProvider } from "../../context/UserContext"; // adjust path as needed
import { useUser } from "../../hooks/useUser";

export default function AuthLayout() {

  const { user } = useUser()
  console.log(user)
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}