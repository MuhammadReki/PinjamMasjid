import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getEvents, getItems } from "../utils/storage";

// 🔥 PAKE require UNTUK XLSX (CARA AMAN)
const XLSX = require("xlsx");

const { width, height } = Dimensions.get("window");

export default function LaporanScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [selectedPeriod, setSelectedPeriod] = useState("Bulanan");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const modalSlideAnim = useRef(new Animated.Value(height)).current;

  // ===== LOAD DATA =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const [barangData, acaraData] = await Promise.all([
          getItems(),
          getEvents(),
        ]);
        setItems(barangData || []);
        setEvents(acaraData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

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

  const openExportModal = () => {
    if (items.length === 0 && events.length === 0) {
      Alert.alert("Info", "Belum ada data laporan untuk diexport");
      return;
    }
    setShowExportModal(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeExportModal = () => {
    Animated.spring(modalSlideAnim, {
      toValue: height,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setShowExportModal(false);
    });
  };

  // ===== EXPORT PDF =====
  const exportPDF = async () => {
    closeExportModal();
    setIsLoading(true);

    try {
      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const barangList = items
        .map(
          (item, index) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.nama || "-"}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.jumlah || 0}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.kondisi || "-"}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-"}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                <span style="color: #2D7D46; font-weight: bold;">Tersedia</span>
              </td>
            </tr>
          `,
        )
        .join("");

      const html = `
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 3px solid #2D7D46; padding-bottom: 20px; margin-bottom: 30px; }
              .header h1 { color: #2D7D46; font-size: 28px; margin: 0; }
              .header h2 { color: #C9A84C; font-size: 18px; font-weight: normal; margin: 5px 0 0 0; }
              .header p { color: #888; font-size: 12px; margin-top: 10px; }
              .summary { display: flex; gap: 20px; margin-bottom: 30px; }
              .summary-item { flex: 1; background: #F5F0E8; padding: 15px; border-radius: 10px; text-align: center; }
              .summary-item .number { font-size: 24px; font-weight: bold; color: #2D7D46; }
              .summary-item .label { font-size: 12px; color: #888; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background: #2D7D46; color: white; padding: 10px; text-align: left; font-size: 12px; }
              td { padding: 8px; border: 1px solid #ddd; font-size: 12px; }
              .footer { text-align: center; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; color: #999; font-size: 11px; }
              .logo { font-size: 40px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">🕌</div>
              <h1>PinjamMasjid</h1>
              <h2>Laporan Inventaris Masjid</h2>
              <p>Tanggal Export: ${today}</p>
            </div>

            <div class="summary">
              <div class="summary-item">
                <div class="number">${items.length}</div>
                <div class="label">Total Barang</div>
              </div>
              <div class="summary-item">
                <div class="number">${events.length}</div>
                <div class="label">Total Acara</div>
              </div>
              <div class="summary-item">
                <div class="number">0</div>
                <div class="label">Total Peminjaman</div>
              </div>
              <div class="summary-item">
                <div class="number">1</div>
                <div class="label">Total Pengurus</div>
              </div>
            </div>

            <h3 style="color: #2D7D46; margin-top: 20px;">Daftar Barang</h3>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Kondisi</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${barangList || '<tr><td colspan="6" style="text-align: center; padding: 20px;">Belum ada data barang</td></tr>'}
              </tbody>
            </table>

            <div class="footer">
              <p>Dibuat dari aplikasi PinjamMasjid</p>
              <p>Masjid An-Nur Payakumbuh</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export Laporan PDF",
      });

      Alert.alert("Berhasil!", "Laporan PDF berhasil dibuat");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      Alert.alert(
        "Error",
        "Gagal membuat laporan PDF: " + (error?.message || ""),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== EXPORT EXCEL =====
  const exportExcel = async () => {
    closeExportModal();
    setIsLoading(true);

    try {
      const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Data untuk Excel
      const excelData =
        items.length > 0
          ? items.map((item, index) => ({
              No: index + 1,
              "Nama Barang": item.nama || "-",
              Jumlah: item.jumlah || 0,
              Kondisi: item.kondisi || "-",
              Tanggal: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("id-ID")
                : "-",
              Status: "Tersedia",
            }))
          : [
              {
                No: "-",
                "Nama Barang": "Belum ada data",
                Jumlah: "-",
                Kondisi: "-",
                Tanggal: "-",
                Status: "-",
              },
            ];

      // Summary data
      const summaryData = [
        { Keterangan: "Total Barang", Nilai: items.length },
        { Keterangan: "Total Acara", Nilai: events.length },
        { Keterangan: "Total Peminjaman", Nilai: 0 },
        { Keterangan: "Total Pengurus", Nilai: 1 },
        { Keterangan: "Tanggal Export", Nilai: today },
      ];

      const wb = XLSX.utils.book_new();

      // Sheet Laporan
      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Inventaris");

      // Sheet Summary
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const fileName = `Laporan_PinjamMasjid_${today.replace(/\s/g, "_")}.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Export Laporan Excel",
      });

      Alert.alert("Berhasil!", "Laporan Excel berhasil dibuat");
    } catch (error: any) {
      console.error("Error exporting Excel:", error);
      Alert.alert(
        "Error",
        "Gagal membuat laporan Excel: " + (error?.message || ""),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== DATA =====
  const periods = ["Mingguan", "Bulanan", "Tahunan"];

  const summaryCards = [
    { id: 1, icon: "cube-outline", label: "Total Barang", color: "#2D7D46" },
    { id: 2, icon: "calendar-outline", label: "Acara", color: "#C9A84C" },
    {
      id: 3,
      icon: "swap-horizontal-outline",
      label: "Peminjaman",
      color: "#4A90D9",
    },
    { id: 4, icon: "people-outline", label: "Pengurus", color: "#E67E22" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
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
              <Text style={styles.headerTitle}>Laporan</Text>
              <Text style={styles.headerSubtitle}>
                Ringkasan aktivitas inventaris masjid
              </Text>
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Ionicons name="filter" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== KONTEN ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===== FILTER PERIODE ===== */}
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodPill,
                  selectedPeriod === period && styles.periodPillActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ===== CARD RINGKASAN ===== */}
          <Animated.View
            style={[
              styles.summaryGrid,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {summaryCards.map((card) => (
              <View key={card.id} style={styles.summaryCard}>
                <View
                  style={[
                    styles.summaryIconContainer,
                    { backgroundColor: `${card.color}15` },
                  ]}
                >
                  <Ionicons
                    name={card.icon as any}
                    size={24}
                    color={card.color}
                  />
                </View>
                <Text style={styles.summaryLabel}>{card.label}</Text>
                <Text style={styles.summaryValue}>
                  {card.id === 1
                    ? items.length
                    : card.id === 2
                      ? events.length
                      : "Menunggu data"}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* ===== GRAFIK ===== */}
          <Animated.View
            style={[
              styles.chartCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.chartTitle}>Aktivitas Inventaris</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartIconContainer}>
                <Ionicons name="analytics-outline" size={48} color="#C9A84C" />
              </View>
              <Text style={styles.chartEmptyTitle}>
                Belum ada data aktivitas
              </Text>
              <Text style={styles.chartEmptySubtitle}>
                Grafik akan muncul setelah ada aktivitas inventaris
              </Text>
            </View>
          </Animated.View>

          {/* ===== LAPORAN TERBARU ===== */}
          <Animated.View
            style={[
              styles.reportCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.reportTitle}>Laporan Terbaru</Text>
            <View style={styles.reportEmpty}>
              <View style={styles.reportIconContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color="#C9A84C"
                />
              </View>
              <Text style={styles.reportEmptyTitle}>Belum ada laporan</Text>
              <Text style={styles.reportEmptySubtitle}>
                Data laporan akan muncul setelah aktivitas dimulai
              </Text>
            </View>
          </Animated.View>

          {/* ===== TOMBOL EXPORT ===== */}
          <Animated.View
            style={[
              styles.exportWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={openExportModal}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
              >
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>Export Laporan</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Spacer bottom */}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ===== LOADING OVERLAY ===== */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#2D7D46" />
              <Text style={styles.loadingText}>Sedang membuat laporan...</Text>
            </View>
          </View>
        )}

        {/* ===== MODAL EXPORT ===== */}
        <Modal
          visible={showExportModal}
          transparent
          animationType="none"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={closeExportModal}
            />
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: modalSlideAnim }],
                },
              ]}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Pilih Format Export</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={exportPDF}
                activeOpacity={0.7}
              >
                <View style={styles.modalOptionLeft}>
                  <View
                    style={[
                      styles.modalIconBox,
                      { backgroundColor: "#FDECEA" },
                    ]}
                  >
                    <Ionicons name="document-text" size={28} color="#E74C3C" />
                  </View>
                  <View>
                    <Text style={styles.modalOptionTitle}>PDF</Text>
                    <Text style={styles.modalOptionDesc}>
                      Export laporan sebagai PDF
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={exportExcel}
                activeOpacity={0.7}
              >
                <View style={styles.modalOptionLeft}>
                  <View
                    style={[
                      styles.modalIconBox,
                      { backgroundColor: "#E8F5EA" },
                    ]}
                  >
                    <Ionicons name="document-text" size={28} color="#2D7D46" />
                  </View>
                  <View>
                    <Text style={styles.modalOptionTitle}>Excel (.xlsx)</Text>
                    <Text style={styles.modalOptionDesc}>
                      Export laporan sebagai Excel
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={closeExportModal}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
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
    paddingBottom: 20,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== FILTER PERIODE =====
  periodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  periodPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
  },
  periodPillActive: {
    backgroundColor: "#2D7D46",
    borderColor: "#2D7D46",
  },
  periodText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
  },
  periodTextActive: {
    color: "#FFFFFF",
  },

  // ===== CARD RINGKASAN =====
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 2,
  },

  // ===== GRAFIK =====
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: 30,
  },
  chartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F0E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  chartEmptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  chartEmptySubtitle: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
    marginTop: 4,
  },

  // ===== LAPORAN TERBARU =====
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  reportEmpty: {
    alignItems: "center",
    paddingVertical: 30,
  },
  reportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F0E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  reportEmptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  reportEmptySubtitle: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
    marginTop: 4,
  },

  // ===== TOMBOL EXPORT =====
  exportWrapper: {
    marginTop: 4,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    gap: 10,
  },
  exportButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // ===== LOADING =====
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  // ===== MODAL EXPORT =====
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  modalOptionDesc: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#F5F0E8",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#888888",
  },
});
