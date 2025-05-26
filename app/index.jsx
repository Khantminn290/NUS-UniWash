import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Logo from '../assets/favicon.png'
import {Link} from 'expo-router'

const Home  = () => {
  return (
    <View style={styles.container}>
      <Image source = {Logo} style={{marginBottom: 30}}/>
      <Image source={require('../assets/crumpled-green-paper-texture.jpg')} style= {{width: 300, height: 200, marginBottom: 30}} resizeMode='cover'/>
      <Text style={styles.title}>Home</Text>
      <Text style= {{marginTop: 30, marginBottom: 30}}>Login page</Text>
      <Link href= "/about">About Page</Link>
    </View>
  )
}

export default Home 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff' ,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
});