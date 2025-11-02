import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '@/src/theme/colors';

export default function TabsLayout() {
  const router = useRouter();

  // Custom Header Component
  const CustomHeader = ({ title }: { title: string }) => (
    <View style={styles.headerContainer}>
      {/* Title in the center */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Notification icon on the right */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => router.push('/(tabs)/notifications')}
      >
        <Ionicons name="notifications-outline" size={25} color="#292929ff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabContainer}>
      <Tabs
        screenOptions={({ route }) => ({
          // Use our custom header
          header: () => (
            <CustomHeader
              title={
                route.name === 'index'
                  ? 'Find Help'
                  : route.name === 'bookings'
                  ? 'My Bookings'
                  : route.name === 'dm'
                  ? 'Messages'
                  : route.name === 'profile'
                  ? 'Profile'
                  : 'App' // Fallback
              }
            />
          ),
          tabBarActiveTintColor: "#0088c6ff",
          tabBarInactiveTintColor: '#080808d3',
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          headerShown: true, // This is true, but our custom header overrides it
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4,
          },
        })}
      >
        {/* 🏠 Find Help */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Find Help',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* 📅 Bookings */}
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* 👤 DM */}
        <Tabs.Screen
          name="dm"
          options={{
            title: 'DM', // This title is for the tab label
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'chatbubble' : 'chatbubble-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* 👤 Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />

        {/* Hidden Notification Route */}
        <Tabs.Screen
          name="notifications"
          // href: null hides it from the tab bar
          options={{ href: null, headerShown: false }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    // Use background color from your theme
    backgroundColor: colors.background,
  },
  headerContainer: {
    height: Platform.OS === 'ios' ? 100 : 80, // Taller header
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 20,
    backgroundColor: colors.background, // Use primary color from theme
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Professional shadow for the header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: '#3d3d3dff',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    // Adjust top position to vertically align with title
    top: Platform.OS === 'ios' ? 60 : 30,
    padding: 8,
  },
  tabBar: {
    // This creates the floating tab bar
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20, // Safe area for iOS
    height: 70,
    paddingBottom: 8, // Adjust label padding
    paddingTop: 8, // Adjust icon padding
    backgroundColor: '#ffffff1d', // White background
    // Professional shadow for the tab bar
    borderBlockColor: "#d5d5d5ff",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

