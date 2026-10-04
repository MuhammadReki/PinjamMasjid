// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* ===== SPLASH SCREEN (PERTAMA KALI) ===== */}
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        
        {/* ===== TABS (HALAMAN UTAMA) ===== */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        
        {/* ===== HALAMAN LAINNYA ===== */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="riwayat" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="inventaris" options={{ headerShown: false }} />
        <Stack.Screen name="buat-acara" options={{ headerShown: false }} />
        <Stack.Screen name="daftar-barang" options={{ headerShown: false }} />
        <Stack.Screen name="cari-barang" options={{ headerShown: false }} />
        <Stack.Screen name="laporan" options={{ headerShown: false }} />
        <Stack.Screen name="profil" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profil" options={{ headerShown: false }} />
        <Stack.Screen name="keamanan-akun" options={{ headerShown: false }} />
        <Stack.Screen name="notifikasi" options={{ headerShown: false }} />
        <Stack.Screen name="bantuan" options={{ headerShown: false }} />
        <Stack.Screen name="tentang" options={{ headerShown: false }} />
        <Stack.Screen name="lupa-password" options={{ headerShown: false }} />
        <Stack.Screen name="daftar-akun" options={{ headerShown: false }} />
        <Stack.Screen name="mode-gelap" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}