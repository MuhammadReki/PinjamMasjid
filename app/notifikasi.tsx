import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getEvents, getItems } from "../utils/storage";

// ===== TIPE NOTIFIKASI =====
type Notification = {
  id: string;
  title: string;
  message: string;
  type: "aktivitas" | "peminjaman" | "acara" | "sistem";
  createdAt: string;
  isRead: boolean;
  data?: any;
};

export default function NotifikasiScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  // ===== LOAD NOTIFIKASI DARI STORAGE =====
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const [items, events] = await Promise.all([getItems(), getEvents()]);
      const newNotifs: Notification[] = [];

      // Notifikasi dari barang baru
      if (items.length > 0) {
        const lastItem = items[items.length - 1];
        newNotifs.push({
          id: `item-${lastItem.id}`,
          title: "Barang Baru Ditambahkan",
          message: `${lastItem.nama || "Barang"} berhasil didaftarkan ke inventaris`,
          type: "aktivitas",
          createdAt: lastItem.createdAt || new Date().toISOString(),
          isRead: false,
          data: lastItem,
        });
      }

      // Notifikasi dari acara baru
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        newNotifs.push({
          id: `event-${lastEvent.id}`,
          title: "Acara Baru Dibuat",
          message: `Acara "${lastEvent.nama || "Baru"}" telah dibuat`,
          type: "acara",
          createdAt: lastEvent.createdAt || new Date().toISOString(),
          isRead: false,
          data: lastEvent,
        });
      }

      setNotifications(newNotifs);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== REFRESH SAAT FOKUS =====
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  // ===== TAB FILTER =====
  const tabs = [
    { id: "Semua", label: "Semua" },
    { id: "Aktivitas", label: "Aktivitas" },
    { id: "Peminjaman", label: "Peminjaman" },
    { id: "Acara", label: "Acara" },
    { id: "Sistem", label: "Sistem" },
  ];

  // ===== FILTER NOTIFIKASI =====
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Aktivitas") return notif.type === "aktivitas";
    if (activeTab === "Peminjaman") return notif.type === "peminjaman";
    if (activeTab === "Acara") return notif.type === "acara";
    if (activeTab === "Sistem") return notif.type === "sistem";
    return true;
  });

  // ===== FUNGSI =====
  const handleMarkAllRead = () => {
    if (notifications.length === 0) {
      Alert.alert("Info", "Belum ada notifikasi untuk ditandai");
      return;
    }
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    Alert.alert("Berhasil!", "Semua notifikasi telah ditandai dibaca");
  };

  const handleOpenNotification = (notif: Notification) => {
    // Tandai sebagai dibaca
    const updated = notifications.map((n) =>
      n.id === notif.id ? { ...n, isRead: true } : n,
    );
    setNotifications(updated);

    // Navigasi berdasarkan tipe
    if (notif.type === "acara") {
      router.push("/buat-acara");
    } else if (notif.type === "aktivitas") {
      router.push("/inventaris");
    } else {
      Alert.alert("Detail", notif.message);
    }
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      "Hapus Notifikasi",
      "Apakah Anda yakin ingin menghapus notifikasi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setNotifications(notifications.filter((n) => n.id !== id));
          },
        },
      ],
    );
  };

  // ===== RENDER EMPTY STATE =====
  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={64} color="#C9A84C" />
      </View>
      <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
      <Text style={styles.emptySubtitle}>
        Notifikasi aktivitas inventaris, acara, dan peminjaman akan muncul di
        sini
      </Text>
    </Animated.View>
  );

  // ===== RENDER ITEM NOTIFIKASI =====
  const renderNotification = ({ item }: { item: Notification }) => {
    const getIcon = () => {
      switch (item.type) {
        case "acara":
          return "calendar-outline";
        case "aktivitas":
          return "cube-outline";
        case "peminjaman":
          return "swap-horizontal-outline";
        default:
          return "notifications-outline";
      }
    };

    const getColor = () => {
      switch (item.type) {
        case "acara":
          return "#C9A84C";
        case "aktivitas":
          return "#2D7D46";
        case "peminjaman":
          return "#4A90D9";
        default:
          return "#888888";
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.notificationItemUnread,
        ]}
        onPress={() => handleOpenNotification(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationLeft}>
          <View
            style={[
              styles.notificationIcon,
              { backgroundColor: `${getColor()}15` },
            ]}
          >
            <Ionicons name={getIcon()} size={22} color={getColor()} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.notificationTime}>
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationDelete}
          onPress={() => handleDeleteNotification(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle" size={20} color="#B0B0B0" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
              <Text style={styles.headerTitle}>Notifikasi</Text>
              <Text style={styles.headerSubtitle}>
                Informasi aktivitas dan pembaruan
              </Text>
            </View>
            <View style={styles.bellButton}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* ===== FILTER TAB ===== */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===== DAFTAR NOTIFIKASI ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Memuat notifikasi...</Text>
            </View>
          ) : filteredNotifications.length === 0 ? (
            renderEmptyState()
          ) : (
            filteredNotifications.map((item) => (
              <View key={item.id}>{renderNotification({ item })}</View>
            ))
          )}
        </ScrollView>

        {/* ===== TOMBOL TANDAI SEMUA ===== */}
        <View style={styles.bottomWrapper}>
          <TouchableOpacity
            style={[
              styles.markAllButton,
              notifications.length === 0 && styles.markAllButtonDisabled,
            ]}
            onPress={handleMarkAllRead}
            disabled={notifications.length === 0}
            activeOpacity={0.8}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={notifications.length === 0 ? "#B0B0B0" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.markAllText,
                notifications.length === 0 && styles.markAllTextDisabled,
              ]}
            >
              Tandai Semua Dibaca
            </Text>
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
    paddingBottom: 100,
    flexGrow: 1,
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
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== TAB FILTER =====
  tabContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
  },
  tabScrollContent: {
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F0E8",
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabButtonActive: {
    backgroundColor: "#2D7D46",
    borderColor: "#2D7D46",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },

  // ===== NOTIFIKASI ITEM =====
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  notificationItemUnread: {
    borderColor: "#2D7D46",
    borderWidth: 1.5,
    backgroundColor: "#F5F9F7",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  notificationMessage: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: "#B0B0B0",
    marginTop: 4,
  },
  notificationDelete: {
    padding: 4,
  },

  // ===== EMPTY STATE =====
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F0E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  // ===== LOADING =====
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 14,
    color: "#888888",
  },

  // ===== BOTTOM BUTTON =====
  bottomWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  markAllButton: {
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
  markAllButtonDisabled: {
    backgroundColor: "#E8E8E8",
    shadowOpacity: 0,
    elevation: 0,
  },
  markAllText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  markAllTextDisabled: {
    color: "#B0B0B0",
  },
});
