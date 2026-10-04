import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function KeamananAkunScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== STATE SWITCH =====
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isLoginNotificationEnabled, setIsLoginNotificationEnabled] =
    useState(true);

  // ===== REF INPUT (BIAR GA LONCAT) =====
  const inputLamaRef = useRef<TextInput>(null);
  const inputBaruRef = useRef<TextInput>(null);
  const inputKonfirmasiRef = useRef<TextInput>(null);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ===== ANIMASI CUMA SEKALI =====
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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

  // ===== FUNGSI =====
  const handleSimpan = () => {
    if (
      !passwordLama.trim() ||
      !passwordBaru.trim() ||
      !konfirmasiPassword.trim()
    ) {
      Alert.alert("Validasi", "Harap isi semua data password");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      Alert.alert("Validasi", "Konfirmasi password tidak cocok");
      return;
    }

    if (passwordBaru.length < 8) {
      Alert.alert("Validasi", "Password minimal 8 karakter");
      return;
    }

    if (passwordLama === passwordBaru) {
      Alert.alert(
        "Validasi",
        "Password baru tidak boleh sama dengan password lama",
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Berhasil! ✅", "Keamanan akun berhasil diperbarui", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 1500);
  };

  // ===== HANDLE FOKUS (GA PAKE STATE =====
  const handleFocusLama = () => {
    // Ga pake state biar ga re-render
  };

  // ===== RENDER =====
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ===== HEADER ===== */}
        <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
          <View style={styles.patternContainer}>
            <View style={styles.pattern1} />
            <View style={styles.pattern2} />
            <View style={styles.pattern3} />
            <View style={styles.pattern4} />
          </View>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Keamanan Akun</Text>
              <Text style={styles.headerSubtitle}>
                Kelola keamanan akun Anda
              </Text>
            </View>
            <View style={styles.shieldButton}>
              <Ionicons name="shield-outline" size={22} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* ===== KONTEN ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ===== KARTU STATUS KEAMANAN ===== */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIconContainer}>
                <Ionicons name="shield-checkmark" size={28} color="#2D7D46" />
              </View>
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>Status Keamanan</Text>
                <Text style={styles.statusValue}>Tingkat keamanan akun</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Menunggu konfigurasi</Text>
              </View>
            </View>
          </View>

          {/* ===== SECTION UBAH PASSWORD ===== */}
          <View style={styles.passwordCard}>
            <Text style={styles.cardTitle}>Ubah Password</Text>

            {/* Password Lama */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password Lama</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8A8A8A"
                />
                <TextInput
                  ref={inputLamaRef}
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="#B0B0B0"
                  value={passwordLama}
                  onChangeText={setPasswordLama}
                  secureTextEntry={!showPasswordLama}
                  returnKeyType="next"
                  onSubmitEditing={() => inputBaruRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswordLama(!showPasswordLama)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPasswordLama ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Baru */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password Baru</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#8A8A8A" />
                <TextInput
                  ref={inputBaruRef}
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="#B0B0B0"
                  value={passwordBaru}
                  onChangeText={setPasswordBaru}
                  secureTextEntry={!showPasswordBaru}
                  returnKeyType="next"
                  onSubmitEditing={() => inputKonfirmasiRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPasswordBaru(!showPasswordBaru)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPasswordBaru ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Konfirmasi Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Konfirmasi Password Baru</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#8A8A8A"
                />
                <TextInput
                  ref={inputKonfirmasiRef}
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="#B0B0B0"
                  value={konfirmasiPassword}
                  onChangeText={setKonfirmasiPassword}
                  secureTextEntry={!showKonfirmasi}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => setShowKonfirmasi(!showKonfirmasi)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showKonfirmasi ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ===== PENGAMAN TAMBAHAN ===== */}
          <View style={styles.securityCard}>
            <Text style={styles.cardTitle}>Pengaman Tambahan</Text>

            <View style={styles.switchItem}>
              <View style={styles.switchLeft}>
                <View style={styles.switchIconContainer}>
                  <Ionicons name="finger-print" size={22} color="#2D7D46" />
                </View>
                <View style={styles.switchContent}>
                  <Text style={styles.switchLabel}>Autentikasi Tambahan</Text>
                  <Text style={styles.switchSubtext}>
                    Lindungi akun dengan verifikasi tambahan
                  </Text>
                </View>
              </View>
              <Switch
                value={isTwoFactorEnabled}
                onValueChange={setIsTwoFactorEnabled}
                trackColor={{ false: "#D1D1D1", true: "#2D7D46" }}
                thumbColor={isTwoFactorEnabled ? "#FFFFFF" : "#FFFFFF"}
                ios_backgroundColor="#D1D1D1"
              />
            </View>

            <View style={styles.switchDivider} />

            <View style={styles.switchItem}>
              <View style={styles.switchLeft}>
                <View
                  style={[
                    styles.switchIconContainer,
                    { backgroundColor: "#FFF8E1" },
                  ]}
                >
                  <Ionicons name="notifications" size={22} color="#C9A84C" />
                </View>
                <View style={styles.switchContent}>
                  <Text style={styles.switchLabel}>Notifikasi Login</Text>
                  <Text style={styles.switchSubtext}>
                    Dapatkan pemberitahuan saat ada login
                  </Text>
                </View>
              </View>
              <Switch
                value={isLoginNotificationEnabled}
                onValueChange={setIsLoginNotificationEnabled}
                trackColor={{ false: "#D1D1D1", true: "#2D7D46" }}
                thumbColor={isLoginNotificationEnabled ? "#FFFFFF" : "#FFFFFF"}
                ios_backgroundColor="#D1D1D1"
              />
            </View>
          </View>

          {/* ===== RIWAYAT AKTIVITAS ===== */}
          <View style={styles.historyCard}>
            <Text style={styles.cardTitle}>Riwayat Aktivitas Akun</Text>
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconContainer}>
                <Ionicons name="time-outline" size={48} color="#C9A84C" />
              </View>
              <Text style={styles.emptyStateTitle}>Belum ada aktivitas</Text>
              <Text style={styles.emptyStateSubtitle}>
                Riwayat login dan aktivitas akun akan muncul di sini
              </Text>
            </View>
          </View>

          {/* ===== TOMBOL SIMPAN ===== */}
          <View style={styles.saveWrapper}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSimpan}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ===== HEADER =====
  headerContainer: {
    backgroundColor: "#2D7D46",
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    top: -20,
    right: -20,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pattern2: {
    position: "absolute",
    bottom: -10,
    left: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern3: {
    position: "absolute",
    top: 10,
    right: 50,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "60deg" }],
  },
  pattern4: {
    position: "absolute",
    bottom: 20,
    right: 80,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "15deg" }],
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
    textAlign: "center",
    lineHeight: 16,
  },
  shieldButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== STATUS CARD =====
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8F5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  statusValue: {
    fontSize: 12,
    color: "#888888",
    marginTop: 1,
  },
  statusBadge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9A84C",
  },
  statusBadgeText: {
    fontSize: 10,
    color: "#C9A84C",
    fontWeight: "500",
  },

  // ===== PASSWORD CARD =====
  passwordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },

  // ===== INPUT =====
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FAFAFA",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    paddingLeft: 10,
    paddingVertical: 12,
  },

  // ===== SECURITY CARD =====
  securityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  switchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  switchContent: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  switchSubtext: {
    fontSize: 12,
    color: "#888888",
    marginTop: 1,
  },
  switchDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 14,
  },

  // ===== HISTORY CARD =====
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F0E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },

  // ===== SAVE BUTTON =====
  saveWrapper: {
    marginTop: 20,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    gap: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
