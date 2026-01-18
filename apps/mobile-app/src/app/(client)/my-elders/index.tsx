import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

type Elder = {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  mobilityLevel: "independent" | "needs_assistant" | "wheelchair";
};

export default function MyEldersScreen() {
  const router = useRouter();

  // 🔹 TEMP DATA (replace with GraphQL query)
  const [elders, setElders] = useState<Elder[]>([
    {
      id: "1",
      firstName: "Aisha",
      lastName: "Khan",
      age: 78,
      mobilityLevel: "needs_assistant",
    },
  ]);

  const removeElder = (id: string) => {
    Alert.alert(
      "Remove Elder",
      "Are you sure you want to remove this elder profile?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setElders((prev) => prev.filter((e) => e.id !== id));
          },
        },
      ]
    );
  };

  const renderElder = ({ item }: { item: Elder }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.name}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.subText}>
            Age: {item.age ?? "—"} · Mobility: {formatMobility(item.mobilityLevel)}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push(`/my-elders/[elderId]?id=${item.id}`)}
        >
          <Feather name="edit-2" size={18} color="#0a7ea4" />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.removeBtn}
          onPress={() => removeElder(item.id)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Elders</Text>
        <Text style={styles.subtitle}>
          Manage elder profiles for care services
        </Text>
      </View>

      {/* Content */}
      {elders.length === 0 ? (
        <EmptyState onAdd={() => router.push("/my-elders/add")} />
      ) : (
        <FlatList
          data={elders}
          keyExtractor={(item) => item.id}
          renderItem={renderElder}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Add Button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/my-elders/add")}
      >
        <Feather name="plus" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },

  header: {
    paddingVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  subText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  actions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  removeText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "500",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});


function formatMobility(level: string) {
  switch (level) {
    case "independent":
      return "Independent";
    case "needs_assistant":
      return "Needs Assistance";
    case "wheelchair":
      return "Wheelchair";
    default:
      return "—";
  }
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={{ alignItems: "center", marginTop: 80 }}>
      <Feather name="users" size={48} color="#9ca3af" />
      <Text style={{ fontSize: 16, marginTop: 12, fontWeight: "600" }}>
        No elders added yet
      </Text>
      <Text style={{ color: "#6b7280", marginTop: 4 }}>
        Add an elder to start booking care
      </Text>

      <Pressable
        onPress={onAdd}
        style={{
          marginTop: 20,
          backgroundColor: "#0a7ea4",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Add Elder
        </Text>
      </Pressable>
    </View>
  );
}
