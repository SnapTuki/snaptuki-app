import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BOOKING_DETAILS } from "@/src/graphql/queries"; // Ensure path is correct
import { CANCEL_BOOKING } from "@/src/graphql/mutations";
// Format Helpers
const formatDate = (date: string | Date) => {
  if (!date) return "";
  // Ensure we have a Date object
  const d = new Date(date);
  
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (start: string | Date, end: string | Date) => {
  if (!start || !end) return "";
  // Ensure we have Date objects
  const s = new Date(start);
  const e = new Date(end);

  // Using [] uses the device's default locale (12h vs 24h)
  return `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default function BookingDetailsScreen() {
  const { bookingId } = useLocalSearchParams();
  const parsedId = parseInt(Array.isArray(bookingId) ? bookingId[0] : bookingId, 10);

  // --- Data Fetching ---
  const { data, loading, error } = useQuery(GET_BOOKING_DETAILS, {
    variables: { bookingId: parsedId },
    skip: !parsedId,
    fetchPolicy: "cache-and-network"
  });

  // --- Mutation Setup ---
  const [cancelBooking, { loading: cancelling }] = useMutation(CANCEL_BOOKING, {
    refetchQueries: [{ query: GET_BOOKING_DETAILS, variables: { bookingId: parsedId } }],
    onCompleted: () => Alert.alert("Cancelled", "The booking has been successfully cancelled."),
    onError: (err: any) => Alert.alert("Error", err.message || "Failed to cancel booking.")
  });
  const booking = data?.getBooking;

  // --- Derived State ---
  const statusConfig = useMemo(() => {
    if (!booking) return STATUS_STYLES.PENDING;
    return STATUS_STYLES[booking.status as BookingStatus] || STATUS_STYLES.PENDING;
  }, [booking]);

  const tasks = booking?.careTaskBook?.tasks || [];
  const mandatoryCount = tasks.filter((t: any) => t.isMandatory).length;

// --- Cancellation Logic ---
  const canCancel = useMemo(() => {
    if (!booking) return false;
    
    // 1. If already cancelled or completed, cannot cancel
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') return false;

    // 2. If PENDING (not accepted yet), can always cancel
    if (booking.status === 'PENDING') return true;

    // 3. If CONFIRMED (Accepted), check time window
    if (booking.status === 'CONFIRMED') {
        const startTime = new Date(booking.startTime).getTime();
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000;
        
        // Allowed if start time is more than 1 hour away
        return (startTime - now) > oneHour;
    }

    return false;
  }, [booking]);
  
  const handleCancel = () => {
    Alert.alert(
        "Cancel Booking",
        "Are you sure you want to cancel this booking? This action cannot be undone.",
        [
            { text: "No", style: "cancel" },
            { 
                text: "Yes, Cancel", 
                style: "destructive", 
                onPress: () => cancelBooking({ variables: { bookingId: parsedId } }) 
            }
        ]
    );
  };
  // --- Loading / Error States ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0d9488" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (error || !booking) {
    console.log(error)
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Could not load booking.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* 1. Status Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {booking.status}
            </Text>
          </View>
          <Text style={styles.bookingId}>ID: #{booking.id}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>€{booking.totalPrice}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dateTimeRow}>
            <Ionicons name="calendar-outline" size={20} color="#0f766e" />
            <View>
                <Text style={styles.dateText}>{formatDate(booking.startTime)}</Text>
                <Text style={styles.timeText}>{formatTime(booking.startTime, booking.endTime)}</Text>
            </View>
        </View>
      </View>

      {/* 2. People Involved */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>People Involved</Text>
      </View>

      <View style={styles.card}>
        {/* Caregiver */}
        <View style={styles.personRow}>
            <Image 
                source={{ uri: booking.caregiver?.profilePhotoUrl || "https://via.placeholder.com/100" }} 
                style={styles.avatar} 
            />
            <View style={styles.personInfo}>
                <Text style={styles.personLabel}>Caregiver</Text>
                <Text style={styles.personName}>
                    {booking.caregiver?.firstName} {booking.caregiver?.lastName}
                </Text>
            </View>
             <Pressable style={styles.iconBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0f766e" />
             </Pressable>
        </View>
        
        <View style={styles.divider} />

        {/* Elder */}
        <View style={styles.personRow}>
            <View style={[styles.avatar, styles.elderAvatarPlaceholder]}>
                <Text style={styles.elderInitials}>
                    {booking.elder?.firstName?.[0]}{booking.elder?.lastName?.[0]}
                </Text>
            </View>
            <View style={styles.personInfo}>
                <Text style={styles.personLabel}>Recipient (Elder)</Text>
                <Text style={styles.personName}>
                    {booking.elder?.firstName} {booking.elder?.lastName}
                </Text>
                <Text style={styles.addressText} numberOfLines={1}>
                    {booking.elder?.address || "No address provided"}
                </Text>
            </View>
        </View>
      </View>

      {/* 3. Care Plan / Tasks */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Care Plan</Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{tasks.length} Tasks</Text>
        </View>
      </View>

      <View style={styles.card}>
        {tasks.length > 0 ? (
            tasks.map((task: any, index: number) => (
                <View key={task.id} style={[
                    styles.taskRow, 
                    index !== tasks.length - 1 && styles.taskBorder
                ]}>
                    <MaterialIcons 
                        name={task.isMandatory ? "assignment-late" : "assignment"} 
                        size={20} 
                        color={task.isMandatory ? "#e11d48" : "#64748b"} 
                    />
                    <View style={styles.taskContent}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.isMandatory && <Text style={styles.mandatoryText}>Mandatory</Text>}
                    </View>
                    <View style={[styles.statusDot, task.status === 'DONE' && styles.statusDotDone]} />
                </View>
            ))
        ) : (
            <Text style={styles.emptyText}>No specific tasks listed.</Text>
        )}
      </View>

      {/* 4. Notes */}
      {booking.notes && (
        <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.card}>
                <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
        </>
      )}

      {/* 5. Actions */}
      <View style={styles.actions}>
        {/* ✅ Updated Cancel Button */}
        {canCancel && (
             <Pressable 
                style={[styles.actionBtn, styles.dangerBtn, cancelling && { opacity: 0.5 }]} 
                onPress={handleCancel}
                disabled={cancelling}
             >
                {cancelling ? (
                    <ActivityIndicator size="small" color="#b91c1c" />
                ) : (
                    <Feather name="x-circle" size={18} color="#b91c1c" />
                )}
                <Text style={styles.dangerBtnText}>
                    {cancelling ? "Cancelling..." : "Cancel Booking"}
                </Text>
            </Pressable>
        )}
       
        {/* ... (Keep Report Issue button) ... */}
       
        <Pressable style={[styles.actionBtn, styles.secondaryBtn]}>
          <Feather name="help-circle" size={18} color="#0f766e" />
          <Text style={styles.secondaryBtnText}>Report Issue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// --- CONFIG & STYLES ---

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

const STATUS_STYLES: Record<BookingStatus, { bg: string; text: string }> = {
  PENDING: { bg: "#fff7ed", text: "#c2410c" }, // Orange
  CONFIRMED: { bg: "#f0fdf4", text: "#15803d" }, // Green
  COMPLETED: { bg: "#f1f5f9", text: "#334155" }, // Gray
  CANCELLED: { bg: "#fef2f2", text: "#b91c1c" }, // Red
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDFA", // Light Teal Background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
  },
  loadingText: {
    marginTop: 12,
    color: "#0f766e",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 12,
    color: "#b91c1c",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  backBtnText: {
    color: "#334155",
  },

  // Header Card
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  priceRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#134e4a",
  },
  timeText: {
    fontSize: 13,
    color: "#0f766e",
    marginTop: 2,
  },

  // General Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  
  // Section Titles
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  badge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '600',
  },

  // People Section
  personRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    marginRight: 14,
  },
  elderAvatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
  },
  elderInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  personInfo: {
    flex: 1,
  },
  personLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  personName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  addressText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "#F0FDFA",
    borderRadius: 20,
  },

  // Tasks
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  taskBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  mandatoryText: {
    fontSize: 11,
    color: "#e11d48",
    marginTop: 2,
    fontWeight: "600",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#cbd5e1",
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusDotDone: {
    backgroundColor: "#10b981",
  },
  emptyText: {
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
  },

  // Notes
  notesText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },

  // Actions
  actions: {
    gap: 12,
    marginBottom: 120,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  dangerBtn: {
    backgroundColor: "#fee2e2",
  },
  dangerBtnText: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryBtnText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 15,
  },
});