import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSession } from "../hooks/useSession";

export default function CustomDrawerContent(props: any) {
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
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* ===== Main Section ===== */}
      <View style={styles.section}>
        <DrawerItem
          label="My Elders"
          icon={({ size, color }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/elders")}
        />

        <DrawerItem
          label="Care History"
          icon={({ size, color }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/care-history")}
        />

        <DrawerItem
          label="Payments"
          icon={({ size, color }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/payments")}
        />
      </View>

      {/* ===== Divider ===== */}
      <View style={styles.divider} />

      {/* ===== Account Section ===== */}
      <View style={styles.section}>
        <DrawerItem
          label="My Profile"
          icon={({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/profile")}
        />

        <DrawerItem
          label="Settings"
          icon={({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/settings")}
        />

        <DrawerItem
          label="Help & Support"
          icon={({ size, color }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          )}
          onPress={() => router.push("/(client)/support")}
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
        labelStyle={{ color: "#dc2626" }}
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
    backgroundColor: "#0a7ea4",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  email: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
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
