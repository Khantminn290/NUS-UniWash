import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useState} from 'react';
import { useUser } from '../../hooks/useUser';

export default function LoginPage() {
  const router = useRouter(); // Used for navigating between screens
  const [email, setEmail] = useState(''); // State for storing user email input
  const [password, setPassword] = useState(''); // State for storing password input
  const [error, setError] = useState(null); // State for error messages

  const {login} = useUser(); // Custom hook to access login function from context

  // Function to handle form submission
  const handleSubmit = async () => {
    setError(null); // Clear any existing errors

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Attempt to log in with entered credentials
      await login(email, password);
    } catch (error) {
      // Catch and display any login errors
      setError(error.message);
    }
  };

  return (
    // Dismiss keyboard when tapping outside inputs
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>

        {/* Email Input Field */}
        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#999"
          style={styles.input} 
          onChangeText={setEmail}
          value={email} 
        />

        {/* Password Input Field */}
        <TextInput 
          placeholder="Password"
          placeholderTextColor="#999"
          onChangeText={setPassword}
          value={password}
          secureTextEntry 
          style={styles.input}
        />

        {/* Login Button */}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        {/* Error Message Display */}
        <View style={{ width: '100%', height: 60 }}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Navigation Back to Start Page */}
        <Pressable style={styles.registerButton} onPress={() => router.push('/')}>
          <Text style={styles.registerText}>← Back To Start</Text>
        </Pressable>

        {/* Navigation to Registration Page */}
        <Pressable style={styles.registerButton} onPress={() => router.push('/signuppage')}>
          <Text style={styles.registerText}>Register Instead</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Styling for the Login Page
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FAF3DD',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#333',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF8C42',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: '#fff',
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#FF8C42',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  registerText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
