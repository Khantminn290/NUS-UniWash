 import { StyleSheet, Text, View } from 'react-native'
 import React from 'react' //hello

const bookingschedule = () => {
  return (
    <View style = {styles.container}>
      <Text>Booking Schedule</Text>
    </View>
  )
}

export default bookingschedule

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // center vertically
    alignItems: 'center',     // center horizontally (optional)
    padding: 24,
    backgroundColor: '#f2f2f2', // to match your theme
  },
});