  import { View, Text, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
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

    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("one special character");
    }

    if (errors.length > 0) {
      return `Password must contain at least ${errors.join(", ")}.`;
    }

    return null;
  }

    const handleSubmit = async () => {
      setError(null);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      const validationError = validatePassword(password);
      if (validationError) {
        setError(validationError);
        return;
      }
      try {
        await register(email, password);
        console.log('current user is: ', user);
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
              placeholderTextColor="#ccc"
              style={styles.input}
              onChangeText={setName}
              value={name}
            />
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
    background: {
      flex: 1,
      justifyContent: 'center',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
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
      backgroundColor: '#00bfff',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    backButton: {
      marginTop: 4,
      paddingVertical: 10,
    },
    backText: {
      color: '#00bfff',
      fontSize: 14,
      textDecorationLine: 'underline',
    },
    loginButton: {
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderColor: '#00bfff',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: 'rgba(0,191,255,0.1)',
    },
    loginText: {
      color: '#00bfff',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    error: {
      color: '#fff',
      backgroundColor: 'rgba(255,0,0,0.4)',
      padding: 10,
      borderRadius: 6,
      textAlign: 'center',
    },
  });
