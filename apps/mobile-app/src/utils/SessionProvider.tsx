
import { type PropsWithChildren, useState, useEffect } from "react";
import AuthContext from "../contexts/authContext";
import useAuthStorage from "../hooks/useAuthStorage";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations";
import { Alert } from "react-native";
import { WHO_IS_ME } from "../graphql/queries";
import { LoginCredentials } from "../types/__generated__/graphql";

export function SessionProvider({ children }: PropsWithChildren) {
  const authStorage = useAuthStorage();
  const [login,] = useMutation(LOGIN);
  const client = useApolloClient(); // Access the Apollo Client instance
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<any | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await authStorage?.getAccessToken();
        console.log(`Token from storage: ${token}`);
        if (!token) {
          setIsLoading(false);
          return;
        }

        setSession(token);

        // Fetch current user
        const { data } = await client.query({
          query: WHO_IS_ME,
          fetchPolicy: 'network-only'
        });

        setUser(data?.me);
      } catch (e) {
        await authStorage?.removeAccessToken();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);




  /**
* Performs the sign-in logic.
* Updates storage, resets Apollo cache, and sets global state.
*/
  const signIn = async ({ email, password }: LoginCredentials) => {
    if (!email?.trim() || !password?.trim()) {
      Alert.alert("Input Required", "Please enter both your email and password.");
      return;
    }

    try {
      setIsLoading(true);     

      const result = await login({
        variables: { credentials: { email: email.trim(), password } }
      });

      const loginPayload = result.data?.login;


      if (loginPayload && loginPayload.token) {


        // 1. Save to persistent storage

        await authStorage?.setAccessToken(loginPayload.token);
        client.resetStore();

        setSession(loginPayload.token);
        setUser(loginPayload.user);


      }
    } catch (error: any) {
      console.error("GraphQL Login Error:", error);
      Alert.alert("Authentication Error", error.message || "Could not log in.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Performs the sign-out logic.
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      await authStorage?.removeAccessToken();
      client.resetStore()
      setSession(null);
      setUser(null);
    } catch (e) {
      console.error("Sign out failed:", e);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <AuthContext.Provider
      value={{ signIn, signOut, user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}