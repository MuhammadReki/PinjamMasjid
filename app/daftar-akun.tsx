import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ===== 🔥 IMPORT FIREBASE =====
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export default function DaftarAkunScreen() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomorHP, setNomorHP] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ===== 🔥 FUNGSI DAFTAR (FIREBASE) =====
  const handleDaftar = async () => {
    if (!nama || !email || !nomorHP || !jabatan || !password || !konfirmasiPassword) {
      Alert.alert("Peringatan", "Semua field harus diisi!");
      return;
    }

    if (password !== konfirmasiPassword) {
      Alert.alert("Peringatan", "Kata sandi tidak cocok!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Peringatan", "Kata sandi minimal 6 karakter!");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: nama,
        email: email,
        phone: nomorHP,
        role: jabatan,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Pendaftaran Berhasil! 🎉",
        "Akun Anda telah terdaftar. Silakan login untuk melanjutkan.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      let pesanError = "Terjadi kesalahan. Silakan coba lagi.";
      if (error.code === "auth/email-already-in-use") {
        pesanError = "Email sudah terdaftar! Gunakan email lain.";
      } else if (error.code === "auth/weak-password") {
        pesanError = "Password terlalu lemah! Minimal 6 karakter.";
      } else if (error.code === "auth/invalid-email") {
        pesanError = "Format email tidak valid!";
      }
      Alert.alert("Pendaftaran Gagal", pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const inputFields = [
    {
      id: "nama",
      label: "Nama Lengkap",
      icon: "person-outline",
      placeholder: "Masukkan nama lengkap",
      value: nama,
      onChange: setNama,
      keyboard: "default",
    },
    {
      id: "email",
      label: "Email",
      icon: "mail-outline",
      placeholder: "Masukkan email",
      value: email,
      onChange: setEmail,
      keyboard: "email-address",
      autoCapitalize: "none",
    },
    {
      id: "nomorHP",
      label: "Nomor HP / WhatsApp",
      icon: "call-outline",
      placeholder: "Masukkan nomor HP",
      value: nomorHP,
      onChange: setNomorHP,
      keyboard: "phone-pad",
    },
    {
      id: "jabatan",
      label: "Jabatan / Peran",
      icon: "briefcase-outline",
      placeholder: "Contoh: Ketua Panitia",
      value: jabatan,
      onChange: setJabatan,
      keyboard: "default",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.headerContainer}>
          <View style={styles.patternContainer}>
            <View style={styles.pattern1} />
            <View style={styles.pattern2} />
            <View style={styles.pattern3} />
            <View style={styles.pattern4} />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Buat Akun Baru</Text>
            <Text style={styles.headerSubtitle}>
              Bergabung dan kelola inventaris masjid dengan lebih mudah
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {inputFields.map((field) => (
              <View key={field.id} style={styles.inputWrapper}>
                <Text style={styles.label}>{field.label}</Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === field.id && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name={field.icon as any}
                    size={16}
                    color={focusedField === field.id ? "#2D7D46" : "#8A8A8A"}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor="#B0B0B0"
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType={field.keyboard as any}
                    autoCapitalize={(field.autoCapitalize as any) || "sentences"}
                    onFocus={() => setFocusedField(field.id)}
                    onBlur={() => setFocusedField(null)}
                    textAlignVertical="center"
                    includeFontPadding={false}
                    scrollEnabled={false}
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "password" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={focusedField === "password" ? "#2D7D46" : "#8A8A8A"}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#B0B0B0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  textAlignVertical="center"
                  includeFontPadding={false}
                  scrollEnabled={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "konfirmasiPassword" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={
                    focusedField === "konfirmasiPassword"
                      ? "#2D7D46"
                      : "#8A8A8A"
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ketik ulang kata sandi"
                  placeholderTextColor="#B0B0B0"
                  value={konfirmasiPassword}
                  onChangeText={setKonfirmasiPassword}
                  secureTextEntry={!showKonfirmasi}
                  onFocus={() => setFocusedField("konfirmasiPassword")}
                  onBlur={() => setFocusedField(null)}
                  textAlignVertical="center"
                  includeFontPadding={false}
                  scrollEnabled={false}
                />
                <TouchableOpacity
                  onPress={() => setShowKonfirmasi(!showKonfirmasi)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showKonfirmasi ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Ionicons name="warning-outline" size={14} color="#C9A84C" />
              <Text style={styles.infoText}>
                Akun ini hanya untuk pengurus masjid. Pastikan data yang Anda
                masukkan benar.
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleDaftar}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>
                  {isLoading ? "Memproses..." : "Daftar Sekarang"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ===== SUDAH PUNYA AKUN ===== */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Sudah punya akun?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.registerLink}> Masuk di sini</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F0E8",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F0E8",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#2D7D46",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    position: "relative",
    overflow: "hidden",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
  },
  pattern1: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pattern2: {
    position: "absolute",
    bottom: -10,
    left: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern3: {
    position: "absolute",
    top: 20,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "60deg" }],
  },
  pattern4: {
    position: "absolute",
    bottom: 30,
    right: 60,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "15deg" }],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    zIndex: 2,
  },
  headerContent: {
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    textAlign: "center",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 1,
    lineHeight: 14,
    paddingHorizontal: 10,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    paddingHorizontal: 18,
    marginTop: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 4,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    height: 44,
  },
  inputFocused: {
    borderColor: "#2D7D46",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    paddingLeft: 8,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: 44,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#C9A84C",
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 12,
    color: "#666",
  },
  registerLink: {
    fontSize: 12,
    color: "#2D7D46",
    fontWeight: "600",
  },
});