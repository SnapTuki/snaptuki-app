import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { colors } from '@/src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Hide the default Tab header (because our internal Stacks handle it now)
        headerShown: false,
        
        // 2. Apply your Floating Tab Bar styles here
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        
        // 3. Tab styling
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      {/* 🏠 Find Help (The Home Stack) */}
      <Tabs.Screen
        name="find-help" // This now points to app/(tabs)/find-help/_layout.tsx
        options={{
          title: 'Find Help',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 📅 Bookings */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 👤 DM */}
      <Tabs.Screen
        name="dm"
        options={{
          title: 'DM',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 👤 Profile */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={22} color={color} />
          ),
        }}
      />
   
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35, // Rounded corners for floating effect
    paddingBottom: 8, 
    paddingTop: 8, 
    backgroundColor: '#ffffff', // Needs solid background to look good floating
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderTopWidth: 0, // Remove default top border
  },
});