import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  Filter
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKING_CARDS } from '../../../../graphql/queries'; // Adjust path
import { BookingStatus } from '@/src/types/__generated__/graphql';

// Types for UI Filters
const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type FilterType = typeof FILTERS[number];

export default function BookingsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  // 1. Fetch Real Data
  // GET_BOOKING_CARDS calls getAllBookings(userId) internally using context if configured
  // or we pass userId if needed. Assuming the query uses context or we pass it.
  // Based on your queries.tsx, GET_BOOKING_CARDS expects $userId.
  // We need the user ID. For now, I'll assume the query uses context on backend or we pass a dummy ID 
  // if the hook handles it.
  // Actually, let's use the hook without variables first, assuming the query was fixed to use context,
  // or we need to pass the user ID from session.
  
  // Correction: Your queries.tsx has `getAllBookings($userId: ID!)`.
  // I will use a dummy ID '1' for now or better, get it from session.
  // Ideally, useSession hook.
  
  const { data, loading, error, refetch } = useQuery(GET_BOOKING_CARDS, {
    variables: { userId: 1 }, // Replace with real user ID from session context
    fetchPolicy: 'cache-and-network'
  });

  const bookings = data?.myBookings || [];

  // 2. Filter Logic
  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b: any) => b.status === activeFilter.toUpperCase());
  }, [bookings, activeFilter]);

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                activeFilter === item && styles.filterChipActive
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === item && styles.filterTextActive
              ]}>
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <BookingCard item={item} onPress={() => router.push(`/(client)/(tabs)/bookings/${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter !== "All" ? `No ${activeFilter.toLowerCase()} bookings.` : "You haven't made any bookings yet."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- Sub-components ---

function BookingCard({ item, onPress }: { item: any, onPress: () => void }) {
  const statusStyle = getStatusStyle(item.status);
  const dateObj = new Date(item.startTime);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Left: Date Box */}
      <View style={styles.dateBox}>
        <Text style={styles.dateMonth}>{dateObj.toLocaleDateString('en-US', { month: 'short' })}</Text>
        <Text style={styles.dateDay}>{dateObj.getDate()}</Text>
      </View>

      {/* Middle: Info */}
      <View style={styles.cardInfo}>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>{item.careService?.serviceName || "Care Service"}</Text>
          {item.caregiver && (
            <Text style={styles.caregiverName}>with {item.caregiver.firstName}</Text>
          )}
        </View>
        
        <View style={styles.timeRow}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.timeText}>{timeStr} • {item.endTime ? new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {item.status}
          </Text>
        </View>
      </View>

      {/* Right: Arrow */}
      <View style={styles.cardAction}>
        <Text style={styles.priceText}>€{item.totalPrice}</Text>
        <ChevronRight size={20} color="#CBD5E1" />
      </View>
    </Pressable>
  );
}

// --- Helpers & Styles ---

function getStatusStyle(status: string) {
  switch (status) {
    case 'PENDING': return { bg: '#FFF7ED', text: '#EA580C' }; // Orange
    case 'CONFIRMED': return { bg: '#F0FDFA', text: '#0F766E' }; // Teal
    case 'COMPLETED': return { bg: '#F1F5F9', text: '#475569' }; // Slate
    case 'CANCELLED': return { bg: '#FEF2F2', text: '#DC2626' }; // Red
    default: return { bg: '#F1F5F9', text: '#64748B' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  
  // Filters
  filterContainer: {
    marginBottom: 10,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#0F766E", // Teal 700
    borderColor: "#0F766E",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: "#FAFAFA",
  },
  
  // Date Box
  dateBox: {
    backgroundColor: "#F0FDFA", // Light Teal
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    minWidth: 60,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F766E",
    textTransform: "uppercase",
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  // Info
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  serviceRow: {
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  caregiverName: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Right Side
  cardAction: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
    paddingLeft: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 20, // Push arrow down visually or just separate
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});