import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 🔥 IMPORT LOGO (SAMA KAYAK SPLASH SCREEN)
const LOGO_URL = "https://i.ibb.co.com/gZhskXq5/Logo-Pinjam-Masjid.png";

export default function TentangScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

    // Logo animation
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
          {/* ===== KARTU LOGO ===== */}
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
              {/* 🔥 LOGO KOTAK MODERN (SAMA KAYAK SPLASH) */}
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
              <Image
                source={{
                  uri: "https://i.ibb.co.com/W4HvRjmr/Muhammad-Reki.jpg",
                }}
                style={styles.developerAvatar}
              />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(45, 125, 70, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(45, 125, 70, 0.15)",
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  logoFallback: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "rgba(45, 125, 70, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoFallbackText: {
    fontSize: 48,
  },
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
  versionText: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },

  // ===== CARD =====
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconContainer: {
    marginRight: 10,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },

  // ===== VISI MISI =====
  visiContainer: {
    marginBottom: 16,
  },
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
  misiContainer: {
    marginTop: 4,
  },
  misiLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9A84C",
    marginBottom: 6,
  },
  misiItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  misiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C9A84C",
    marginTop: 6,
    marginRight: 10,
  },
  misiText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // ===== DEVELOPER =====
  developerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
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
  developerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  developerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  developerRole: {
    fontSize: 13,
    color: "#888888",
    marginTop: 2,
  },
  developerBadge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  developerBadgeText: {
    fontSize: 10,
    color: "#C9A84C",
    fontWeight: "500",
  },
  developerMessage: {
    backgroundColor: "#F5F9F7",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2D7D46",
  },
  developerMessageText: {
    fontSize: 13,
    color: "#2D7D46",
    fontStyle: "italic",
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
