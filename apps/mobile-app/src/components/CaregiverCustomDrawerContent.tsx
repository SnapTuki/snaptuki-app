import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSession } from "../hooks/useSession";

export default function CaregiverCustomDrawerContent(props: any) {
  const router = useRouter();
  const { signOut } = useSession();

  const user = props.user;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        {/* Verification Badge for Caregivers */}
        <View style={styles.badgeRow}>
          <Ionicons name="shield-checkmark" size={14} color="#00A79D" />
          <Text style={styles.verifiedText}>Verified Professional</Text>
        </View>
      </View>

      {/* ===== Main Section: Daily Operations ===== */}
      <View style={styles.section}>
        <DrawerItem
          label="Home"
          icon={({ size, color }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/(tabs)/requests")}
        />

        <DrawerItem
          label="Performance"
          icon={({ size, color }) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/performance")}
        />

        <DrawerItem
          label="Care Academy"
          icon={({ size, color }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/academy")}
        />

        <DrawerItem
          label="Agency & Protocols"
          icon={({ size, color }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/agency")}
        />
      </View>

      {/* ===== Divider ===== */}
      <View style={styles.divider} />

      {/* ===== Account Section: Personal Admin ===== */}
      <View style={styles.section}>
        <DrawerItem
          label="Verified Profile"
          icon={({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/profile")}
        />

        <DrawerItem
          label="Shift Preferences"
          icon={({ size, color }) => (
            <Ionicons name="options-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/preferences")}
        />

        <DrawerItem
          label="Help & Support"
          icon={({ size, color }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(caregiver)/support")}
        />
      </View>

      {/* ===== Divider ===== */}
      <View style={styles.divider} />

      {/* ===== Logout ===== */}
      <DrawerItem
        label="Log out"
        icon={({ size }) => (
          <Ionicons name="log-out-outline" size={size} color="#dc2626" />
        )}
        labelStyle={{ color: "#dc2626", fontWeight: "600" }}
        onPress={async () => {
          await signOut();
          router.replace("/(auth)/login");
        }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#005FB8", // Professional Blue
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#E6F7F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: "#00A79D", // Vitality Teal
    fontWeight: "700",
    marginLeft: 4,
  },
  section: {
    paddingTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
    marginHorizontal: 16,
  },
});