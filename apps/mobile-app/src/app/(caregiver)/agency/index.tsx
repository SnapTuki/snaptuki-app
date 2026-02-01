import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F4F7F9',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
  callout: '#F0F7FF',
};

export default function AgencyScreen() {
  const handleCall = () => Linking.openURL('tel:1234567890');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Agency Identity Card */}
        <View style={styles.agencyCard}>
          <View style={styles.logoCircle}>
            <Ionicons name="business" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.agencyName}>SeniorCare Agency</Text>
          <Text style={styles.agencyBranch}>North Regional Branch • Verified Partner</Text>
          
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Ionicons name="call" size={18} color={COLORS.white} />
              <Text style={styles.contactButtonText}>Call Office</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, styles.secondaryContact]}>
              <Ionicons name="mail" size={18} color={COLORS.primary} />
              <Text style={[styles.contactButtonText, { color: COLORS.primary }]}>Email HR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Direct Supervisor Section */}
        <Text style={styles.sectionTitle}>Direct Supervisor</Text>
        <View style={styles.supervisorCard}>
          <View style={styles.supervisorAvatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>
          <View style={styles.supervisorInfo}>
            <Text style={styles.supervisorName}>Marcus Sterling</Text>
            <Text style={styles.supervisorTitle}>Clinical Care Coordinator</Text>
          </View>
          <TouchableOpacity style={styles.msgIcon}>
            <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* 3. Operational Protocols */}
        <Text style={styles.sectionTitle}>Standard Protocols</Text>
        <ProtocolItem 
          title="Emergency Escalation Path" 
          desc="Step-by-step guide for critical incidents." 
          icon="alert-circle" 
        />
        <ProtocolItem 
          title="Medication Handling" 
          desc="Agency standards for dosage and logging." 
          icon="medkit" 
        />
        <ProtocolItem 
          title="Uniform & Conduct Code" 
          desc="Professional appearance and behavior guidelines." 
          icon="shirt" 
        />

        {/* 4. Important Announcements */}
        <View style={styles.announcementBox}>
          <View style={styles.announcementHeader}>
            <Ionicons name="megaphone" size={20} color={COLORS.secondary} />
            <Text style={styles.announcementTitle}>Latest Update</Text>
          </View>
          <Text style={styles.announcementText}>
            New PPE guidelines have been issued for the month of February. Please review the updated safety kit list in the Academy.
          </Text>
          <Text style={styles.announcementDate}>Posted: 2 hours ago</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const ProtocolItem = ({ title, desc, icon }: any) => (
  <TouchableOpacity style={styles.protocolItem}>
    <View style={styles.protocolIcon}>
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </View>
    <View style={styles.protocolTextContainer}>
      <Text style={styles.protocolTitle}>{title}</Text>
      <Text style={styles.protocolDesc}>{desc}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  agencyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.callout,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  agencyName: { fontSize: 20, fontWeight: '700', color: COLORS.textMain },
  agencyBranch: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  contactRow: { flexDirection: 'row', marginTop: 20, gap: 12 },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryContact: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary },
  contactButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 15, marginTop: 10 },
  
  supervisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  supervisorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  supervisorInfo: { flex: 1, marginLeft: 12 },
  supervisorName: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  supervisorTitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  msgIcon: { padding: 8 },

  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  protocolIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.callout, justifyContent: 'center', alignItems: 'center' },
  protocolTextContainer: { flex: 1, marginLeft: 15 },
  protocolTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textMain },
  protocolDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  announcementBox: {
    backgroundColor: '#FFF8E6',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFECC0',
  },
  announcementHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  announcementTitle: { fontSize: 14, fontWeight: '800', color: '#856404', textTransform: 'uppercase' },
  announcementText: { fontSize: 13, color: '#856404', lineHeight: 20, fontWeight: '500' },
  announcementDate: { fontSize: 11, color: '#A68A3E', marginTop: 10, fontWeight: '600' }
});