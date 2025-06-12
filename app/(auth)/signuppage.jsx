import { View, Text, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const { user, register } = useUser();

  function validatePassword(password) {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    return errors.length ? `Password must contain at least ${errors.join(', ')}.` : null;
  }

  const handleSubmit = async () => {
    setError(null);
    const nusemailRegex = /^e\d{7}@u\.nus\.edu$/;
    if (!nusemailRegex.test(email)) {
      setError('Please enter a valid NUS email address. (e.g., e1234567@u.nus.edu).');
      return;
    }
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await register(email, password, name);
      console.log('current user is: ', user);
      router.push("/verifyemail"); // new line added for authentication
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>

        <View style={{ width: '100%', height: 60 }}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <Pressable style={styles.loginButton} onPress={() => router.push('/')}>
          <Text style={styles.loginText}>← Back to Start</Text>
        </Pressable>

        <Pressable style={styles.loginButton} onPress={() => router.push('/loginpage')}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
    backgroundColor: '#FF9900',
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
  loginButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#FF8C42',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff8f1',
  },
  loginText: {
    color: '#FF8C42',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
