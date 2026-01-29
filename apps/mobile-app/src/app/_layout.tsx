import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client/react';
import createApolloClient from '@/src/utils/apolloClient';
import AuthStorage from '../utils/authenStorage';
import { SessionProvider } from '../utils/SessionProvider';
import { useSession } from '../hooks/useSession';
import { CareServiceProvier } from '../utils/CareServiceProvider';
const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

/**
 * Loading Screen Component
 * Designed for an elder-care platform: clear text and high-contrast spinner.
 */
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Setting things up for you...</Text>
    </View>
  );
}

function NavigationContent() {
  const { session, isLoading } = useSession();
  console.log("Isloading value: " + isLoading);

  // Show the loading screen while checking storage/auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        // Main App Experience
        <Stack.Screen name="(client)" />
      ) : (
        // Authentication Flow
        <>
          <Stack.Screen name="(auth)" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider>
        <CareServiceProvier>
          <NavigationContent />
        </CareServiceProvier>
      </SessionProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
});