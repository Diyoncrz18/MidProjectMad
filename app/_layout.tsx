import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Jika user belum login, arahkan ke auth/login */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          {/* Main App - Mahasiswa */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Admin Panel */}
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          {/* Modal atau Screen Detail */}
          <Stack.Screen
            name="ticket/[mealId]"
            options={{
              headerShown: true,
              title: "Detail Tiket",
              headerTintColor: "#4A3428",
            }}
          />
        </Stack>
      </AuthProvider>
    </ConvexProvider>
  );
}
