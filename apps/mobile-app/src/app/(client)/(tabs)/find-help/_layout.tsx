import React from 'react';
import { Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false, // Removes default shadow/border to match your clean look
      }}
    >
      {/* SCREEN 1: The Feed 
        This uses your Custom Header.
      */}
      <Stack.Screen
        name="index"
        options={{
          // We use the custom component as the header
          headerShown: false
        }}
      />

      <Stack.Screen
        name="caregivers"
        options={{
          title: 'Find Caregiver',
          headerShown: false, 
          headerBackVisible: true, // Hides the word "Back" on iOS for a cleaner arrow
          headerTintColor: '#007AFF', // Matches your brand color
        }}
      />

      <Stack.Screen
        name="[caregiverId]"
        options={{ 
          headerShown: false,
          headerBackVisible: false,
         }}
      />

    </Stack>
  );
}