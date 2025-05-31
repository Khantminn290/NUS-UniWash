import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartPage() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../assets/washing_machine_animated.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional dim effect
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
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
});