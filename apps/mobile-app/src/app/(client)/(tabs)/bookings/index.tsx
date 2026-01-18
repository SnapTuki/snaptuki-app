import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

type Booking = {
  id: string;
  elderName: string;
  caregiverName?: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: string;
};

const BOOKINGS: Booking[] = [
  {
    id: "1",
    elderName: "John Doe",
    caregiverName: "Sarah Smith",
    serviceName: "Personal Care",
    date: "Jan 20, 2026",
    time: "09:00 – 12:00",
    status: "CONFIRMED",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    elderName: "Mary Johnson",
    serviceName: "Medication Assistance",
    date: "Jan 25, 2026",
    time: "14:00 – 15:00",
    status: "PENDING",
    createdAt: "2026-01-17",
  },
  {
    id: "3",
    elderName: "Robert Brown",
    caregiverName: "Emily Clark",
    serviceName: "Physiotherapy",
    date: "Jan 10, 2026",
    time: "10:00 – 11:30",
    status: "COMPLETED",
    createdAt: "2026-01-10",
  },
  {
    id: "4",
    elderName: "Anna White",
    serviceName: "Home Support",
    date: "Jan 05, 2026",
    time: "08:00 – 10:00",
    status: "CANCELLED",
    createdAt: "2026-01-05",
  },
];

const FILTERS = ["All", "Latest", "Pending", "Active", "Completed", "Cancelled"] as const;
type Filter = typeof FILTERS[number];

export default function BookingsScreen() {
  const [filter, setFilter] = useState<Filter>("All");
  const router = useRouter();

  const filteredBookings = useMemo(() => {
    if (filter === "All") return BOOKINGS;

    if (filter === "Latest") {
      return [...BOOKINGS].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    }

    if (filter === "Active") {
      return BOOKINGS.filter((b) => b.status === "CONFIRMED");
    }

    return BOOKINGS.filter(
      (b) => b.status === filter.toUpperCase()
    );
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>

      {/* Filters */}
      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              filter === item && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              router.push(`/bookings/${item.id}`)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No bookings found.
          </Text>
        }
      />
    </View>
  );
}

function BookingCard({
  booking,
  onPress,
}: {
  booking: Booking;
  onPress: () => void;
}) {
  const status = STATUS_STYLES[booking.status];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.bg },
          ]}
        >
          <Text style={[styles.statusText, { color: status.text }]}>
            {booking.status}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#9ca3af"
        />
      </View>

      <Text style={styles.elderName}>{booking.elderName}</Text>
      <Text style={styles.service}>{booking.serviceName}</Text>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color="#6b7280" />
        <Text style={styles.metaText}>{booking.date}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color="#6b7280" />
        <Text style={styles.metaText}>{booking.time}</Text>
      </View>

      {booking.caregiverName && (
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={14} color="#6b7280" />
          <Text style={styles.metaText}>
            {booking.caregiverName}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
const STATUS_STYLES: Record<
  BookingStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: "#fff7ed", text: "#ea580c" },
  CONFIRMED: { bg: "#eff6ff", text: "#2563eb" },
  COMPLETED: { bg: "#ecfdf5", text: "#059669" },
  CANCELLED: { bg: "#fef2f2", text: "#dc2626" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  filterChipActive: {
    backgroundColor: "#0a7ea4",
  },
  filterText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#ffffff",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  elderName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  service: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#4b5563",
  },

  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
});
