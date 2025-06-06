import { StyleSheet, Text, TouchableWithoutFeedback, View, TextInput, Keyboard, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '../../hooks/useUser'

const UpdateParticulars = () => {
  const { user, changeUserName } = useUser();
  const [name, setName] = useState(user.name || '');

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    try {
        await changeUserName(name.trim());
    } catch (error) {

    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Update Your Name</Text>
        
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={setName}
          value={name}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UpdateParticulars;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});