import { View, Text, StyleSheet, Pressable, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import GuestOnly from '../components/auth/GuestOnly';

export default function StartPage() {
  const router = useRouter();

  return (
    <GuestOnly>
      <View style={styles.overlay}>
        <Text style={styles.title}>NUS UniWash</Text>
        <Text style={styles.subtitle}>Smart Laundry for Students</Text>

        <Pressable style={styles.button} onPress={() => router.push('/loginpage')}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.signup]} onPress={() => router.push('/signuppage')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.profile]} onPress={() => router.push('/profilepage')}>
          <Text style={styles.buttonText}>Profile Page</Text>
        </Pressable>
      </View>
    </GuestOnly>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#FAF3DD', // Optional dim effect
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginVertical: 10,
    width: '75%',
    alignItems: 'center',
  },
  signup: {
    backgroundColor: '#00bfff',
  },
  profile: {
    backgroundColor: '#87cefa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
  width: 120,
  height: 120,
  marginBottom: 20,
  resizeMode: 'contain',
  tintColor: '#333333' // Optional: tint to blend with text & background
},
});