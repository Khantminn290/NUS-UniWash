import { View, Text, TextInput, Pressable, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { user, login } = useUser();

  const handleSubmit = async () => {
      setError(null) // to reset the error

      try {
        await login(email, password)
      } catch (error) {
        setError(error.message)
      }
    }

  return (
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

          <View style = {{width: '100%', height: 60}}>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>

          <Pressable onPress={() => router.push('/')}>
            <Text style={styles.back}>← Back to Start</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
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
  },
  error: {
    color: '#4a0000',
    padding: 10,
    backgroundColor: '#f8b8be',
    borderColor: '#f38b93',
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  }
});