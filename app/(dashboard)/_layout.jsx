import UserOnly from "../../components/auth/UserOnly";
import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons";

export default function DashboardLayout() {
  return (
    <UserOnly>
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 20,
          height: 65,
        } }}>
        <Tabs.Screen
          name="mainpage" // matche the file name 
          options={{
            title: "Home", // Custom title
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookingpage" 
          options={{
            title: "Bookings", // Custom title
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profilepage" 
          options={{
            title: "Profile", // Custom title
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserOnly>
  );
}