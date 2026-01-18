import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '@/src/components/CustomDrawerContent';
import { useSession } from '@/src/hooks/useSession';
import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
export default function ClientLayout() {
  const { user } = useSession();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
        screenOptions={({ navigation }) => ({
        headerShown: true,

        // 🔵 LEFT: User Icon (bigger, round)
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.toggleDrawer()}
            style={styles.avatarButton}
          >
            <Feather name="user" size={22} color="#ffffff" />
          </Pressable>
        ),

        // 🧭 CENTER: Brand title
        headerTitle: () => (
          <Text style={styles.brand}>SnapTuki</Text>
        ),

        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: styles.header,
      })}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="my-elders/" />
        <Drawer.Screen name="care-history" />
        <Drawer.Screen name="payments" />
        <Drawer.Screen name="profile" />
        <Drawer.Screen name="settings" />
        <Drawer.Screen name="support" />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    height: 120,
  },

  avatarButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.5,
  },
});
