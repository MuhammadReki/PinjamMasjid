import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

// 🔥 LOGO DARI IMGBB (URL LANGSUNG)
const LOGO_URL = "https://i.ibb.co.com/gZhskXq5/Logo-Pinjam-Masjid.png";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  // ===== ANIMASI =====
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(50)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const subtitleTranslate = useRef(new Animated.Value(30)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.5)).current;
  const shineOpacity = useRef(new Animated.Value(0)).current;

  const [isReady, setIsReady] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ===== ANIMASI LOGO =====
  useEffect(() => {
    // Logo muncul dengan fade + scale
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 30,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow effect
    setTimeout(() => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(glowScale, {
          toValue: 1,
          tension: 30,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Shine effect
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(shineOpacity, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shineOpacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Title muncul dari bawah
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleFade, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslate, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Subtitle muncul
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslate, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);

    setTimeout(() => {
      setIsReady(true);
    }, 3800);
  }, []);

  // ===== PINDAH KE HALAMAN BERIKUTNYA =====
  useEffect(() => {
    if (isReady) {
      Animated.timing(logoFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/");
      });
    }
  }, [isReady]);

  return (
    <LinearGradient
      colors={["#2D7D46", "#1A5A33"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        {/* ===== POLA GEOMETRIS PREMIUM ===== */}
        <View style={styles.patternContainer}>
          <View style={styles.pattern1} />
          <View style={styles.pattern2} />
          <View style={styles.pattern3} />
          <View style={styles.pattern4} />
          <View style={styles.pattern5} />
          <View style={styles.pattern6} />
          <View style={styles.pattern7} />
          <View style={styles.pattern8} />
          <View style={styles.pattern9} />
          <View style={styles.pattern10} />
        </View>

        {/* ===== ORNAMEN EMAS ===== */}
        <View style={styles.ornamentTop} />
        <View style={styles.ornamentBottom} />

        {/* ===== KONTEN UTAMA ===== */}
        <View style={styles.content}>
          {/* Glow Effect */}
          <Animated.View
            style={[
              styles.glowContainer,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          >
            <View style={styles.glow} />
          </Animated.View>

          {/* Shine Effect */}
          <Animated.View
            style={[
              styles.shineContainer,
              {
                opacity: shineOpacity,
              },
            ]}
          >
            <View style={styles.shine} />
          </Animated.View>

          {/* LOGO KOTAK PREMIUM */}
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                opacity: logoFade,
                transform: [{ scale: logoScale }],
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
          </Animated.View>

          {/* Nama Aplikasi */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleFade,
                transform: [{ translateY: titleTranslate }],
              },
            ]}
          >
            <Text style={styles.title}>PinjamMasjid</Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View
            style={[
              styles.subtitleContainer,
              {
                opacity: subtitleFade,
                transform: [{ translateY: subtitleTranslate }],
              },
            ]}
          >
            <Text style={styles.subtitle}>Gotong Royong Digital</Text>
          </Animated.View>

          {/* Loading Dots */}
          <View style={styles.loadingContainer}>
            <View style={[styles.loadingDot, styles.loadingDot1]} />
            <View style={[styles.loadingDot, styles.loadingDot2]} />
            <View style={[styles.loadingDot, styles.loadingDot3]} />
          </View>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Masjid An-Nur Payakumbuh</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  // ===== POLA GEOMETRIS =====
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    opacity: 0.06,
  },
  pattern1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pattern2: {
    position: "absolute",
    top: 40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern3: {
    position: "absolute",
    bottom: 60,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "60deg" }],
  },
  pattern4: {
    position: "absolute",
    bottom: 180,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "15deg" }],
  },
  pattern5: {
    position: "absolute",
    top: 140,
    right: 70,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pattern6: {
    position: "absolute",
    top: 220,
    left: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "30deg" }],
  },
  pattern7: {
    position: "absolute",
    bottom: 100,
    left: 100,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "20deg" }],
  },
  pattern8: {
    position: "absolute",
    top: 90,
    left: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "10deg" }],
  },
  pattern9: {
    position: "absolute",
    bottom: 220,
    right: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "25deg" }],
  },
  pattern10: {
    position: "absolute",
    top: 250,
    right: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "40deg" }],
  },

  // ===== ORNAMEN =====
  ornamentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(201, 168, 76, 0.15)",
  },
  ornamentBottom: {
    position: "absolute",
    bottom: 80,
    left: "20%",
    right: "20%",
    height: 1,
    backgroundColor: "rgba(201, 168, 76, 0.1)",
  },

  // ===== GLOW =====
  glowContainer: {
    position: "absolute",
    top: "35%",
    left: "50%",
    marginLeft: -120,
    marginTop: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#C9A84C",
    opacity: 0.1,
  },
  glow: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#C9A84C",
  },

  // ===== SHINE =====
  shineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  shine: {
    position: "absolute",
    top: "-10%",
    left: "-20%",
    width: "60%",
    height: "120%",
    backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ rotate: "30deg" }],
  },

  // ===== LOGO =====
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoBox: {
    width: 170,
    height: 170,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#C9A84C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 15,
    overflow: "hidden",
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  logoFallback: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoFallbackText: {
    fontSize: 68,
  },

  // ===== TITLE =====
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  // ===== SUBTITLE =====
  subtitleContainer: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 4,
    fontWeight: "300",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ===== LOADING =====
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C9A84C",
  },
  loadingDot1: {
    opacity: 0.3,
  },
  loadingDot2: {
    opacity: 0.6,
  },
  loadingDot3: {
    opacity: 1,
  },

  // ===== FOOTER =====
  footer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.5,
    fontWeight: "300",
  },
});