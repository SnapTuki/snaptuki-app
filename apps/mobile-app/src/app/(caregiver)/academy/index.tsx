import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D', // Education/Success Teal
  background: '#F8F9FB',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
};

export default function AcademyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header: Personal Learning Progress */}
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.greeting}>Care Academy</Text>
            <Text style={styles.subGreeting}>Level up your caregiving skills</Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>75%</Text>
            <Text style={styles.progressLabel}>Annual Goal</Text>
          </View>
        </View>

        {/* 2. Mandatory Training (Agency Compliance) */}
        <Text style={styles.sectionTitle}>Mandatory Compliance</Text>
        <ModuleCard 
          title="Dementia Care Protocols"
          duration="45 mins"
          lessons="12 Lessons"
          progress={0.6}
          icon="brain"
          isMandatory
        />
        <ModuleCard 
          title="Infection Control & Safety"
          duration="30 mins"
          lessons="8 Lessons"
          progress={0.2}
          icon="shield-half"
          isMandatory
        />

        {/* 3. Specialized Skills (Electives) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Specialized Skillsets</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <SkillPill title="Diabetes Mgmt" icon="medkit" />
          <SkillPill title="Mobility Assist" icon="walk" />
          <SkillPill title="Hospice Care" icon="heart" />
        </ScrollView>

        {/* 4. Completed Certificates */}
        <Text style={styles.sectionTitle}>Recent Certificates</Text>
        <TouchableOpacity style={styles.certificateItem}>
          <View style={styles.certIcon}>
            <Ionicons name="ribbon" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.certInfo}>
            <Text style={styles.certTitle}>Elder Abuse Prevention</Text>
            <Text style={styles.certDate}>Certified on Jan 15, 2026</Text>
          </View>
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
const ModuleCard = ({ title, duration, lessons, progress, icon, isMandatory }: any) => (
  <TouchableOpacity style={styles.moduleCard}>
    <View style={styles.moduleHeader}>
      <View style={[styles.moduleIcon, { backgroundColor: isMandatory ? '#FFF1F1' : '#F0F7FF' }]}>
        <Ionicons name={icon} size={24} color={isMandatory ? '#FF3B30' : COLORS.primary} />
      </View>
      <View style={styles.moduleMeta}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleSubtitle}>{duration} • {lessons}</Text>
      </View>
    </View>
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
    </View>
  </TouchableOpacity>
);

const SkillPill = ({ title, icon }: any) => (
  <TouchableOpacity style={styles.skillPill}>
    <Ionicons name={icon} size={20} color={COLORS.primary} />
    <Text style={styles.skillPillText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressCircle: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 16 },
  progressPercent: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  progressLabel: { fontSize: 9, color: COLORS.white, textTransform: 'uppercase', marginTop: 2 },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 15, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  moduleCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 15, elevation: 1 },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  moduleIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  moduleMeta: { marginLeft: 15 },
  moduleTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  moduleSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  
  progressWrapper: { marginTop: 5 },
  progressBarBg: { height: 6, backgroundColor: '#F0F2F5', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.secondary },
  progressText: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontWeight: '600' },

  horizontalScroll: { flexDirection: 'row', marginBottom: 20 },
  skillPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 12, 
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border 
  },
  skillPillText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: COLORS.textMain },

  certificateItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 16, 
    borderRadius: 16,
    elevation: 1
  },
  certIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#E6F7F6', justifyContent: 'center', alignItems: 'center' },
  certInfo: { flex: 1, marginLeft: 15 },
  certTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textMain },
  certDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 }
});