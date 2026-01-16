import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { buttonStyles } from "../../theme/components";
import SnapTukiLogo from '@/assets/images/SnapTukiLogo'; // SVG logo component
import { useSession } from "@/src/hooks/useSession";
import useAuthStorage from "@/src/hooks/useAuthStorage";

export const unstable_settings = {
  headerShown: false,
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signIn, user} = useSession();

  const handleLogin = () => {
    signIn({email, password});
    setEmail("");
    setPassword("");
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <SnapTukiLogo width={90} height={90} />
          <Text style={typography.h1}>SnapTuki</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotLink}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={buttonStyles.primary} onPress={handleLogin}>
            <Text style={buttonStyles.primaryText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.signupLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 15,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: colors.primary,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.textSecondary,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  signupText: {
    color: colors.textSecondary,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});
