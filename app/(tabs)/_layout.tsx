import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Sembunyikan header bawaan
      }}
    >
      <Stack.Screen name="index" /> {/* Halaman Login */}
      <Stack.Screen name="dashboard" /> {/* Halaman Dashboard */}
    </Stack>
  );
}
