import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function BookingDetailsScreen() {
  const { bookingId } = useLocalSearchParams();

  // 🔁 Replace with GraphQL query later
  const booking = {
    id: bookingId,
    status: "CONFIRMED",
    serviceName: "Personal Care",
    elderName: "John Doe",
    caregiverName: "Sarah Smith",
    caregiverPhone: "+358 40 123 4567",
    date: "Jan 20, 2026",
    time: "09:00 – 12:00",
    address: "Helsinki, Finland",
    notes:
      "Please assist with morning routine and medication reminders.",
  };

  const status = STATUS_STYLES[booking.status as BookingStatus];

  return (
    <ScrollView style={styles.container}>
      {/* Status */}
      <View style={styles.headerCard}>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {booking.status}
          </Text>
        </View>

        <Text style={styles.service}>{booking.serviceName}</Text>
      </View>

      {/* Elder */}
      <InfoCard
        icon="heart-outline"
        title="Elder"
        content={booking.elderName}
      />

      {/* Caregiver */}
      <InfoCard
        icon="person-outline"
        title="Caregiver"
        content={booking.caregiverName}
        subContent={booking.caregiverPhone}
      />

      {/* Schedule */}
      <InfoCard
        icon="calendar-outline"
        title="Schedule"
        content={`${booking.date} · ${booking.time}`}
        subContent={booking.address}
      />

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Care Notes</Text>
        <Text style={styles.notes}>
          {booking.notes || "No notes provided."}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, styles.secondary]}>
          <Ionicons name="calendar-outline" size={18} color="#2563eb" />
          <Text style={styles.secondaryText}>Reschedule</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.danger]}>
          <Ionicons name="close-circle-outline" size={18} color="#dc2626" />
          <Text style={styles.dangerText}>Cancel Booking</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
function InfoCard({
  icon,
  title,
  content,
  subContent,
}: {
  icon: any;
  title: string;
  content: string;
  subContent?: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color="#0a7ea4" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <Text style={styles.cardContent}>{content}</Text>
      {subContent && (
        <Text style={styles.cardSub}>{subContent}</Text>
      )}
    </View>
  );
}
type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

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

  headerCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  service: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  cardContent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  cardSub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  notes: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  actions: {
    marginTop: 8,
    gap: 12,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },

  secondary: {
    backgroundColor: "#eff6ff",
  },
  secondaryText: {
    color: "#2563eb",
    fontWeight: "600",
  },

  danger: {
    backgroundColor: "#fef2f2",
  },
  dangerText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});
