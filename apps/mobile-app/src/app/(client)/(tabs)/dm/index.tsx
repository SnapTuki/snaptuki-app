import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type DMStatus = "UNREAD" | "READ";

type DM = {
  id: string;
  name: string;
  role: "Caregiver" | "Support";
  lastMessage: string;
  timestamp: string;
  status: DMStatus;
};

const MOCK_DMS: DM[] = [
  {
    id: "1",
    name: "Sarah Smith",
    role: "Caregiver",
    lastMessage: "I’ve completed the morning care tasks.",
    timestamp: "09:12",
    status: "UNREAD",
  },
  {
    id: "2",
    name: "SnapTuki Support",
    role: "Support",
    lastMessage: "Your booking has been confirmed.",
    timestamp: "Yesterday",
    status: "READ",
  },
];

export default function DMListScreen() {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const router = useRouter();

  const filteredDMs =
    filter === "ALL"
      ? MOCK_DMS
      : MOCK_DMS.filter((dm) => dm.status === "UNREAD");

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filters}>
        <FilterTab
          label="All"
          active={filter === "ALL"}
          onPress={() => setFilter("ALL")}
        />
        <FilterTab
          label="Unread"
          active={filter === "UNREAD"}
          onPress={() => setFilter("UNREAD")}
        />
      </View>

      {/* DM List */}
      <FlatList
        data={filteredDMs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              item.status === "UNREAD" && styles.unreadCard,
            ]}
            onPress={() => router.push(`/dm/${item.id}`)}
          >
            {/* Avatar */}
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={22}
                color="#ffffff"
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.timestamp}</Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.message,
                    item.status === "UNREAD" && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>

                {item.status === "UNREAD" && (
                  <View style={styles.unreadDot} />
                )}
              </View>

              <Text style={styles.role}>{item.role}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
function FilterTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterTab, active && styles.activeTab]}
    >
      <Text
        style={[styles.filterText, active && styles.activeText]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },

  filters: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 4,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#0a7ea4",
  },

  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },

  activeText: {
    color: "#ffffff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#0a7ea4",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  time: {
    fontSize: 12,
    color: "#6b7280",
  },

  message: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },

  unreadMessage: {
    fontWeight: "600",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0a7ea4",
    marginLeft: 8,
  },

  role: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
});
