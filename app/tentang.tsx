import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOGO_URL = "https://i.ibb.co.com/gZhskXq5/Logo-Pinjam-Masjid.png";
const DEV_PHOTO = "https://i.ibb.co.com/W4HvRjmr/Muhammad-Reki.jpg";

export default function TentangScreen() {
  const insets = useSafeAreaInsets();

  const [imageError, setImageError] = useState(false);
  const [devImageError, setDevImageError] = useState(false);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;

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

    Animated.sequence([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  // ===== BUKA LINK =====
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

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
              <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
              <Text style={styles.headerSubtitle}>Mengenal PinjamMasjid</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* ===== KONTEN ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===== LOGO CARD ===== */}
          <Animated.View
            style={[
              styles.logoCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: logoFadeAnim,
                  transform: [{ scale: logoScaleAnim }],
                },
              ]}
            >
              <View style={styles.logoBox}>
                <Image
                  source={{ uri: LOGO_URL }}
                  style={styles.logoImage}
                  resizeMode="contain"
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <View style={styles.logoFallback}>
                    <Text style={styles.logoFallbackText}>🕌</Text>
                  </View>
                )}
              </View>
              <Text style={styles.appName}>PinjamMasjid</Text>
              <Text style={styles.appTagline}>
                Gotong royong digital untuk masjid kita
              </Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>Versi 1.0.0</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* ===== DESKRIPSI ===== */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Text style={styles.cardIcon}>🕌</Text>
              </View>
              <Text style={styles.cardTitle}>Tentang PinjamMasjid</Text>
            </View>
            <Text style={styles.cardDescription}>
              PinjamMasjid merupakan platform digital yang dirancang untuk
              membantu pengelolaan inventaris, peminjaman barang, dan kegiatan
              masjid secara lebih mudah, terorganisir, dan efisien. Aplikasi ini
              dibuat untuk mendukung semangat gotong royong dan mempermudah
              koordinasi antar pengurus serta masyarakat.
            </Text>
          </Animated.View>

          {/* ===== FITUR UTAMA ===== */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>✨ Fitur Utama</Text>

            <View style={styles.featureList}>
              {[
                { icon: "cube-outline", text: "Manajemen Inventaris Barang" },
                {
                  icon: "calendar-outline",
                  text: "Buat & Kelola Acara Masjid",
                },
                { icon: "location-outline", text: "Deteksi Lokasi Otomatis" },
                {
                  icon: "document-text-outline",
                  text: "Export Laporan PDF & Excel",
                },
                { icon: "people-outline", text: "Multi-User dengan Role" },
                { icon: "cloud-outline", text: "Data Tersimpan di Cloud" },
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons
                      name={feature.icon as any}
                      size={18}
                      color="#2D7D46"
                    />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ===== VISI MISI ===== */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Visi & Misi</Text>

            <View style={styles.visiContainer}>
              <Text style={styles.visiLabel}>Visi</Text>
              <Text style={styles.visiText}>
                "Membangun sistem pengelolaan masjid yang modern, mudah, dan
                bermanfaat."
              </Text>
            </View>

            <View style={styles.misiContainer}>
              <Text style={styles.misiLabel}>Misi</Text>
              {[
                "Mempermudah pengelolaan inventaris",
                "Meningkatkan efisiensi kegiatan",
                "Mendukung budaya gotong royong",
                "Membantu digitalisasi masjid",
              ].map((item, index) => (
                <View key={index} style={styles.misiItem}>
                  <View style={styles.misiDot} />
                  <Text style={styles.misiText}>{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ===== TEKNOLOGI ===== */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>🛠️ Dibangun Dengan</Text>

            <View style={styles.techGrid}>
              {[
                { label: "React Native", color: "#61DAFB" },
                { label: "Expo", color: "#000020" },
                { label: "TypeScript", color: "#3178C6" },
                { label: "Supabase", color: "#3ECF8E" },
                { label: "Expo Router", color: "#4630EB" },
                { label: "Expo Location", color: "#0EA5E9" },
              ].map((tech, index) => (
                <View key={index} style={styles.techBadge}>
                  <View
                    style={[styles.techDot, { backgroundColor: tech.color }]}
                  />
                  <Text style={styles.techText}>{tech.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ===== PEMBUAT ===== */}
          <Animated.View
            style={[
              styles.developerCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.developerHeader}>
              <Ionicons name="code-slash-outline" size={22} color="#C9A84C" />
              <Text style={styles.developerTitle}>Pengembang</Text>
            </View>

            <View style={styles.developerContent}>
              {devImageError ? (
                <View style={styles.developerAvatar}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
              ) : (
                <Image
                  source={{ uri: DEV_PHOTO }}
                  style={styles.developerAvatar}
                  onError={() => setDevImageError(true)}
                />
              )}
              <View style={styles.developerInfo}>
                <Text style={styles.developerName}>Muhammad Reki</Text>
                <Text style={styles.developerRole}>Mobile App Developer</Text>
                <View style={styles.developerBadge}>
                  <Text style={styles.developerBadgeText}>
                    🚀 Aplikasi Mobile Pertama
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.developerMessage}>
              <Text style={styles.developerMessageText}>
                "Terima kasih telah menggunakan PinjamMasjid"
              </Text>
            </View>

            {/* Kontak Developer */}
            <View style={styles.contactRow}>
              <TouchableOpacity
                style={styles.contactIconButton}
                onPress={() => openLink("mailto:mreki2022@gmail.com")}
                activeOpacity={0.7}
              >
                <Ionicons name="mail-outline" size={20} color="#2D7D46" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactIconButton}
                onPress={() => openLink("https://github.com/MuhammadReki")}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-github" size={20} color="#2D7D46" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactIconButton}
                onPress={() => openLink("https://instagram.com/muhammad.reki_")}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-instagram" size={20} color="#2D7D46" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ===== TERIMA KASIH ===== */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>🤝 Terima Kasih</Text>
            <Text style={styles.cardDescription}>
              Aplikasi ini tidak akan terwujud tanpa dukungan dari:
              {"\n\n"}
              🕌 <Text style={styles.boldText}>Masjid An-Nur Payakumbuh</Text>
              {"\n"}
              👥 <Text style={styles.boldText}>Pengurus DKM</Text>
              {"\n"}
              👨‍👩‍👦 <Text style={styles.boldText}>Keluarga & Sahabat</Text>
              {"\n"}
              💻 <Text style={styles.boldText}>Komunitas Developer</Text>
            </Text>
          </Animated.View>

          {/* ===== FOOTER ===== */}
          <Text style={styles.footerLove}>
            Dibuat dengan ❤️ untuk masjid dan kebersamaan
          </Text>
          <Text style={styles.footerCopyright}>© PinjamMasjid 2026</Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F0E8" },
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

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
  headerTextContainer: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== LOGO CARD =====
  logoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    elevation: 4,
  },
  logoContainer: { alignItems: "center" },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(45, 125, 70, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(45, 125, 70, 0.15)",
    overflow: "hidden",
  },
  logoImage: { width: 90, height: 90 },
  logoFallback: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(45, 125, 70, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoFallbackText: { fontSize: 48 },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 12,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
    textAlign: "center",
  },
  versionBadge: {
    backgroundColor: "#F5F0E8",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  versionText: { fontSize: 12, color: "#888888", fontWeight: "500" },

  // ===== CARD =====
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardIconContainer: { marginRight: 10 },
  cardIcon: { fontSize: 20 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },
  boldText: { fontWeight: "bold", color: "#1A1A1A" },

  // ===== FITUR =====
  featureList: { marginTop: 8 },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E8F5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: { flex: 1, fontSize: 14, color: "#333", fontWeight: "500" },

  // ===== VISI MISI =====
  visiContainer: { marginBottom: 16 },
  visiLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D7D46",
    marginBottom: 4,
  },
  visiText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "justify",
  },
  misiContainer: { marginTop: 4 },
  misiLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9A84C",
    marginBottom: 6,
  },
  misiItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  misiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C9A84C",
    marginTop: 6,
    marginRight: 10,
  },
  misiText: { flex: 1, fontSize: 13, color: "#666", lineHeight: 18 },

  // ===== TECH =====
  techGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  techBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  techDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  techText: { fontSize: 12, color: "#333", fontWeight: "500" },

  // ===== DEVELOPER =====
  developerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  developerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  developerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  developerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  developerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D7D46",
    justifyContent: "center",
    alignItems: "center",
  },
  developerInfo: { flex: 1, marginLeft: 14 },
  developerName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  developerRole: { fontSize: 13, color: "#888888", marginTop: 2 },
  developerBadge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  developerBadgeText: { fontSize: 10, color: "#C9A84C", fontWeight: "500" },
  developerMessage: {
    backgroundColor: "#F5F9F7",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2D7D46",
    marginBottom: 14,
  },
  developerMessageText: { fontSize: 13, color: "#2D7D46", fontStyle: "italic" },

  // ===== CONTACT ROW =====
  contactRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
  contactIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F9F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  // ===== FOOTER =====
  footerLove: {
    textAlign: "center",
    fontSize: 13,
    color: "#888888",
    marginTop: 20,
  },
  footerCopyright: {
    textAlign: "center",
    fontSize: 12,
    color: "#B0B0B0",
    marginTop: 4,
  },
});
