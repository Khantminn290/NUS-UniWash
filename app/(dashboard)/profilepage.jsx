import { StyleSheet, Text, View, Button, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ProfilePage = () => {
  const { logout, user } = useUser();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar with logout */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutWrapper} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Profile Circle */}
        <View style={styles.profileCircle}>
          <Ionicons name="person-circle-outline" size={100} color="#FFA552" />
        </View>

        {/* Name */}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>Email: {user.email}</Text>

        {/* Update Particulars Row */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => router.push('./updateparticulars')}
        >
          <Text style={styles.updateButtonText}>Update Particulars</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1', // Cream background
  },
  header: {
    alignItems: 'flex-end',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE5B4', // Light orange
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  },
  logoutText: {
  fontSize: 16,
  color: '#FF6B35',
  fontWeight: '500',
  },
});