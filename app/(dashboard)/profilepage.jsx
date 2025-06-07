import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useUser } from '../../hooks/useUser';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ProfilePage = () => {
  const { logout, user } = useUser();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logout Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutWrapper} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B35" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#FFA552" />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./updateparticulars')}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>Update Particulars</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('./userbookingsummary')}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFF" style={styles.icon} />
          <Text style={styles.buttonText}>View My Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E1',
  },
  header: {
    alignItems: 'flex-end',
    padding: 16,
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
  profileContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});