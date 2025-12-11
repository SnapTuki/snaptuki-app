import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client/react';
import createApolloClient from '@/src/utils/apolloClient';


const apolloClient = createApolloClient();

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLanding" />
        <Stack.Screen name="signup-family" />
      </Stack>
    </ApolloProvider>
  );
}