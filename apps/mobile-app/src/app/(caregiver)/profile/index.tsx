import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F4F7F9',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
  verified: '#34C759',
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Profile Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-sharp" size={14} color={COLORS.white} />
            </View>
          </View>
          
          <Text style={styles.userName}>Jane Doe</Text>
          <Text style={styles.userRole}>Certified Nursing Assistant (CNA)</Text>
          
          <View style={styles.agencyTag}>
            <Ionicons name="business" size={14} color={COLORS.primary} />
            <Text style={styles.agencyText}>Affiliated with: SeniorCare Agency</Text>
          </View>
        </View>

        {/* 2. Professional Credentials (Verified Section) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Verified Credentials</Text>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.secondary} />
          </View>
          
          <CredentialItem icon="document-text-outline" label="CNA License" status="Valid" expiry="Exp: Dec 2026" />
          <CredentialItem icon="heart-outline" label="CPR/BLS Certification" status="Valid" expiry="Exp: Jan 2027" />
          <CredentialItem icon="finger-print-outline" label="Background Check" status="Cleared" expiry="Last Check: Oct 2025" />
        </View>

        {/* 3. Care Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>850+</Text>
            <Text style={styles.statLabel}>Care Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>4.9</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>12</Text>
            <Text style={styles.statLabel}>Elders Served</Text>
          </View>
        </View>

        {/* 4. Experience & Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Bio</Text>
          <Text style={styles.bioText}>
            Specialized in post-surgery recovery and dementia care. Over 5 years of experience 
            providing compassionate care in both home and facility settings. Committed to 
            maintaining the dignity and safety of every elder.
          </Text>
        </View>

        {/* 5. Support / Update Action */}
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Request Profile Update from Agency</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          * Credentials and experience are verified by your nursing home agency. 
          Contact your supervisor to correct any inaccuracies.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const CredentialItem = ({ icon, label, status, expiry }: any) => (
  <View style={styles.credItem}>
    <View style={styles.credLeft}>
      <View style={styles.credIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <View>
        <Text style={styles.credLabel}>{label}</Text>
        <Text style={styles.credExpiry}>{expiry}</Text>
      </View>
    </View>
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerCard: {
    backgroundColor: COLORS.white,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: COLORS.primary },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: { fontSize: 24, fontWeight: '700', color: COLORS.textMain },
  userRole: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  agencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  agencyText: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginLeft: 6 },
  section: { backgroundColor: COLORS.white, padding: 20, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  credItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  credLeft: { flexDirection: 'row', alignItems: 'center' },
  credIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  credLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textMain },
  credExpiry: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: '#E6F7F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '800', color: COLORS.secondary },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 12, gap: 12 },
  statBox: { flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 16, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  updateButton: { margin: 20, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center' },
  updateButtonText: { color: COLORS.primary, fontWeight: '700' },
  disclaimer: { textAlign: 'center', paddingHorizontal: 40, fontSize: 11, color: COLORS.textMuted, paddingBottom: 40 },
});