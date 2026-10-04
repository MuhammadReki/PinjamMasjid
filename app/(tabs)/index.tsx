import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ===== 🔥 IMPORT SUPABASE =====
import { supabase } from "../../utils/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== 🔥 FUNGSI LOGIN SUPABASE =====
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let pesanError = "Terjadi kesalahan. Silakan coba lagi.";
        const msg = error.message.toLowerCase();

        if (msg.includes("invalid login credentials")) {
          pesanError = "Email atau password salah!";
        } else if (msg.includes("email not confirmed")) {
          pesanError = "Email belum dikonfirmasi. Cek inbox email Anda.";
        } else if (msg.includes("invalid email")) {
          pesanError = "Format email tidak valid!";
        } else if (msg.includes("too many requests")) {
          pesanError = "Terlalu banyak percobaan. Coba lagi nanti.";
        }

        Alert.alert("Login Gagal", pesanError);
        return;
      }

      Alert.alert("Sukses", "Login berhasil!");
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PinjamMasjid</Text>
          <Text style={styles.subtitle}>Masjid An-Nur</Text>
          <Text style={styles.subtitle2}>Payakumbuh</Text>
        </View>

        {/* Form Login */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Kata Sandi */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan kata sandi"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Ingat Saya & Lupa Password */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              />
              <Text style={styles.rememberText}>Ingat saya</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/lupa-password")}>
              <Text style={styles.forgotText}>Lupa kata sandi?</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Masuk */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Memproses..." : "Masuk →"}
            </Text>
          </TouchableOpacity>

          {/* Daftar Akun */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Belum punya akun?</Text>
          </View>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/daftar-akun")}
          >
            <Text style={styles.registerLink}>Daftar Akun Baru</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 40, fontWeight: "bold", color: "#2D7D46" },
  subtitle: { fontSize: 18, color: "#C9A84C", marginTop: 4, fontWeight: "500" },
  subtitle2: { fontSize: 14, color: "#777", marginTop: 2, fontStyle: "italic" },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputContainer: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#2D7D46",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxActive: { backgroundColor: "#2D7D46" },
  rememberText: { fontSize: 14, color: "#555" },
  forgotText: { fontSize: 14, color: "#C9A84C", fontWeight: "500" },
  loginButton: {
    backgroundColor: "#2D7D46",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  buttonDisabled: { opacity: 0.6 },
  registerContainer: { alignItems: "center", marginBottom: 4 },
  registerText: { fontSize: 14, color: "#555", textAlign: "center" },
  registerButton: { alignItems: "center", paddingVertical: 8 },
  registerLink: { fontSize: 14, color: "#2D7D46", fontWeight: "bold" },
});
