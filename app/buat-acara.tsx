import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
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

export default function BuatAcaraScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [namaAcara, setNamaAcara] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [jam, setJam] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // ===== DATE PICKER STATE =====
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");
  const [tempDate, setTempDate] = useState(new Date());

  // ===== FORMAT TANGGAL =====
  const formatDate = (date: Date) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

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

  // ===== FUNGSI DATE PICKER =====
  const showDatePickerModal = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      if (pickerMode === "start") {
        setTanggalMulai(formatted);
        // Validasi tanggal selesai
        if (tanggalSelesai) {
          const endDate = new Date(tanggalSelesai);
          if (selectedDate > endDate) {
            Alert.alert(
              "Validasi",
              "Tanggal selesai tidak boleh sebelum tanggal mulai",
            );
            setTanggalSelesai("");
          }
        }
      } else {
        // Validasi tanggal selesai tidak boleh sebelum tanggal mulai
        if (tanggalMulai) {
          const startDate = new Date(tanggalMulai);
          if (selectedDate < startDate) {
            Alert.alert(
              "Validasi",
              "Tanggal selesai tidak boleh sebelum tanggal mulai",
            );
            return;
          }
        }
        setTanggalSelesai(formatted);
      }
    }
  };

  // ===== FUNGSI LAIN =====
  const handleBuatAcara = () => {
    if (!namaAcara.trim()) {
      Alert.alert("Validasi", "Nama acara wajib diisi!");
      return;
    }
    if (!lokasi.trim()) {
      Alert.alert("Validasi", "Lokasi acara wajib diisi!");
      return;
    }
    if (!tanggalMulai) {
      Alert.alert("Validasi", "Tanggal mulai wajib diisi!");
      return;
    }
    if (!tanggalSelesai) {
      Alert.alert("Validasi", "Tanggal selesai wajib diisi!");
      return;
    }
    if (!jam) {
      Alert.alert("Validasi", "Jam acara wajib diisi!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1500);
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
              <View style={styles.headerTitleRow}>
                <FontAwesome5 name="calendar-alt" size={16} color="#C9A84C" />
                <Text style={styles.headerTitle}>Buat Acara</Text>
              </View>
              <Text style={styles.headerSubtitle}>Masukkan detail acara</Text>
            </View>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>

        {/* ===== STEP PROGRESS ===== */}
        <View style={styles.stepContainer}>
          <View style={styles.stepRow}>
            <View
              style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}
            />
            <View
              style={[
                styles.stepLine,
                currentStep >= 2 && styles.stepLineActive,
              ]}
            />
            <View
              style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}
            />
            <View
              style={[
                styles.stepLine,
                currentStep >= 3 && styles.stepLineActive,
              ]}
            />
            <View
              style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}
            />
          </View>
          <View style={styles.stepLabels}>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= 1 && styles.stepLabelActive,
              ]}
            >
              Detail Acara
            </Text>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= 2 && styles.stepLabelActive,
              ]}
            >
              Barang
            </Text>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= 3 && styles.stepLabelActive,
              ]}
            >
              Review
            </Text>
          </View>
          <Text style={styles.stepInfo}>Langkah {currentStep} dari 3</Text>
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
            {/* ===== NAMA ACARA ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nama Acara</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="calendar-alt" size={16} color="#8A8A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Khatam Al-Quran 25 Juni"
                  placeholderTextColor="#B0B0B0"
                  value={namaAcara}
                  onChangeText={setNamaAcara}
                />
              </View>
            </View>

            {/* ===== LOKASI ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Lokasi</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={18} color="#8A8A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan lokasi acara"
                  placeholderTextColor="#B0B0B0"
                  value={lokasi}
                  onChangeText={setLokasi}
                />
              </View>
              <TouchableOpacity
                style={styles.locationButton}
                activeOpacity={0.7}
              >
                <Ionicons name="locate" size={14} color="#2D7D46" />
                <Text style={styles.locationButtonText}>
                  Gunakan Lokasi Saya
                </Text>
              </TouchableOpacity>
            </View>

            {/* ===== TANGGAL ===== */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputWrapper, styles.halfWidth]}>
                <Text style={styles.label}>Tanggal Mulai</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => showDatePickerModal("start")}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 name="calendar-day" size={16} color="#8A8A8A" />
                  <Text
                    style={[
                      styles.dateButtonText,
                      !tanggalMulai && styles.datePlaceholder,
                    ]}
                  >
                    {tanggalMulai || "Pilih tanggal"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#B0B0B0" />
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrapper, styles.halfWidth]}>
                <Text style={styles.label}>Tanggal Selesai</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => showDatePickerModal("end")}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 name="calendar-day" size={16} color="#8A8A8A" />
                  <Text
                    style={[
                      styles.dateButtonText,
                      !tanggalSelesai && styles.datePlaceholder,
                    ]}
                  >
                    {tanggalSelesai || "Pilih tanggal"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#B0B0B0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ===== JAM ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Jam</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={18} color="#8A8A8A" />
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: 07:00 - 12:00"
                  placeholderTextColor="#B0B0B0"
                  value={jam}
                  onChangeText={setJam}
                />
              </View>
            </View>

            {/* ===== DESKRIPSI ===== */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Deskripsi</Text>
              <View style={styles.deskripsiToolbar}>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toolbarText}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toolbarText, styles.toolbarItalic]}>
                    I
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toolbarText}>•</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toolbarText}>1.</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.deskripsiInput}
                placeholder="Tulis detail acara..."
                placeholderTextColor="#B0B0B0"
                value={deskripsi}
                onChangeText={setDeskripsi}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* ===== TOMBOL AKSI ===== */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7}>
                <Ionicons name="cube-outline" size={16} color="#C9A84C" />
                <Text style={styles.cancelButtonText}>Ketersediaan Barang</Text>
              </TouchableOpacity>
              <Animated.View
                style={{ transform: [{ scale: scaleAnim }], flex: 1 }}
              >
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleBuatAcara}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <FontAwesome5 name="rocket" size={14} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>Buat Acara</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ===== DATE PICKER MODAL ===== */}
        {showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

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
              <Text style={styles.successTitle}>Acara berhasil dibuat!</Text>
              <Text style={styles.successSubtitle}>
                Acara telah ditambahkan ke jadwal masjid
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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

  // ===== STEP PROGRESS =====
  stepContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E8E8E8",
    borderWidth: 2,
    borderColor: "#E8E8E8",
  },
  stepDotActive: {
    backgroundColor: "#2D7D46",
    borderColor: "#2D7D46",
  },
  stepLine: {
    width: 35,
    height: 2,
    backgroundColor: "#E8E8E8",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#2D7D46",
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  stepLabel: {
    fontSize: 9,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#2D7D46",
    fontWeight: "600",
  },
  stepInfo: {
    fontSize: 10,
    color: "#8A8A8A",
    textAlign: "center",
    fontWeight: "500",
  },

  // ===== FORM =====
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 14,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },

  // ===== INPUT =====
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#1A1A1A",
    paddingLeft: 10,
  },

  // ===== ROW =====
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },

  // ===== DATE BUTTON =====
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
    height: 50,
    gap: 8,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 12,
    color: "#1A1A1A",
  },
  datePlaceholder: {
    color: "#B0B0B0",
  },

  // ===== LOCATION =====
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  locationButtonText: {
    fontSize: 12,
    color: "#2D7D46",
    fontWeight: "500",
  },

  // ===== DESKRIPSI =====
  deskripsiToolbar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  toolbarButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F5F0E8",
  },
  toolbarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  toolbarItalic: {
    fontStyle: "italic",
  },
  deskripsiInput: {
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
    height: 140,
    lineHeight: 24,
    textAlignVertical: "top",
  },

  // ===== TOMBOL =====
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    gap: 10,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#C9A84C",
    backgroundColor: "#FFFFFF",
    flex: 1,
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#C9A84C",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
    gap: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F7F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 13,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  successButton: {
    backgroundColor: "#2D7D46",
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
