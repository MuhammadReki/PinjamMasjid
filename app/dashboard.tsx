import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getEvents, getItems, getProfil } from "../utils/storage";
import { supabase } from "../utils/supabase";

// ===== DATA AYAT (HANYA ARTI/TERJEMAHAN) =====
const AYAT_API_URL = "https://api.alquran.cloud/v1/ayah/";

const defaultAyat = [
  {
    text: "Tolong-menolonglah kamu dalam kebajikan",
    surah: "Al-Ma'idah",
    ayat: 2,
  },
  {
    text: "Sesungguhnya Allah bersama orang-orang yang sabar",
    surah: "Al-Baqarah",
    ayat: 153,
  },
  {
    text: "Dirikanlah shalat dan tunaikanlah zakat",
    surah: "Al-Baqarah",
    ayat: 43,
  },
  {
    text: "Barangsiapa bertakwa kepada Allah, niscaya Dia akan membuka jalan keluar",
    surah: "Ath-Thalaq",
    ayat: 2,
  },
  {
    text: "Mintalah pertolongan dengan sabar dan shalat",
    surah: "Al-Baqarah",
    ayat: 45,
  },
  {
    text: "Sesungguhnya shalat itu mencegah perbuatan keji dan mungkar",
    surah: "Al-Ankabut",
    ayat: 45,
  },
  {
    text: "Dan berbuat baiklah kepada kedua orang tua",
    surah: "Al-Isra",
    ayat: 23,
  },
  {
    text: "Allah Maha Pengampun lagi Maha Penyayang",
    surah: "Al-Baqarah",
    ayat: 173,
  },
];

// ===== HELPER: PARSE TANGGAL =====
const parseTanggalIndonesia = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  try {
    const parts = dateStr.replace(/^[^,]+,\s*/, "").split(" ");
    const day = parseInt(parts[0]);
    const monthNames = [
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
    const month = monthNames.indexOf(parts[1]);
    const year = parseInt(parts[2]);

    if (isNaN(day) || month === -1 || isNaN(year)) return null;

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date;
  } catch (error) {
    console.error("Error parsing tanggal:", dateStr, error);
    return null;
  }
};

export default function DashboardScreen() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [items, setItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ayat, setAyat] = useState(defaultAyat[0]);
  const [ayatIndex, setAyatIndex] = useState(0);
  const [ayatLoading, setAyatLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const ayatFadeAnim = useRef(new Animated.Value(1)).current;

  // ===== AYAT SLIDER =====
  const changeAyat = useCallback((index: number) => {
    Animated.sequence([
      Animated.timing(ayatFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(ayatFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setAyatIndex(index);
    setAyat(defaultAyat[index]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (ayatIndex + 1) % defaultAyat.length;
      changeAyat(nextIndex);
    }, 6000);
    return () => clearInterval(interval);
  }, [ayatIndex, changeAyat]);

  // ===== LOAD AYAT DARI API =====
  useEffect(() => {
    const loadAyat = async () => {
      try {
        const randomAyah = Math.floor(Math.random() * 50) + 1;
        const response = await fetch(`${AYAT_API_URL}${randomAyah}/id`);
        const data = await response.json();
        if (data.code === 200 && data.data.translations) {
          setAyat({
            text: data.data.translations[0].text,
            surah: data.data.surah.name,
            ayat: data.data.numberInSurah,
          });
        }
      } catch (error) {
        console.log("Gagal load ayat dari API, pake default");
      } finally {
        setAyatLoading(false);
      }
    };
    loadAyat();
  }, []);

  // ===== LOAD DATA DARI SUPABASE =====
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [barangData, acaraData] = await Promise.all([
        getItems(),
        getEvents(),
      ]);
      console.log("Dashboard - Barang:", barangData?.length);
      console.log("Dashboard - Acara:", acaraData?.length);
      setItems(barangData || []);
      setEvents(acaraData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== LOAD USER DATA DARI SUPABASE =====
  const loadUser = useCallback(async () => {
    setIsUserLoading(true);
    try {
      // 1. Ambil user dari Auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      console.log("Dashboard - User:", authUser?.email);
      setUser(authUser);

      // 2. Ambil profil dari tabel profil
      if (authUser) {
        const profilData = await getProfil();
        console.log("Dashboard - Profil:", profilData);
        setProfil(profilData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadUser();
    }, [loadData, loadUser]),
  );

  // ===== DATA STATISTIK =====
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter acara mendatang
    const upcomingEvents = events.filter((e) => {
      const dateStr = e.tanggal_mulai || e.tanggalMulai;
      const eventDate = parseTanggalIndonesia(dateStr);
      if (!eventDate) return false;
      return eventDate >= today;
    });

    console.log(
      "Upcoming events:",
      upcomingEvents.length,
      "dari",
      events.length,
    );

    return [
      {
        id: 1,
        label: "Total Barang Tersedia",
        value: items.length.toString(),
        icon: "cube",
        color: "#2D7D46",
      },
      {
        id: 2,
        label: "Acara Mendatang",
        value: upcomingEvents.length.toString(),
        icon: "calendar",
        color: "#C9A84C",
      },
      {
        id: 3,
        label: "Pengurus Aktif",
        value: "-",
        icon: "people",
        color: "#4A90D9",
      },
      {
        id: 4,
        label: "Peminjaman Bulan Ini",
        value: "0",
        icon: "swap-vertical",
        color: "#E67E22",
      },
    ];
  }, [items, events]);

  // ===== AKTIVITAS TERBARU =====
  const activities = useMemo(() => {
    const result: any[] = [];

    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      result.push({
        id: `item-${lastItem.id}`,
        text: `${lastItem.nama || "Barang"} ditambahkan`,
        time: "Baru saja",
        icon: "cube-outline",
      });
    }

    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      result.push({
        id: `event-${lastEvent.id}`,
        text: `Acara "${lastEvent.nama || "Baru"}" dibuat`,
        time: "Baru saja",
        icon: "calendar-outline",
      });
    }

    if (result.length === 0) {
      result.push({
        id: "empty",
        text: "Belum ada aktivitas",
        time: "Semua aktivitas akan muncul di sini",
        icon: "time-outline",
        isEmpty: true,
      });
    }

    return result.slice(0, 5);
  }, [items, events]);

  // ===== RENDER ACTIVITY =====
  const renderActivity = ({ item }: { item: any }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={styles.activityContent}>
        <Text
          style={[styles.activityText, item.isEmpty && styles.activityEmpty]}
        >
          {item.text}
        </Text>
        <Text
          style={[styles.activityTime, item.isEmpty && styles.activityEmpty]}
        >
          {item.time}
        </Text>
      </View>
    </View>
  );

  // ===== MENU =====
  const quickActions = [
    {
      id: 1,
      title: "Daftarkan Barang",
      icon: "package",
      color: "#2D7D46",
      route: "/daftar-barang",
    },
    {
      id: 2,
      title: "Buat Acara",
      icon: "calendar",
      color: "#C9A84C",
      route: "/buat-acara",
    },
    {
      id: 3,
      title: "Cari Barang",
      icon: "search",
      color: "#4A90D9",
      route: "/cari-barang",
    },
    {
      id: 4,
      title: "Laporan",
      icon: "pie-chart",
      color: "#E67E22",
      route: "/laporan",
    },
  ];

  const tabs = [
    { name: "Beranda", icon: "home", route: "/dashboard" },
    { name: "Inventaris", icon: "cube", route: "/inventaris" },
    { name: "Acara", icon: "calendar", route: "/buat-acara" },
    { name: "Notifikasi", icon: "notifications", route: "/notifikasi" },
    { name: "Profil", icon: "person", route: "/profil" },
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  // ===== ANIMASI =====
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

  const notificationCount = 3;

  // ===== HELPER: NAMA USER =====
  const getDisplayName = () => {
    // Prioritas: profil.nama > user_metadata.name > email
    if (profil?.nama) return profil.nama;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Pengguna";
  };

  const getJabatan = () => {
    if (profil?.jabatan) return profil.jabatan;
    if (user?.user_metadata?.role) return user.user_metadata.role;
    return null;
  };

  // ===== RENDER HEADER USER =====
  const renderUserHeader = () => {
    if (isUserLoading) {
      return (
        <View>
          <Text style={styles.greeting}>Assalamualaikum</Text>
          <Text style={styles.userName}>Memuat data...</Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.greeting}>Assalamualaikum,</Text>
        <Text style={styles.userName}>{getDisplayName()}</Text>
        {getJabatan() && <Text style={styles.userRole}>{getJabatan()}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            <View style={styles.headerLeft}>{renderUserHeader()}</View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() => router.push("/notifikasi")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FFFFFF"
                />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ===== KARTU SELAMAT DATANG ===== */}
        <Animated.View
          style={[
            styles.welcomeCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeLabel}>Selamat datang di</Text>
              <Text style={styles.welcomeTitle}>PinjamMasjid</Text>
              <Text style={styles.welcomeSubtitle}>
                Gotong royong digital untuk kegiatan masjid kita.
              </Text>

              <Animated.View
                style={[styles.verseContainer, { opacity: ayatFadeAnim }]}
              >
                <Text style={styles.verseText}>{ayat.text}</Text>
                <Text style={styles.verseSource}>
                  (QS. {ayat.surah} : {ayat.ayat})
                </Text>
              </Animated.View>

              <View style={styles.verseIndicatorContainer}>
                {defaultAyat.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.verseDot,
                      ayatIndex === index && styles.verseDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.mosqueIllustration}>
              <View style={styles.illustrationDome} />
              <View style={styles.illustrationDomeSmall} />
              <View style={styles.illustrationTowerLeft} />
              <View style={styles.illustrationTowerRight} />
              <View style={styles.illustrationBase} />
              <View style={styles.illustrationDoor} />
              <View style={styles.crescentIcon}>
                <FontAwesome5 name="moon" size={16} color="#C9A84C" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ===== AKSI CEPAT ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionLink}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => router.push(action.route as any)}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${action.color}15` },
                ]}
              >
                <Ionicons
                  name={action.icon as any}
                  size={26}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== RINGKASAN ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ringkasan</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionLink}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <Animated.View
              key={stat.id}
              style={[
                styles.statCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: `${stat.color}15` },
                ]}
              >
                <Ionicons
                  name={stat.icon as any}
                  size={20}
                  color={stat.color}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* ===== AKTIVITAS TERBARU ===== */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sectionLink}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={renderActivity}
            scrollEnabled={false}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ===== BOTTOM NAVIGATION ===== */}
      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.route ||
            (tab.route === "/dashboard" && pathname === "/");
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.navItem}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.navIconWrapper}>
                <Ionicons
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? "#2D7D46" : "#999"}
                />
                {isActive && (
                  <View
                    style={[
                      styles.navIndicator,
                      { backgroundColor: "#2D7D46" },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? "#2D7D46" : "#999" },
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F0E8" },
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  scrollContent: { paddingBottom: 20 },

  // ===== HEADER =====
  headerContainer: {
    backgroundColor: "#2D7D46",
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    top: -10,
    right: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern3: {
    position: "absolute",
    bottom: 5,
    left: -10,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "15deg" }],
  },
  pattern4: {
    position: "absolute",
    bottom: 10,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "60deg" }],
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  headerLeft: { flex: 1, paddingRight: 8 },
  greeting: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "400",
    fontStyle: "italic",
    lineHeight: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 0,
    lineHeight: 20,
  },
  userRole: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginTop: 0,
    fontWeight: "400",
  },
  headerRight: { paddingTop: 0 },
  notificationButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#C9A84C",
    width: 15,
    height: 15,
    borderRadius: 7.5,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: { fontSize: 8, color: "#FFFFFF", fontWeight: "bold" },

  // ===== KARTU SELAMAT DATANG =====
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -8,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeTextContainer: { flex: 1, paddingRight: 10 },
  welcomeLabel: { fontSize: 10, color: "#999", fontWeight: "400" },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D7D46",
    marginTop: 1,
  },
  welcomeSubtitle: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    lineHeight: 15,
  },
  verseContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F0EDE8",
    minHeight: 35,
  },
  verseText: {
    fontSize: 11,
    color: "#2D7D46",
    fontStyle: "italic",
    fontWeight: "500",
    lineHeight: 15,
  },
  verseSource: {
    fontSize: 10,
    color: "#C9A84C",
    fontWeight: "400",
    marginTop: 1,
  },
  verseIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    gap: 4,
  },
  verseDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#DDD" },
  verseDotActive: { backgroundColor: "#2D7D46", width: 12 },

  // ===== ILUSTRASI MASJID =====
  mosqueIllustration: {
    width: 60,
    height: 70,
    position: "relative",
    alignItems: "center",
  },
  illustrationDome: {
    width: 30,
    height: 18,
    backgroundColor: "#2D7D46",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    top: 4,
    left: 15,
  },
  illustrationDomeSmall: {
    width: 16,
    height: 10,
    backgroundColor: "#2D7D46",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: "absolute",
    top: 6,
    left: 6,
  },
  illustrationTowerLeft: {
    width: 3,
    height: 18,
    backgroundColor: "#2D7D46",
    position: "absolute",
    top: 8,
    left: 3,
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  illustrationTowerRight: {
    width: 3,
    height: 18,
    backgroundColor: "#2D7D46",
    position: "absolute",
    top: 8,
    right: 3,
    borderTopLeftRadius: 1.5,
    borderTopRightRadius: 1.5,
  },
  illustrationBase: {
    width: 46,
    height: 14,
    backgroundColor: "#2D7D46",
    position: "absolute",
    bottom: 0,
    left: 7,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  illustrationDoor: {
    width: 8,
    height: 10,
    backgroundColor: "#F5F0E8",
    position: "absolute",
    bottom: 0,
    left: 26,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  crescentIcon: { position: "absolute", top: -2, right: 0 },

  // ===== SECTION HEADER =====
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  sectionLink: { fontSize: 12, color: "#2D7D46", fontWeight: "500" },

  // ===== AKSI CEPAT =====
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  quickActionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },

  // ===== RINGKASAN =====
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
  },
  statIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1A1A1A" },
  statLabel: { fontSize: 10, color: "#999", marginTop: 1, textAlign: "center" },

  // ===== AKTIVITAS =====
  activityContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2D7D46",
    marginTop: 4,
    marginRight: 10,
  },
  activityContent: { flex: 1 },
  activityText: { fontSize: 12, color: "#333", lineHeight: 16 },
  activityEmpty: { color: "#999", fontStyle: "italic" },
  activityTime: { fontSize: 10, color: "#B0B0B0", marginTop: 2 },

  // ===== BOTTOM NAV =====
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 6,
    paddingBottom: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 6,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  navIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIndicator: {
    position: "absolute",
    top: -4,
    width: 16,
    height: 2.5,
    backgroundColor: "#2D7D46",
    borderRadius: 2,
  },
  navLabel: {
    fontSize: 8,
    color: "#999",
    marginTop: 1,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  navLabelActive: { color: "#2D7D46", fontWeight: "600" },
});
