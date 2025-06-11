import { Slot, useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { ThemedLoader } from '../../components/ThemedLoader';
import * as Linking from 'expo-linking';

export default function AuthLayout() {
  const { user, authChecked } = useUser();
  const router = useRouter();

  // Redirect authenticated users to main dashboard
  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/mainpage");
    }
  }, [authChecked, user]);

  // Deep link handler for email verification
 /* useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const parsed = Linking.parse(url);
      if (parsed?.path === "verify" && parsed.queryParams?.userId && parsed.queryParams?.secret) {
        router.push({
          pathname: "/verifyemail",
          params: {
            userId: parsed.queryParams.userId,
            secret: parsed.queryParams.secret,
          }
        });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Also handle initial link if app was launched via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);*/

  if (!authChecked) {
    return <ThemedLoader />;
  }

  return <Slot />;
}