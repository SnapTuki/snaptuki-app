import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { buttonStyles } from "../theme/components";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import SnapTukiLogo from "@/assets/images/SnapTukiLogo.svg";


export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo & Title */}
          
      <View style={styles.header}>
        <Text>
          <SnapTukiLogo width={200} height={200} />  {/* SVG logo */}
        </Text>

        <Text style={typography.h1}>SnapTuki</Text>
        <Text style={typography.subtitle}>
          Connecting Families with Reliable Caregivers
        </Text>
      </View>
      

      {/* Buttons */}
      <View style={styles.buttonContainer}>
         <TouchableOpacity
          style={buttonStyles.primary}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={buttonStyles.primaryText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyles.secondary}
          onPress={() => router.push("/(auth)/signup/family")}
        >
          <Text style={buttonStyles.secondaryText}>Sign Up as Family Member</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={buttonStyles.secondary}
          onPress={() => router.push("/")}
        >
          <Text style={buttonStyles.secondaryText}>Sign Up as Caregiver</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={typography.caption}>
        Already have an account?{" "}
        <Text
          style={typography.link}
          onPress={() => router.push("/login")}
        >
          Log In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {

    alignItems: "center",

  },
  art: {
    width: 220,
    height: 220,
    marginVertical: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    width: "80%",
    //backgroundColor: 'red',
    gap: 10
  }
});
