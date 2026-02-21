import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
 import {
   CombinedGraphQLErrors,
   CombinedProtocolErrors,
 } from "@apollo/client/errors";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", 
});

// Create an Auth Link to inject the token from react-auth-kit into every GraphQL request
const authLink = new SetContextLink((prevContext, _) => {
  // react-auth-kit saves the token in a cookie with the name we defined in store.ts
  const token = Cookies.get('_snaptuki_auth');
  
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Log any GraphQL errors, protocol errors, or network error that occurred
 const errorLink = new ErrorLink(({ error, operation }) => {
   if (CombinedGraphQLErrors.is(error)) {
     error.errors.forEach(({ message, locations, path }) =>
       console.log(
         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
       )
     );
   } else if (CombinedProtocolErrors.is(error)) {
     error.errors.forEach(({ message, extensions }) =>
       console.log(
         `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
           extensions
         )}`
       )
     );
   } else {
     console.error(`[Network error]: ${error}`);
   }
 });

export const client = new ApolloClient({
  link: ApolloLink.from([httpLink, authLink, errorLink]),
  cache: new InMemoryCache(),
});