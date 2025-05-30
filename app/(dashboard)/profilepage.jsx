import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useUser } from '../../hooks/useUser'

const profilepage = () => {
    const { logout, user } = useUser()

  return (
    <View style={{ margin: 20 }}>
      <Text> { user.email } </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

export default profilepage

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: '#D8BFD8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center'
  },
  signup: {
    backgroundColor: '#00bfff'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});