import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useUser } from '../../hooks/useUser'
import { router } from 'expo-router';

const profilepage = () => {
  const { logout, user, changeUserName } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style = {styles.email}>Name: {user.name}</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Logout" onPress={logout} color="#1e90ff" />
        <Button title="Update Particulars" onPress={() => router.push('./updateparticulars')} color="#1e90ff"/>
      </View>
    </View>
  );
};

export default profilepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFD8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  buttonWrapper: {
    width: '60%',
    borderRadius: 8,
    overflow: 'hidden'
  },
  loadingText: {
    fontSize: 16,
    color: '#555'
  },
});