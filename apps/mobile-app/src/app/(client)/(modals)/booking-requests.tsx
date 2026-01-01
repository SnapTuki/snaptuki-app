import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";

export default function BookingRequestModal() {
  const { caregiverId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  /* ---------------- Mock Data (replace later) ---------------- */

  const service = {
    name: "Personal Elder Care",
    description: "Daily assistance, companionship, medication reminders",
  };

  const elder = {
    name: "Maria Ahmed",
    avatar: "https://i.pravatar.cc/300?img=12",
  };

  const hourlyRate = 18;

  /* ---------------- State ---------------- */

  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
  );
  const [notes, setNotes] = useState("");

  /* ---------------- Calculations ---------------- */

  const durationHours = useMemo(() => {
    const diffMs = endTime.getTime() - arrivalTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return Math.max(0, Number(hours.toFixed(1)));
  }, [arrivalTime, endTime]);

  const totalPrice = useMemo(
    () => Math.round(durationHours * hourlyRate),
    [durationHours]
  );

  /* ---------------- UI ---------------- */

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request Booking</Text>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Summary */}
        <Card>
          <Text style={styles.sectionTitle}>Requested Service</Text>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDesc}>{service.description}</Text>
        </Card>

        {/* Elder Profile */}
        <Card>
          <Text style={styles.sectionTitle}>Service Recipient</Text>
          <View style={styles.elderRow}>
            <Image source={{ uri: elder.avatar }} style={styles.elderAvatar} />
            <Text style={styles.elderName}>{elder.name}</Text>
          </View>
        </Card>

        {/* Date & Time */}
        <Card>
          <Text style={styles.sectionTitle}>Schedule</Text>

          <Label text="Arrival Time" />
          <DateTimePicker
            value={arrivalTime}
            mode="datetime"
            display="compact"
            onChange={(_, date) => date && setArrivalTime(date)}
          />

          <Label text="Ending Time" />
          <DateTimePicker
            value={endTime}
            mode="datetime"
            display="compact"
            minimumDate={arrivalTime}
            onChange={(_, date) => date && setEndTime(date)}
          />
        </Card>

        {/* Payment */}
        <Card>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <Ionicons name="cash-outline" size={20} color="#2563eb" />
            <Text style={styles.paymentText}>Cash (default)</Text>
          </View>
        </Card>

        {/* Notes */}
        <Card>
          <Text style={styles.sectionTitle}>Extra Notes</Text>
          <TextInput
            placeholder="Any special instructions for the caregiver?"
            multiline
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
          />
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>
            Duration: {durationHours} hrs
          </Text>
          <Text style={styles.totalPrice}>${totalPrice}</Text>
        </View>

        <View style={styles.footerButtons}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.confirmButton]}
            disabled={durationHours <= 0}
            onPress={() => {
              // submit booking request
              router.replace("/(client)/(tabs)/bookings");
            }}
          >
            <Text style={styles.confirmText}>Request Booking</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ---------------- Reusable Components ---------------- */

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },

  content: {
    padding: 16,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0f172a",
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "600",
  },
  serviceDesc: {
    marginTop: 4,
    color: "#64748b",
    lineHeight: 20,
  },

  elderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  elderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  elderName: {
    fontSize: 16,
    fontWeight: "500",
  },

  label: {
    color: "#64748b",
    marginBottom: 6,
    marginTop: 10,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    marginLeft: 8,
    fontWeight: "500",
  },

  notesInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },

  totalLabel: {
    color: "#64748b",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  footerButtons: {
    flexDirection: "row",
  },

  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
  },
  confirmButton: {
    backgroundColor: "#2563eb",
  },
  cancelText: {
    fontWeight: "600",
    color: "#0f172a",
  },
  confirmText: {
    fontWeight: "600",
    color: "#fff",
  },
});
