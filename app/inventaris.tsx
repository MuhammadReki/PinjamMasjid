import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItems } from "../utils/storage";

export default function InventarisScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== ANIMASI =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fabScaleAnim = useRef(new Animated.Value(1)).current;

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

  // ===== LOAD DATA DARI SUPABASE =====
  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getItems();
      console.log("Data inventory:", data);
      setInventory(data || []);
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory]),
  );

  // ===== KATEGORI =====
  const categories = [
    "Semua",
    "Peralatan",
    "Elektronik",
    "Ibadah",
    "Acara",
    "Lainnya",
  ];

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

  const handleFabPressIn = () => {
    Animated.spring(fabScaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  // ===== RENDER LOADING STATE =====
  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#2D7D46" />
      <Text style={styles.emptySubtitle}>Memuat data...</Text>
    </View>
  );

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
        <Ionicons name="cube-outline" size={64} color="#2D7D46" />
      </View>
      <Text style={styles.emptyTitle}>Inventaris masih kosong</Text>
      <Text style={styles.emptySubtitle}>
        Barang yang didaftarkan akan muncul di sini
      </Text>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push("/daftar-barang")}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.emptyButtonText}>Daftarkan Barang</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );

  // ===== RENDER ITEM =====
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.8}>
      <View style={styles.itemHeader}>
        <View style={styles.itemIconContainer}>
          {item.foto_url ? (
            <Image
              source={{ uri: item.foto_url }}
              style={{ width: 44, height: 44, borderRadius: 12 }}
            />
          ) : (
            <Ionicons name="cube-outline" size={24} color="#2D7D46" />
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.nama || "Barang"}</Text>
          <Text style={styles.itemDetail}>Jumlah: {item.jumlah || 0} buah</Text>
        </View>
        <View style={styles.itemStatus}>
          <Text style={styles.itemStatusText}>
            {item.kondisi || "Tersedia"}
          </Text>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemOwner} numberOfLines={1}>
          📝 {item.deskripsi || "Tidak ada deskripsi"}
        </Text>
        <Text style={styles.itemDate}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "-"}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.headerTitle}>Inventaris</Text>
              <Text style={styles.headerSubtitle}>
                Kelola inventaris barang masjid
              </Text>
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Ionicons name="filter" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== SEARCH BAR ===== */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchContainer,
              isSearchFocused && styles.searchFocused,
            ]}
          >
            <Ionicons name="search" size={20} color="#888888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari barang inventaris..."
              placeholderTextColor="#B0B0B0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color="#B0B0B0" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ===== FILTER KATEGORI ===== */}
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  selectedCategory === category && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===== RINGKASAN INVENTARIS ===== */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="cube-outline" size={20} color="#2D7D46" />
            </View>
            <Text style={styles.summaryLabel}>Total Barang</Text>
            <Text style={styles.summaryValue}>{inventory.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#E8F5EA" }]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#2D7D46"
              />
            </View>
            <Text style={styles.summaryLabel}>Barang Tersedia</Text>
            <Text style={styles.summaryValue}>
              {inventory.filter((i) => i.kondisi === "baik").length}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: "#FFF8E1" }]}>
              <Ionicons
                name="swap-horizontal-outline"
                size={20}
                color="#C9A84C"
              />
            </View>
            <Text style={styles.summaryLabel}>Peminjaman</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
        </View>

        {/* ===== DAFTAR INVENTARIS ===== */}
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={isLoading ? renderLoadingState : renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            inventory.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
        />

        {/* ===== FLOATING ACTION BUTTON ===== */}
        <Animated.View
          style={[
            styles.fabContainer,
            {
              transform: [{ scale: fabScaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => router.push("/daftar-barang")}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

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

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <View style={styles.navIconWrapper}>
              <Ionicons name="cube" size={24} color="#2D7D46" />
              <View style={styles.navIndicator} />
            </View>
            <Text style={[styles.navLabel, styles.navLabelActive]}>
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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/profil")}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={24} color="#999" />
            <Text style={[styles.navLabel, styles.navLabelInactive]}>
              Profil
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

  // ===== SEARCH BAR =====
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: -10,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchFocused: {
    borderColor: "#2D7D46",
    shadowColor: "#2D7D46",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  // ===== KATEGORI =====
  categoriesWrapper: {
    marginTop: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
  },
  categoryPillActive: {
    backgroundColor: "#2D7D46",
    borderColor: "#2D7D46",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },

  // ===== RINGKASAN =====
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F9F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#888888",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 2,
  },

  // ===== LIST =====
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // ===== ITEM =====
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F9F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  itemDetail: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  itemStatus: {
    backgroundColor: "#E8F5EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemStatusText: {
    fontSize: 10,
    color: "#2D7D46",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  itemOwner: {
    flex: 1,
    fontSize: 12,
    color: "#888888",
  },
  itemDate: {
    fontSize: 11,
    color: "#B0B0B0",
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
    backgroundColor: "#F5F9F7",
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
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // ===== FAB =====
  fabContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2D7D46",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2D7D46",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
    fontSize: 9,
    color: "#999",
    marginTop: 1,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  navLabelActive: {
    color: "#2D7D46",
    fontWeight: "600",
  },
  navLabelInactive: {
    color: "#999",
  },
});
