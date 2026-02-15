"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  ApolloClient,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";

// 1. Configure the Client
function makeClient() {
  const httpLink = new HttpLink({
    // REPLACE with your actual backend URL
    uri: "http://localhost:4000/graphql", 
    
    // Disable Next.js caching for data (Critical for real-time dashboards)
    fetchOptions: { cache: "no-store" }, 
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}

// 2. Export the Provider Component
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}