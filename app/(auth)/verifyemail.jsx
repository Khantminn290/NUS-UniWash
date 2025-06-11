import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function VerifyEmailPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.text}>
        We’ve sent a verification link to your NUS email. Please check your
        inbox and click the link to verify.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF3DD", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10, color: "#333" },
  text: { fontSize: 16, textAlign: "center", color: "#555" },
});