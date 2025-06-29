import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useGlobalSearchParams, usestate } from 'expo-router';
import { account } from '../../lib/appwrite';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { userId, secret } = useGlobalSearchParams();
  const [verifyemail, setverifyemail] = usestate<boolean>(false);

   const verifyemailhandle = async () =>{
    try {
      const promise = account.createVerification('https://example.com/verify')
    } catch (error) {
        console.log(error.message)
    }
  }

  

  useEffect(() => {
    async function verifyEmail() {
      try {
        await account.updateVerification(String(userId), String(secret));
        alert("Email verified! You can now log in.");
        router.push('/auth/loginpage');
      } catch (error) {
        alert("Verification failed: " + error.message);
        router.push('/auth/loginpage');
      }
    }

    if (userId && secret) {
      verifyEmail();
    }
  }, [userId, secret]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Verifying your email...</Text>
    </View>
  );
}
