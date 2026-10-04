import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

const { width, height } = Dimensions.get("window");

export default function LupaPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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

  // ===== KIRIM LINK RESET =====
  const handleKirimLink = async () => {
    if (!email.trim()) {
      Alert.alert("Peringatan", "Masukkan email terlebih dahulu");
      return;
    }

    // Validasi format email
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Peringatan", "Format email tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      // Kirim reset password email via Supabase
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: "pinjammasjid://reset-password",
        },
      );

      if (error) {
        let pesanError = "Gagal mengirim link reset. Coba lagi.";

        if (error.message.includes("User not found")) {
          pesanError = "Email tidak terdaftar. Silakan periksa kembali.";
        } else if (error.message.includes("rate limit")) {
          pesanError = "Terlalu banyak percobaan. Coba lagi nanti.";
        } else if (error.message) {
          pesanError = error.message;
        }

        Alert.alert("Gagal", pesanError);
        setIsLoading(false);
        return;
      }

      console.log("Reset email terkirim ke:", email);

      setIsLoading(false);
      Alert.alert(
        "Link Terkirim! ✅",
        `Link reset kata sandi telah dikirim ke ${email}.\n\nSilakan cek inbox email Anda (atau folder spam).`,
        [
          {
            text: "Buka Email",
            onPress: () => {
              // Router ke halaman utama
              router.back();
            },
          },
          {
            text: "Nanti",
            style: "cancel",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.error("Error reset password:", error);
      setIsLoading(false);
      Alert.alert("Gagal", error.message || "Terjadi kesalahan. Coba lagi.");
    }
  };

  // ===== KIRIM VIA WHATSAPP (Opsional) =====
  const handleKirimWA = () => {
    Alert.alert(
      "Info",
      "Fitur reset via WhatsApp belum tersedia. Silakan gunakan email.",
      [{ text: "OK" }],
    );
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER DENGAN GRADASI ===== */}
        <LinearGradient
          colors={["#2D7D46", "#1A5A33"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.patternContainer}>
            <View style={styles.pattern1} />
            <View style={styles.pattern2} />
            <View style={styles.pattern3} />
            <View style={styles.pattern4} />
            <View style={styles.pattern5} />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={32} color="#C9A84C" />
            </View>
            <Text style={styles.title}>Lupa Kata Sandi?</Text>
            <Text style={styles.subtitle}>
              Masukkan email yang terdaftar pada akun Anda. Kami akan kirimkan
              link reset password.
            </Text>
          </View>
        </LinearGradient>

        {/* ===== FORM ===== */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>📧 Email Terdaftar</Text>
            <View
              style={[styles.inputContainer, isFocused && styles.inputFocused]}
            >
              <Ionicons name="mail-outline" size={20} color="#8A8A8A" />
              <TextInput
                style={styles.input}
                placeholder="contoh@email.com"
                placeholderTextColor="#B0B0B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Tombol Kirim Link Reset */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={handleKirimLink}
              disabled={isLoading}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <View style={styles.loadingDot} />
                  <Text style={styles.primaryButtonText}>Mengirim...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="mail" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Kirim Link Reset</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#2D7D46"
            />
            <Text style={styles.infoText}>
              Kami akan mengirimkan link reset kata sandi ke email Anda. Cek
              inbox atau folder spam.
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Kirim via WhatsApp (opsional) */}
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={handleKirimWA}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>Hubungi Admin via WA</Text>
          </TouchableOpacity>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Tips:</Text>
            <Text style={styles.tipsText}>
              • Pastikan email yang dimasukkan benar{"\n"}• Cek folder{" "}
              <Text style={styles.tipsBold}>Spam</Text> atau{" "}
              <Text style={styles.tipsBold}>Promotions</Text>
              {"\n"}• Link reset berlaku 1 jam{"\n"}• Kalau belum terima, tunggu
              5 menit lalu coba lagi
            </Text>
          </View>
        </Animated.View>

        {/* Footer */}
        <Text style={styles.footer}>Masjid An-Nur Payakumbuh</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 0 },

  // ===== HEADER GRADASI =====
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginHorizontal: -20,
    position: "relative",
    overflow: "hidden",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
  },
  pattern1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pattern2: {
    position: "absolute",
    top: 20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern3: {
    position: "absolute",
    bottom: 10,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "60deg" }],
  },
  pattern4: {
    position: "absolute",
    top: 60,
    right: 60,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "15deg" }],
  },
  pattern5: {
    position: "absolute",
    bottom: 30,
    left: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "20deg" }],
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 6,
  },
  headerContent: { alignItems: "center" },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "center",
  },

  // ===== FORM =====
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FAFAFA",
    height: 52,
  },
  inputFocused: {
    borderColor: "#2D7D46",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },
  input: { flex: 1, fontSize: 16, color: "#1A1A1A", paddingLeft: 10 },

  // ===== TOMBOL PRIMER =====
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
    gap: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonDisabled: { opacity: 0.6 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderTopColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },

  // ===== INFO =====
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9F7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2D7D46",
  },
  infoText: { flex: 1, fontSize: 13, color: "#555", lineHeight: 20 },

  // ===== DIVIDER =====
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E8E8" },
  dividerText: {
    marginHorizontal: 16,
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "500",
  },

  // ===== WHATSAPP =====
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 10,
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  whatsappButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },

  // ===== TIPS =====
  tipsContainer: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#C9A84C",
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#C9A84C",
    marginBottom: 6,
  },
  tipsText: { fontSize: 12, color: "#666", lineHeight: 20 },
  tipsBold: { fontWeight: "bold", color: "#333" },

  // ===== FOOTER =====
  footer: {
    textAlign: "center",
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 24,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});
