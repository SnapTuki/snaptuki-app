import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/client/react';
import { GET_PENDING_BOOKINGS } from '@/src/graphql/caregiverQueries';

const COLORS = {
  primary: '#005FB8',   // Deep Trust Blue
  secondary: '#00A79D', // Vitality Teal
  background: '#F4F7F9',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
  accent: '#FF9500',
  danger: '#f05806'
};

export default function RequestsScreen() {
  const { data, loading, error, refetch } = useQuery(GET_PENDING_BOOKINGS);

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
  console.log(error);
  if (error) return <View style={styles.center}><Text>Error loading requests</Text></View>;

  const renderRequest = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.serviceTitle}>{item.careTaskBook?.tasks[0]?.title || 'General Care'}</Text>
          <Text style={styles.elderName}>For: {item.elder.firstName} {item.elder.lastName}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.totalPrice}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
        <Text style={styles.detailText}>{new Date(item.startTime).toLocaleDateString()}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color={COLORS.primary} />
        <Text style={styles.detailText}>
          {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
          {new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color={COLORS.primary} />
        <Text style={styles.detailText} numberOfLines={1}>{item.elder.address}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.button, styles.declineBtn]}>
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.acceptBtn]}>
          <Text style={styles.acceptText}>Accept Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>New Requests</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={data?.pendingBookings}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No pending requests at this time.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  topHeader: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 20, 
    backgroundColor: COLORS.white, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.textMain },
  subtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  refreshCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F7FF', justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 100 },
  card: { 
    backgroundColor: COLORS.white, 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.06, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerInfo: { flex: 1, marginRight: 10 },
  serviceTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  elderName: { fontSize: 14, color: COLORS.textMuted, marginTop: 4, fontWeight: '500' },
  priceBadge: { backgroundColor: '#E5F1FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  priceText: { color: COLORS.primary, fontWeight: '800', fontSize: 16 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailText: { marginLeft: 10, fontSize: 14, color: '#4A5568', fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  button: { flex: 1, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  acceptBtn: { backgroundColor: COLORS.secondary },
  acceptText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  declineBtn: { backgroundColor: '#FFF1F1' },
  declineText: { color: COLORS.danger, fontWeight: '700', fontSize: 15 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', marginTop: 15, color: COLORS.textMuted, fontSize: 16, paddingHorizontal: 40 },
  errorText: { marginTop: 10, color: COLORS.textMuted, fontSize: 16 },
  retryBtn: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.primary, borderRadius: 8 },
  retryText: { color: COLORS.white, fontWeight: '600' }
});