import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const UpdateParticulars = () => {
  const { user, changeUserName } = useUser(); // Access user info and function to change name
  const [name, setName] = useState(user.name || ''); // Local state to hold the updated name

  // Function to handle saving the updated name
  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty'); // Show error if name is empty
      return;
    }
    try {
      await changeUserName(name.trim()); // Update name via hook
      Alert.alert('Success', 'Name updated successfully'); // Show success message
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while updating'); // Error handling
    }
  };

  return (
    // Dismiss keyboard when tapping outside input field
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('./profilepage')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF6B35" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content: Input Field and Save Button */}
        <View style={styles.content}>
          <Text style={styles.title}>Update Your Name</Text>

          {/* Input field for updating name */}
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#A86E4F"
            style={styles.input}
            onChangeText={setName}
            value={name}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UpdateParticulars;

// Styling for the screen components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E1', // Cream background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFB88C',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
