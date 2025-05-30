import UserOnly from "../../components/auth/UserOnly";
import { Tabs } from "expo-router"

export default function DashboardLayout() {
  return (
    <UserOnly>
      <Tabs
        screenOptions={{ headerShown: false }}
      />
    </UserOnly>
  );
}