import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditProfilScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomorHP, setNomorHP] = useState("");
  const [alamat, setAlamat] = useState("");
  const [namaMasjid, setNamaMasjid] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState<string | null>(null);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ===== REF INPUT =====
  const inputAlamatRef = useRef<TextInput>(null);
  const inputNamaRef = useRef<TextInput>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputNomorRef = useRef<TextInput>(null);
  const inputMasjidRef = useRef<TextInput>(null);
  const inputJabatanRef = useRef<TextInput>(null);

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

  const handleUbahFoto = () => {
    Alert.alert("Ubah Foto", "Pilih sumber foto", [
      {
        text: "Kamera",
        onPress: () =>
          Alert.alert("Kamera", "Fungsi kamera akan segera tersedia"),
      },
      {
        text: "Galeri",
        onPress: () =>
          Alert.alert("Galeri", "Fungsi galeri akan segera tersedia"),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const handleSimpan = () => {
    if (!nama.trim()) {
      Alert.alert("Validasi", "Harap isi data nama lengkap");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validasi", "Harap isi data email");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Validasi", "Format email tidak valid");
      return;
    }
    if (!nomorHP.trim()) {
      Alert.alert("Validasi", "Harap isi data nomor HP");
      return;
    }
    if (nomorHP.length < 10 || nomorHP.length > 15) {
      Alert.alert("Validasi", "Nomor HP tidak valid (min 10, max 15 digit)");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Berhasil! ✅", "Profil berhasil diperbarui", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 1500);
  };

  const handleBatal = () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin membatalkan perubahan?",
      [
        { text: "Tidak", style: "cancel" },
        { text: "Ya, Batal", onPress: () => router.back() },
      ],
    );
  };

  // ===== FIELD DATA (useMemo biar ga re-render) =====
  const fields = useMemo(
    () => [
      {
        id: "nama",
        label: "Nama Lengkap",
        icon: "person-outline",
        placeholder: "Masukkan nama lengkap",
        value: nama,
        onChange: setNama,
        keyboard: "default",
        ref: inputNamaRef,
        returnKey: "next",
        onSubmit: () => inputEmailRef.current?.focus(),
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
        ref: inputEmailRef,
        returnKey: "next",
        onSubmit: () => inputNomorRef.current?.focus(),
      },
      {
        id: "nomorHP",
        label: "Nomor HP",
        icon: "call-outline",
        placeholder: "Masukkan nomor HP",
        value: nomorHP,
        onChange: setNomorHP,
        keyboard: "numeric",
        ref: inputNomorRef,
        returnKey: "next",
        onSubmit: () => inputAlamatRef.current?.focus(),
      },
      {
        id: "namaMasjid",
        label: "Nama Masjid",
        icon: "home-outline",
        placeholder: "Masukkan nama masjid",
        value: namaMasjid,
        onChange: setNamaMasjid,
        keyboard: "default",
        ref: inputMasjidRef,
        returnKey: "next",
        onSubmit: () => inputJabatanRef.current?.focus(),
      },
      {
        id: "jabatan",
        label: "Jabatan",
        icon: "briefcase-outline",
        placeholder: "Contoh: Ketua DKM",
        value: jabatan,
        onChange: setJabatan,
        keyboard: "default",
        ref: inputJabatanRef,
        returnKey: "done",
      },
    ],
    [nama, email, nomorHP, namaMasjid, jabatan],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 20}
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
              <Text style={styles.headerTitle}>Edit Profil</Text>
              <Text style={styles.headerSubtitle}>Perbarui informasi akun</Text>
            </View>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.7}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== FORM ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* ===== FOTO PROFIL ===== */}
            <View style={styles.photoSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {foto ? (
                    <Image source={{ uri: foto }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={56} color="#2D7D46" />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handleUbahFoto}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.changePhotoText}>Ubah Foto</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ===== INFORMASI PROFIL ===== */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Informasi Profil</Text>

              {/* ===== ALAMAT ===== */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Alamat</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#8A8A8A"
                    style={{ marginTop: 2 }}
                  />
                  <TextInput
                    ref={inputAlamatRef}
                    style={[styles.input, styles.textArea]}
                    placeholder="Masukkan alamat"
                    placeholderTextColor="#B0B0B0"
                    value={alamat}
                    onChangeText={setAlamat}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="next"
                    onSubmitEditing={() => inputNamaRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              {/* ===== FIELD LAINNYA ===== */}
              {fields.map((field) => (
                <View key={field.id} style={styles.inputWrapper}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name={field.icon as any}
                      size={18}
                      color="#8A8A8A"
                    />
                    <TextInput
                      ref={field.ref}
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor="#B0B0B0"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType={field.keyboard as any}
                      autoCapitalize={
                        (field.autoCapitalize as any) || "sentences"
                      }
                      returnKeyType={field.returnKey}
                      onSubmitEditing={field.onSubmit}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* ===== TOMBOL AKSI ===== */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBatal}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <Animated.View
                style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSimpan}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>
                        Simpan Perubahan
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== FORM =====
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 14,
  },

  // ===== FOTO PROFIL =====
  photoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F9F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2D7D46",
  },
  avatarImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 10,
    gap: 4,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },

  // ===== INFO CARD =====
  infoCard: {
    marginTop: 4,
  },
  infoTitle: {
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
    paddingVertical: 0,
    backgroundColor: "#FAFAFA",
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    paddingLeft: 10,
    paddingVertical: 0,
    height: 52,
  },
  textArea: {
    minHeight: 44,
    maxHeight: 80,
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: "top",
    fontSize: 14,
  },

  // ===== TOMBOL =====
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    flex: 0.35,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#C9A84C",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#C9A84C",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    flex: 1,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
