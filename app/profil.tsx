import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfilScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // ===== FUNGSI KELUAR APLIKASI =====
  const handleKeluarAplikasi = () => {
    // Tampilkan Alert konfirmasi
    Alert.alert(
      "Keluar Aplikasi",
      "Apakah Anda yakin ingin keluar dari aplikasi?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: () => {
            // Cek platform
            if (Platform.OS === "android") {
              // Android: keluar dari aplikasi
              BackHandler.exitApp();
            } else {
              // iOS: tidak bisa keluar paksa, beri pesan alternatif
              Alert.alert(
                "Informasi",
                "Di iOS, aplikasi tidak dapat ditutup secara paksa. Silakan tutup aplikasi melalui multitasking.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ===== MENU PENGATURAN =====
  const menuItems = [
    {
      id: 1,
      icon: "person-outline",
      label: "Edit Profil",
      color: "#2D7D46",
      route: "/edit-profil",
    },
    {
      id: 2,
      icon: "lock-closed-outline",
      label: "Keamanan Akun",
      color: "#C9A84C",
      route: "/keamanan-akun",
    },
    {
      id: 3,
      icon: "notifications-outline",
      label: "Notifikasi",
      color: "#4A90D9",
      route: "/notifikasi",
    },
    {
      id: 4,
      icon: "help-circle-outline",
      label: "Bantuan",
      color: "#E67E22",
      route: "/bantuan",
    },
    {
      id: 5,
      icon: "information-circle-outline",
      label: "Tentang Aplikasi",
      color: "#2D7D46",
      route: "/tentang",
    },
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
              <Text style={styles.headerTitle}>Profil</Text>
              <Text style={styles.headerSubtitle}>
                Kelola akun dan pengaturan
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== KONTEN ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===== FOTO PROFIL ===== */}
          <Animated.View
            style={[
              styles.profileCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={56} color="#2D7D46" />
              </View>
              <TouchableOpacity
                style={styles.changePhotoButton}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
                <Text style={styles.changePhotoText}>Ubah Foto</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>Belum ada data profil</Text>
            <Text style={styles.profileSubtitle}>
              Data pengguna akan muncul setelah login
            </Text>
          </Animated.View>

          {/* ===== INFORMASI AKUN ===== */}
          <Animated.View
            style={[
              styles.infoCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.infoTitle}>Informasi Akun</Text>

            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: "#E8F5EA" }]}>
                <Ionicons name="person-outline" size={20} color="#2D7D46" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama</Text>
                <Text style={styles.infoValue}>Menunggu data</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: "#FFF8E1" }]}>
                <Ionicons name="mail-outline" size={20} color="#C9A84C" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>Menunggu data</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="call-outline" size={20} color="#4A90D9" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nomor HP</Text>
                <Text style={styles.infoValue}>Menunggu data</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: "#FDECEA" }]}>
                <Ionicons name="location-outline" size={20} color="#E74C3C" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Alamat</Text>
                <Text style={styles.infoValue}>Menunggu data</Text>
              </View>
            </View>
          </Animated.View>

          {/* ===== STATUS AKUN ===== */}
          <Animated.View
            style={[
              styles.statusCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.statusRow}>
              <View style={styles.statusIconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="#C9A84C"
                />
              </View>
              <View style={styles.statusContent}>
                <Text style={styles.statusLabel}>Status Akun</Text>
                <Text style={styles.statusValue}>Belum terhubung</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Menunggu konfigurasi</Text>
              </View>
            </View>
          </Animated.View>

          {/* ===== MENU PENGATURAN ===== */}
          <Animated.View
            style={[
              styles.menuCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.menuTitle}>Pengaturan</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* ===== TOMBOL KELUAR APLIKASI ===== */}
          <Animated.View
            style={[
              styles.logoutWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleKeluarAplikasi}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
              >
                <Ionicons name="exit-outline" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Keluar Aplikasi</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Spacer bottom */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* ===== BOTTOM NAVIGATION ===== */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/dashboard")}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={24} color="#999" />
            <Text style={[styles.navLabel, styles.navLabelInactive]}>
              Beranda
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/inventaris")}
            activeOpacity={0.7}
          >
            <Ionicons name="cube-outline" size={24} color="#999" />
            <Text style={[styles.navLabel, styles.navLabelInactive]}>
              Inventaris
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/buat-acara")}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={24} color="#999" />
            <Text style={[styles.navLabel, styles.navLabelInactive]}>
              Acara
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/notifikasi")}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#999" />
            <Text style={[styles.navLabel, styles.navLabelInactive]}>
              Notifikasi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <View style={styles.navIconWrapper}>
              <Ionicons name="person" size={24} color="#2D7D46" />
              <View style={styles.navIndicator} />
            </View>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Profil</Text>
          </TouchableOpacity>
        </View>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== PROFIL CARD =====
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
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
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    position: "absolute",
    bottom: -8,
    right: -10,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap: 4,
  },
  changePhotoText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  profileSubtitle: {
    fontSize: 13,
    color: "#888888",
    marginTop: 4,
  },

  // ===== INFORMASI AKUN =====
  infoCard: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888888",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginTop: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },

  // ===== STATUS AKUN =====
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "500",
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

  // ===== MENU =====
  menuCard: {
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
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },

  // ===== KELUAR APLIKASI =====
  logoutWrapper: {
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    gap: 10,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // ===== BOTTOM NAV =====
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIndicator: {
    position: "absolute",
    top: -4,
    width: 20,
    height: 3,
    backgroundColor: "#2D7D46",
    borderRadius: 2,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#2D7D46",
    fontWeight: "600",
  },
  navLabelInactive: {
    color: "#999",
  },
});