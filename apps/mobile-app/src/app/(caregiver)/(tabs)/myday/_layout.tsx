import React from 'react';
import { Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
export default function RequestsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false, // Removes default shadow/border to match your clean look
        headerShown: false,
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
        name="[visitInProgress]"
        options={{ 
          headerShown: false,
          headerBackVisible: true,
         }}
      /> 

    </Stack>
  );
}