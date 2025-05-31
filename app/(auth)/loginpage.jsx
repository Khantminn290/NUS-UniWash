import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { user, login, authChecked } = useUser();

  const handleSubmit = async () => {
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await login(email, password);
   }  catch (error) {
      setError(error.message);
   }
  };

  return (
  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput 
          placeholder="Email" 
          placeholderTextColor="#ccc"
          style={styles.input} 
          onChangeText={setEmail}
          value={email} 
        />

        <TextInput 
          placeholder="Password"
          placeholderTextColor="#ccc"
          onChangeText={setPassword}
          value={password}
          secureTextEntry 
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <View style={{ width: '100%', height: 60 }}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <Pressable style={styles.registerButton} onPress={() => router.push('/')}>
          <Text style={styles.registerText}>← Back To Start</Text>
        </Pressable>

        <Pressable style={styles.registerButton} onPress={() => router.push('/signuppage')}>
          <Text style={styles.registerText}>Register Instead</Text>
        </Pressable>

      </View>
    </TouchableWithoutFeedback>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // translucent black overlay
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff88',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  back: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#1e90ff',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(30,144,255,0.1)',
  },
  error: {
    color: '#fff',
    backgroundColor: 'rgba(255,0,0,0.4)',
    padding: 10,
    borderRadius: 6,
    textAlign: 'center'
  },
  backText: {
  color: '#1e90ff',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  },
  registerButton: {
  marginTop: 10,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderColor: '#00bfff',
  borderWidth: 1,
  borderRadius: 8,
  backgroundColor: 'rgba(0,191,255,0.1)',
  },
  registerText: {
  color: '#00bfff',
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  },
  logo: {
  width: 120,
  height: 120,
  marginBottom: 20,
  resizeMode: 'contain',
  tintColor: '#333333' // Optional: tint to blend with text & background
},
});