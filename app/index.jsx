import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function startpage() {
  const router = useRouter();

  return (
      <View style={styles.overlay}>
        <Text style={styles.title}>NUS UniWash</Text>
        <Text style={styles.subtitle}>Smart Laundry for Students</Text>

        <Pressable style={styles.button} onPress={() => router.push('/loginpage')}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.signup]} onPress={() => router.push('/signuppage')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: '#D8BFD8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center'
  },
  signup: {
    backgroundColor: '#00bfff'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});