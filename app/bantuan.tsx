import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BantuanScreen() {
  const insets = useSafeAreaInsets();

  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

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

  const toggleFAQ = (id: string) => {
    if (expandedFAQ === id) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(id);
    }
  };

  // ===== DATA KATEGORI =====
  const categories = [
    { id: "inventaris", icon: "cube-outline", label: "Inventaris" },
    { id: "acara", icon: "calendar-outline", label: "Acara" },
    { id: "riwayat", icon: "document-text-outline", label: "Riwayat" },
    { id: "akun", icon: "person-outline", label: "Akun" },
    { id: "notifikasi", icon: "notifications-outline", label: "Notifikasi" },
    { id: "pengaturan", icon: "settings-outline", label: "Pengaturan" },
  ];

  // ===== DATA FAQ =====
  const faqs = [
    { id: "1", question: "Bagaimana cara mendaftarkan barang?" },
    { id: "2", question: "Bagaimana membuat acara?" },
    { id: "3", question: "Bagaimana meminjam barang?" },
    { id: "4", question: "Bagaimana mengubah profil?" },
    { id: "5", question: "Bagaimana mengaktifkan notifikasi?" },
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
              <Text style={styles.headerTitle}>Bantuan</Text>
              <Text style={styles.headerSubtitle}>
                Pusat bantuan PinjamMasjid
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* ===== KONTEN ===== */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===== SEARCH BOX ===== */}
          <Animated.View
            style={[
              styles.searchWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#888888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Apa yang ingin Anda tanyakan?"
                placeholderTextColor="#B0B0B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </Animated.View>

          {/* ===== KATEGORI BANTUAN ===== */}
          <Animated.View
            style={[
              styles.sectionHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Kategori Bantuan</Text>
          </Animated.View>

          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color="#2D7D46"
                  />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ===== PERTANYAAN UMUM ===== */}
          <Animated.View
            style={[
              styles.sectionHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Pertanyaan Umum</Text>
          </Animated.View>

          <View style={styles.faqContainer}>
            {faqs.map((faq) => {
              const isExpanded = expandedFAQ === faq.id;
              return (
                <TouchableOpacity
                  key={faq.id}
                  style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#2D7D46"
                    />
                  </View>
                  {isExpanded && (
                    <Animated.View
                      style={[
                        styles.faqAnswerContainer,
                        {
                          opacity: fadeAnim,
                        },
                      ]}
                    >
                      <Text style={styles.faqAnswer}>
                        Informasi akan ditampilkan setelah sistem dikonfigurasi
                      </Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ===== HUBUNGI KAMI ===== */}
          <Animated.View
            style={[
              styles.contactCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.contactLeft}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="mail-outline" size={24} color="#2D7D46" />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>Hubungi Admin</Text>
                <Text style={styles.contactSubtitle}>
                  Butuh bantuan lebih lanjut?
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton} activeOpacity={0.7}>
              <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Hubungi</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ===== FOOTER ===== */}
          <Text style={styles.footer}>PinjamMasjid v1.0</Text>

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

  // ===== SEARCH =====
  searchWrapper: {
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    paddingLeft: 10,
    paddingVertical: 8,
  },

  // ===== SECTION =====
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },

  // ===== KATEGORI =====
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryCard: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8F5EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  // ===== FAQ =====
  faqContainer: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  faqCardExpanded: {
    borderColor: "#2D7D46",
    borderWidth: 1.5,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    paddingRight: 12,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  faqAnswer: {
    fontSize: 13,
    color: "#888888",
    lineHeight: 20,
  },

  // ===== HUBUNGI KAMI =====
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  contactSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D7D46",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  // ===== FOOTER =====
  footer: {
    textAlign: "center",
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 20,
  },
});
