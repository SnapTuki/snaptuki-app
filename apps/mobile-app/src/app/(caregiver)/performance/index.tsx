import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F8F9FB',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
  star: '#FFB800',
};

export default function PerformanceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Overall Score Header */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Overall Performance</Text>
          <View style={styles.mainScoreRow}>
            <Text style={styles.mainScoreText}>4.9</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={20} color={COLORS.star} />
              ))}
            </View>
          </View>
          <Text style={styles.percentileText}>Top 5% of Agency Staff</Text>
        </View>

        {/* 2. Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricBox 
            label="Reliability" 
            value="98%" 
            icon="time" 
            sub="On-time arrivals" 
            color={COLORS.primary} 
          />
          <MetricBox 
            label="Completion" 
            value="100%" 
            icon="checkmark-done" 
            sub="Task reports" 
            color={COLORS.secondary} 
          />
        </View>

        {/* 3. Skill Breakdown (Progress Bars) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Feedback Categories</Text>
          
          <ProgressBar label="Communication" progress={0.95} val="4.8/5" />
          <ProgressBar label="Compassion & Care" progress={1.0} val="5.0/5" />
          <ProgressBar label="Clinical Reporting" progress={0.9} val="4.5/5" />
          <ProgressBar label="Punctuality" progress={0.98} val="4.9/5" />
        </View>

        {/* 4. Recent Reviews Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Comments</Text>
          
          <ReviewItem 
            date="Jan 28, 2026" 
            comment="Jane was incredibly patient with my father during his physical therapy exercises. Her notes were very detailed."
          />
          <ReviewItem 
            date="Jan 22, 2026" 
            comment="Very professional and punctual. We felt completely safe leaving our mother in her care."
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Internal Components for Cleanliness
const MetricBox = ({ label, value, icon, sub, color }: any) => (
  <View style={styles.metricBox}>
    <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricSub}>{sub}</Text>
  </View>
);

const ProgressBar = ({ label, progress, val }: any) => (
  <View style={styles.progressRow}>
    <View style={styles.progressLabels}>
      <Text style={styles.progressLabelText}>{label}</Text>
      <Text style={styles.progressValText}>{val}</Text>
    </View>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
    </View>
  </View>
);

const ReviewItem = ({ date, comment }: any) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewDate}>{date}</Text>
    <Text style={styles.reviewComment}>"{comment}"</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  mainScoreRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  mainScoreText: { color: COLORS.white, fontSize: 48, fontWeight: '800', marginRight: 15 },
  starRow: { flexDirection: 'row' },
  percentileText: { color: COLORS.white, fontWeight: '600', fontSize: 14, opacity: 0.9 },
  
  metricsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  metricBox: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border 
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  metricValue: { fontSize: 22, fontWeight: '700', color: COLORS.textMain },
  metricLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, marginTop: 2 },
  metricSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },

  section: { 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 20 },
  
  progressRow: { marginBottom: 18 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabelText: { fontSize: 14, fontWeight: '500', color: COLORS.textMain },
  progressValText: { fontSize: 14, fontWeight: '700', color: COLORS.secondary },
  progressBg: { height: 8, backgroundColor: '#F0F2F5', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 4 },

  reviewCard: { 
    backgroundColor: '#F9FAFB', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.border
  },
  reviewDate: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6 },
  reviewComment: { fontSize: 13, color: COLORS.textMain, fontStyle: 'italic', lineHeight: 18 },
});