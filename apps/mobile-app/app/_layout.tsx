import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Configuration for global header options can go here */}
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
    </Stack>
  );
}