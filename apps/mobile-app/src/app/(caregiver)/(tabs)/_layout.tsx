import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';

export default function CaregiverTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF', // Professional Blue
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 1. Requests - The "Sales" funnel for new bookings */}
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'mail-unread' : 'mail-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 2. My Visits - The logistics and schedule hub */}
      <Tabs.Screen
        name="visits"
        options={{
          title: 'My Visits',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
          ),
        }}
      />

      {/* 3. Active Task - The "Working" mode (Reporting/Completion) */}
      <Tabs.Screen
        name="active-care"
        options={{
          title: 'Active Care',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'medical' : 'medical-outline'} size={22} color={color} />
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
    left: 16,
    right: 16,
    height: 65,
    borderRadius: 32, 
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
    paddingTop: 10, 
    backgroundColor: '#ffffff',
    // High-end Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
});