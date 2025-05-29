import { View, Text, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
    
    const handleSubmit = () => {
      console.log('register form submitted',name, email, password)
    }

  return (
    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput 
        placeholder="Name" 
        style={styles.input}
        onChangeText={setName}
        value = {name}
        />
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
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>

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
    backgroundColor: '#00bfff',
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
    color: '#00bfff'
  }
});