import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function VerificationSuccessPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verified ✅</Text>
      <Text style={styles.text}>Your NUS email is now verified.</Text>
      <Pressable style={styles.button} onPress={() => router.replace("/loginpage")}>
        <Text style={styles.buttonText}>Go to Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF3DD", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12, color: "#333" },
  text: { fontSize: 16, marginBottom: 20, textAlign: "center", color: "#555" },
  button: { backgroundColor: "#FF9900", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});