import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type CareHistoryItem = {
  id: string;
  elderName: string;
  caregiverName: string;
  date: string;
  startTime: string;
  endTime: string;
};

const MOCK_DATA: CareHistoryItem[] = [
  {
    id: "1",
    elderName: "John Doe",
    caregiverName: "Sarah Smith",
    date: "Jan 12, 2026",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
  },
  {
    id: "2",
    elderName: "Mary Doe",
    caregiverName: "Alex Johnson",
    date: "Jan 10, 2026",
    startTime: "02:00 PM",
    endTime: "05:00 PM",
  },
];

export default function CareHistoryScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: CareHistoryItem }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/care-history/${item.id}`)}
    >
      <View style={styles.headerRow}>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Completed</Text>
        </View>
      </View>

      <Text style={styles.elderName}>Elder: {item.elderName}</Text>
      <Text style={styles.caregiver}>
        Caregiver: {item.caregiverName}
      </Text>

      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text style={styles.timeText}>
          {item.startTime} – {item.endTime}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Care History</Text>

      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
  },
  badge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
  },
  elderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  caregiver: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  timeText: {
    marginLeft: 6,
    color: "#6b7280",
    fontSize: 13,
  },
});
