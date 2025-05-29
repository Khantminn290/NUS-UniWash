import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { UserProvider } from '../context/UserContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user } = useUser()

  const handleSubmit = () => {
    console.log('current user: ', user)
    console.log('login form submitted', email, password)
  }


  return (
    <UserProvider>
    <TouchableWithoutFeedback onPress ={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput 
        placeholder="Email" 
        style={styles.input} 
        onChangeText={setEmail}
        value= {email} 
        />

        <TextInput 
        placeholder="Password"
        onChangeText={setPassword}
        value = {password}
        secureTextEntry style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.back}>← Back to Start</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  back: {
    textAlign: 'center',
    color: '#1e90ff'
  }
});