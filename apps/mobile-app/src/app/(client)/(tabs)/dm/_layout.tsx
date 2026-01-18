import React from 'react';
import { Stack } from 'expo-router';

export default function DmStackLayout() {
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
        name="[dmId]"
        options={{
          title: 'DM',
          headerShown: false, 
          headerBackVisible: true, // Hides the word "Back" on iOS for a cleaner arrow
          headerTintColor: '#007AFF', // Matches your brand color
        }}
      />


    </Stack>
  );
}