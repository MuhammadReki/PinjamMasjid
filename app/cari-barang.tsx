import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export default function CariBarangScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // ===== LOAD DATA DARI SUPABASE =====
  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getItems();
      console.log("Cari Barang - Data:", data?.length);
      setItems(data || []);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems]),
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

  // ===== FILTER & SEARCH =====
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by search query
      const matchSearch =
        !searchQuery ||
        item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by kategori (kalau nanti ada kolom kategori)
      const matchCategory =
        selectedCategory === "Semua" ||
        item.kategori?.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [items, searchQuery, selectedCategory]);

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

  // ===== RENDER LOADING =====
  const renderLoadingState = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#2D7D46" />
      <Text style={styles.emptySubtitle}>Memuat barang...</Text>
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
        <Ionicons
          name={searchQuery ? "search-outline" : "cube-outline"}
          size={64}
          color="#C9A84C"
        />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "Barang tidak ditemukan" : "Belum ada barang"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? `Tidak ada barang dengan nama "${searchQuery}"`
          : "Barang yang didaftarkan akan muncul di sini"}
      </Text>
      {!searchQuery && (
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
      )}
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
              style={{ width: 52, height: 52, borderRadius: 12 }}
            />
          ) : (
            <Ionicons name="cube-outline" size={28} color="#2D7D46" />
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.nama || "Barang"}
          </Text>
          <Text style={styles.itemDetail} numberOfLines={1}>
            📦 Jumlah: {item.jumlah || 0} buah
          </Text>
          <Text style={styles.itemDesc} numberOfLines={1}>
            {item.deskripsi || "Tidak ada deskripsi"}
          </Text>
        </View>
        <View style={styles.itemStatus}>
          <Text style={styles.itemStatusText}>
            {item.kondisi || "Tersedia"}
          </Text>
        </View>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemDate}>
          📅{" "}
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </Text>
        {item.harga > 0 && (
          <Text style={styles.itemHarga}>
            Rp {new Intl.NumberFormat("id-ID").format(item.harga)}
          </Text>
        )}
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
              <Text style={styles.headerTitle}>Cari Barang</Text>
              <Text style={styles.headerSubtitle}>
                {filteredItems.length} barang ditemukan
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
              placeholder="Cari barang..."
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

        {/* ===== DAFTAR BARANG ===== */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={isLoading ? renderLoadingState : renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            filteredItems.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F0E8" },
  container: { flex: 1, backgroundColor: "#F5F0E8" },

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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== SEARCH BAR =====
  searchWrapper: { paddingHorizontal: 16, marginTop: -10, zIndex: 2 },
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
  categoriesWrapper: { marginTop: 16, marginBottom: 8 },
  categoriesContainer: { paddingHorizontal: 16, gap: 8 },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
  },
  categoryPillActive: { backgroundColor: "#2D7D46", borderColor: "#2D7D46" },
  categoryText: { fontSize: 13, fontWeight: "500", color: "#888888" },
  categoryTextActive: { color: "#FFFFFF" },

  // ===== LIST =====
  listContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 40 },

  // ===== ITEM CARD =====
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
  itemHeader: { flexDirection: "row", alignItems: "center" },
  itemIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F5F9F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  itemInfo: { flex: 1, paddingRight: 8 },
  itemName: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
  itemDetail: { fontSize: 12, color: "#888888", marginTop: 2 },
  itemDesc: {
    fontSize: 11,
    color: "#B0B0B0",
    marginTop: 2,
    fontStyle: "italic",
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
  },
  itemDate: { fontSize: 11, color: "#B0B0B0" },
  itemHarga: { fontSize: 12, fontWeight: "600", color: "#2D7D46" },

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
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
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
  emptyButtonText: { fontSize: 15, fontWeight: "bold", color: "#FFFFFF" },
});
