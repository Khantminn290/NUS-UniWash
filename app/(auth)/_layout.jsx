import { Slot } from "expo-router";
import { useRouter } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"
import {ThemedLoader} from '../../components/ThemedLoader'

export default function AuthLayout() {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/profilepage");
    }
  }, [authChecked, user]);

  // Show a loading screen until auth is checked
  if (!authChecked) {
    return <ThemedLoader />;
  }

  // If the user is logged in, they'll be redirected above.
  // If not, render the auth screens (like login/register)
  return <Slot />;
}