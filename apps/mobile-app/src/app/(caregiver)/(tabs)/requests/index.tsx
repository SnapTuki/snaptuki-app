import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data reflecting the SnapTuki Elder-care platform needs
const REQUESTS_DATA = [
  {
    id: '1',
    familyMember: 'Sarah Jenkins',
    elderName: 'Robert Jenkins',
    service: 'Post-Surgery Assistance',
    time: 'Today, 2:00 PM - 6:00 PM',
    rate: '$25/hr',
    location: '0.5 miles away',
    status: 'new',
  },
  {
    id: '2',
    familyMember: 'Michael Chen',
    elderName: 'Alice Chen',
    service: 'Daily Companion & Meal Prep',
    time: 'Tomorrow, 9:00 AM - 1:00 PM',
    rate: '$22/hr',
    location: '1.2 miles away',
    status: 'pending',
  },
];

export default function RequestsScreen() {
  const renderRequestItem = ({ item }: { item: typeof REQUESTS_DATA[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.serviceText}>{item.service}</Text>
          <Text style={styles.elderName}>For: {item.elderName}</Text>
        </View>
        {item.status === 'new' && <View style={styles.badge}><Text style={styles.badgeText}>NEW</Text></View>}
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.time}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.rateText}>{item.rate}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.declineButton]}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.acceptButton]}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Requests</Text>
        <Text style={styles.headerSubtitle}>Manage your incoming elder-care opportunities</Text>
      </View>

      <FlatList
        data={REQUESTS_DATA}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C727A',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for floating tab bar
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Soft shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  elderName: {
    fontSize: 14,
    color: '#6C727A',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  rateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: '#FFF1F1',
  },
  declineButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});