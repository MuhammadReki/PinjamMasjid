import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
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
import { auth } from "../config/firebase"; // 🔥 TAMBAHKAN INI
import { supabase } from "../utils/supabase";

export default function DaftarBarangScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [kondisi, setKondisi] = useState<string>("");
  const [foto, setFoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

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

  useEffect(() => {
    if (showSuccess) {
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      modalScaleAnim.setValue(0.8);
    }
  }, [showSuccess]);

  // ===== FUNGSI AMBIL FOTO =====
  const ambilFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Izin kamera diperlukan untuk mengambil foto barang"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const ambilUlang = () => {
    setFoto(null);
    ambilFoto();
  };

  // ===== FORMAT RUPIAH =====
  const formatRupiah = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    if (!clean) return "";
    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(clean));
    return formatted;
  };

  // ===== COUNTER =====
  const handleJumlah = (type: "tambah" | "kurang") => {
    if (type === "tambah") {
      setJumlah(jumlah + 1);
    } else {
      if (jumlah > 1) {
        setJumlah(jumlah - 1);
      }
    }
  };

  // ===== 🔥 HANDLER DAFTAR (VERSI SUPABASE + FIREBASE AUTH) =====
  const handleDaftar = async () => {
    // ===== VALIDASI =====
    if (!foto) {
      Alert.alert("Validasi", "Foto barang wajib diambil!");
      return;
    }
    if (!namaBarang.trim()) {
      Alert.alert("Validasi", "Nama barang wajib diisi!");
      return;
    }
    if (jumlah < 1) {
      Alert.alert("Validasi", "Jumlah barang minimal 1!");
      return;
    }
    if (!kondisi) {
      Alert.alert("Validasi", "Kondisi barang wajib dipilih!");
      return;
    }

    // 🔥 CEK USER DARI FIREBASE AUTH (BUKAN SUPABASE)
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Anda harus login terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      // ===== 1. UPLOAD FOTO KE SUPABASE STORAGE =====
      const fileName = `barang/${Date.now()}.jpg`;
      const response = await fetch(foto);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("barang")
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik dari foto
      const { data: urlData } = supabase.storage
        .from("barang")
        .getPublicUrl(fileName);

      const fotoUrl = urlData.publicUrl;

      // ===== 2. SIMPAN DATA KE TABEL "barang" =====
      const hargaBersih = harga.replace(/\./g, "");
      const { data: insertData, error: insertError } = await supabase
        .from("barang")
        .insert({
          nama: namaBarang,
          jumlah: jumlah,
          deskripsi: deskripsi || "-",
          harga: parseInt(hargaBersih) || 0,
          kondisi: kondisi,
          foto_url: fotoUrl,
          created_by: user.uid, // 🔥 PAKE UID DARI FIREBASE
        })
        .select();

      if (insertError) {
        console.error("Insert Error:", insertError);
        throw insertError;
      }

      console.log("Data berhasil disimpan:", insertData);

      // ===== 3. TAMPILKAN MODAL SUKSES =====
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Error detail:", error);

      let pesanError = "Terjadi kesalahan. Silakan coba lagi.";
      if (error.message) {
        pesanError = error.message;
      }

      Alert.alert("Gagal", pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== TOMBOL ANIMASI =====
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

  // ===== KONDISI OPTIONS =====
  const kondisiOptions = [
    {
      label: "Baik",
      value: "baik",
      color: "#2D7D46",
      bgColor: "#E8F5EA",
      icon: "checkmark-circle",
      desc: "Kondisi bagus, siap pakai",
    },
    {
      label: "Ada Retak",
      value: "retak",
      color: "#F39C12",
      bgColor: "#FFF8E1",
      icon: "warning",
      desc: "Ada kerusakan ringan",
    },
    {
      label: "Perlu Perbaikan",
      value: "rusak",
      color: "#E74C3C",
      bgColor: "#FDECEA",
      icon: "close-circle",
      desc: "Perlu diperbaiki sebelum dipakai",
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
              <Text style={styles.headerTitle}>Daftarkan Barang</Text>
              <Text style={styles.headerSubtitle}>
                Tambahkan barang inventaris untuk kegiatan masjid
              </Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>

        {/* ===== FORM ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
            {/* ===== UPLOAD FOTO ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Foto Barang</Text>
              <TouchableOpacity
                style={styles.uploadContainer}
                onPress={ambilFoto}
                activeOpacity={0.9}
              >
                {foto ? (
                  <View style={styles.previewContainer}>
                    <Image source={{ uri: foto }} style={styles.previewImage} />
                    <View style={styles.previewOverlay}>
                      <TouchableOpacity
                        style={styles.previewButton}
                        onPress={ambilUlang}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="camera" size={18} color="#FFFFFF" />
                        <Text style={styles.previewButtonText}>
                          Ambil Ulang
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.previewButton,
                          styles.previewButtonOutline,
                        ]}
                        onPress={() => setFoto(null)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="close" size={18} color="#FFFFFF" />
                        <Text style={styles.previewButtonText}>Ganti Foto</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <View style={styles.uploadIconContainer}>
                      <Ionicons
                        name="camera-outline"
                        size={52}
                        color="#2D7D46"
                      />
                    </View>
                    <Text style={styles.uploadTitle}>
                      Ketuk untuk mengambil foto
                    </Text>
                    <Text style={styles.uploadSubtitle}>
                      Ambil foto barang menggunakan kamera
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* ===== NAMA BARANG ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nama Barang</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="cube-outline" size={20} color="#8A8A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Piring Makan"
                  placeholderTextColor="#B0B0B0"
                  value={namaBarang}
                  onChangeText={setNamaBarang}
                />
              </View>
            </View>

            {/* ===== JUMLAH ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Jumlah</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    jumlah <= 1 && styles.counterButtonDisabled,
                  ]}
                  onPress={() => handleJumlah("kurang")}
                  disabled={jumlah <= 1}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={jumlah <= 1 ? "#CCC" : "#2D7D46"}
                  />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{jumlah}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => handleJumlah("tambah")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={24} color="#2D7D46" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ===== DESKRIPSI ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Kondisi, warna, ukuran, dan informasi tambahan"
                placeholderTextColor="#B0B0B0"
                value={deskripsi}
                onChangeText={setDeskripsi}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* ===== HARGA PERKIRAAN ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Harga Perkiraan (Rp)</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="money-bill-wave"
                  size={18}
                  color="#8A8A8A"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 100000"
                  placeholderTextColor="#B0B0B0"
                  value={harga}
                  onChangeText={(text) => setHarga(formatRupiah(text))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* ===== KONDISI ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Kondisi</Text>
              <View style={styles.kondisiContainer}>
                {kondisiOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.kondisiCard,
                      kondisi === opt.value && styles.kondisiCardActive,
                      {
                        borderColor:
                          kondisi === opt.value ? opt.color : "#E8E8E8",
                      },
                    ]}
                    onPress={() => setKondisi(opt.value)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.kondisiRow}>
                      <View
                        style={[
                          styles.kondisiIconContainer,
                          {
                            backgroundColor:
                              kondisi === opt.value ? opt.color : "#F0F0F0",
                          },
                        ]}
                      >
                        <Ionicons
                          name={opt.icon as any}
                          size={20}
                          color={kondisi === opt.value ? "#FFFFFF" : "#B0B0B0"}
                        />
                      </View>
                      <View style={styles.kondisiTextContainer}>
                        <Text
                          style={[
                            styles.kondisiLabel,
                            kondisi === opt.value && {
                              color: opt.color,
                              fontWeight: "700",
                            },
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text style={styles.kondisiDesc}>{opt.desc}</Text>
                      </View>
                      {kondisi === opt.value && (
                        <View
                          style={[
                            styles.kondisiCheck,
                            { backgroundColor: opt.color },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ===== TOMBOL AKSI ===== */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="#2D7D46" />
                <Text style={styles.cancelButtonText}>Kembali</Text>
              </TouchableOpacity>
              <Animated.View
                style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleDaftar}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="add" size={20} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>
                        Daftarkan Barang
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ===== MODAL SUKSES ===== */}
        <Modal
          visible={showSuccess}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: modalScaleAnim }],
                },
              ]}
            >
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={72} color="#2D7D46" />
              </View>
              <Text style={styles.successTitle}>
                Barang berhasil didaftarkan!
              </Text>
              <Text style={styles.successSubtitle}>
                Barang telah masuk ke inventaris masjid
              </Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => {
                  setShowSuccess(false);
                  router.push("/dashboard");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.successButtonText}>
                  Kembali ke Dashboard
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
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
    paddingTop: 12,
    paddingBottom: 40,
  },

  // ===== HEADER =====
  headerContainer: {
    backgroundColor: "#2D7D46",
    paddingHorizontal: 20,
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
  headerPlaceholder: {
    width: 40,
  },

  // ===== FORM =====
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  // ===== UPLOAD FOTO =====
  uploadContainer: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#2D7D46",
    borderStyle: "dashed",
    backgroundColor: "#F5F9F7",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadPlaceholder: {
    alignItems: "center",
    padding: 20,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(45, 125, 70, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D7D46",
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 4,
  },
  previewContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    gap: 12,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  previewButtonOutline: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  previewButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  // ===== INPUT =====
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingLeft: 10,
  },
  textArea: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: "top",
  },

  // ===== COUNTER =====
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 8,
    height: 52,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },
  counterValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginHorizontal: 28,
    minWidth: 44,
    textAlign: "center",
  },

  // ===== KONDISI =====
  kondisiContainer: {
    marginTop: 4,
  },
  kondisiCard: {
    borderWidth: 2,
    borderColor: "#E8E8E8",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  kondisiCardActive: {
    borderWidth: 2.5,
    backgroundColor: "#FFFFFF",
  },
  kondisiRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  kondisiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  kondisiTextContainer: {
    flex: 1,
  },
  kondisiLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  kondisiDesc: {
    fontSize: 12,
    color: "#8A8A8A",
    marginTop: 1,
  },
  kondisiCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2D7D46",
    backgroundColor: "#FFFFFF",
    flex: 0.3,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D7D46",
    marginLeft: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 6,
  },

  // ===== MODAL SUKSES =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 36,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
  },
  successIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F0F7F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  successButton: {
    backgroundColor: "#2D7D46",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});