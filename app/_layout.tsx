import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Jika user belum login, arahkan ke auth/login */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      {/* Main App */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Modal atau Screen Detail */}
      <Stack.Screen 
        name="ticket/[mealId]" 
        options={{ 
          headerShown: true, 
          title: 'Detail Tiket',
          headerTintColor: '#4A3428'
        }} 
      />
    </Stack>
  );
}