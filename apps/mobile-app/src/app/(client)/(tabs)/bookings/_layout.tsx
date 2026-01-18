import React from 'react';
import { Stack } from 'expo-router';
import GlobalHeader from '@/src/components/GlobalHeader';

export default function BookingStackLayout() {
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
        name="[bookingId]"
        options={{ 
          title: "Booking Details",
         }}
      />

    </Stack>
  );
}