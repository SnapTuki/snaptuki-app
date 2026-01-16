
import { type PropsWithChildren, useState, useEffect } from "react";
import AuthContext from "../contexts/authContext";
import useAuthStorage from "../hooks/useAuthStorage";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/mutations";
import { Alert } from "react-native";
import { LoginCredentials } from "../types/__generated__/graphql";

export function SessionProvider({ children }: PropsWithChildren) {
    const authStorage = useAuthStorage();
    const [login,] = useMutation(LOGIN);
    const [session, setSession] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                setIsLoading(true);
                const token = await authStorage?.getAccessToken();
                if (token) {
                    setSession(token);
                    // optionally fetch user profile here
                }
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