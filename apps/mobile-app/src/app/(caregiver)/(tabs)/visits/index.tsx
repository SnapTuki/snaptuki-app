import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F4F7F9',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
  accent: '#FF9500',
};

type ViewType = 'Daily' | 'Weekly' | 'Monthly';

export default function VisitsScreen() {
  const [activeView, setActiveView] = useState<ViewType>('Daily');
  const [selectedDate, setSelectedDate] = useState('2026-02-01');

  // Professional Calendar Marking
  const markedDates = useMemo(() => ({
    '2026-02-02': { marked: true, dotColor: COLORS.primary },
    '2026-02-05': { marked: true, dotColor: COLORS.secondary },
    [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: COLORS.primary }
  }), [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Schedule</Text>
          <Text style={styles.headerDate}>{selectedDate}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="filter-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Segmented Switcher */}
      <View style={styles.switcherContainer}>
        {(['Daily', 'Weekly', 'Monthly'] as ViewType[]).map((view) => (
          <TouchableOpacity
            key={view}
            style={[styles.switcherTab, activeView === view && styles.switcherTabActive]}
            onPress={() => setActiveView(view)}
          >
            <Text style={[styles.switcherText, activeView === view && styles.switcherTextActive]}>
              {view}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Monthly View */}
        {activeView === 'Monthly' && (
          <View style={styles.calendarWrapper}>
            <Calendar
              current={selectedDate}
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={calendarTheme}
            />
          </View>
        )}

        {/* Weekly View */}
        {activeView === 'Weekly' && (
          <View style={styles.weekContainer}>
             <Text style={styles.sectionLabel}>Upcoming this week</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekStrip}>
                {['01','02','03','04','05','06','07'].map((day, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.weekDayPill, selectedDate.endsWith(day) && styles.activeDayPill]}
                    onPress={() => setSelectedDate(`2026-02-${day}`)}
                  >
                    <Text style={[styles.weekDayText, selectedDate.endsWith(day) && styles.activeDayText]}>Feb</Text>
                    <Text style={[styles.weekNumText, selectedDate.endsWith(day) && styles.activeDayText]}>{day}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>
        )}

        {/* Visit List Header */}
        <View style={styles.visitListHeader}>
          <Text style={styles.sectionLabel}>
            {activeView === 'Daily' ? "Today's Schedule" : `Visits for ${selectedDate}`}
          </Text>
        </View>

        <VisitCard 
          name="Robert Jenkins" 
          time="14:00 - 16:00" 
          status="next" 
          address="123 Oak Lane, Maplewood"
        />
        <VisitCard 
          name="Alice Chen" 
          time="17:30 - 19:30" 
          status="scheduled" 
          address="888 Pine St, Apt 4B"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const VisitCard = ({ name, time, status, address }: any) => (
  <View style={styles.card}>
    <View style={styles.cardTimeColumn}>
      <Text style={styles.timeText}>{time.split(' ')[0]}</Text>
      <View style={[styles.statusIndicator, status === 'next' && { backgroundColor: COLORS.secondary }]} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.elderName}>{name}</Text>
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
      </View>
      <TouchableOpacity style={styles.detailButton}>
        <Text style={styles.detailButtonText}>View Details</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

const calendarTheme = {
  backgroundColor: COLORS.white,
  calendarBackground: COLORS.white,
  textSectionTitleColor: COLORS.textMuted,
  selectedDayBackgroundColor: COLORS.primary,
  selectedDayTextColor: COLORS.white,
  todayTextColor: COLORS.secondary,
  dayTextColor: COLORS.textMain,
  textDisabledColor: '#d9e1e8',
  dotColor: COLORS.primary,
  selectedDotColor: COLORS.white,
  arrowColor: COLORS.primary,
  monthTextColor: COLORS.textMain,
  textDayFontWeight: '500' as const,
  textMonthFontWeight: 'bold' as const,
  textDayHeaderFontWeight: '600' as const,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textMain },
  headerDate: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },
  headerIcon: { padding: 8, backgroundColor: '#F0F7FF', borderRadius: 10 },
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9EEF2',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  switcherTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  switcherTabActive: { 
    backgroundColor: COLORS.white, 
    ...Platform.select({ ios: { shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) 
  },
  switcherText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  switcherTextActive: { color: COLORS.primary },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  calendarWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
    shadowOpacity: 0.05,
  },
  weekContainer: {
    marginBottom: 24,
  },
  weekStrip: {
    flexDirection: 'row',
    marginTop: 8,
  },
  weekDayPill: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeDayPill: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  weekDayText: { fontSize: 11, color: COLORS.textMuted },
  weekNumText: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  activeDayText: { color: COLORS.white },
  visitListHeader: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardTimeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    minWidth: 70,
  },
  timeText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border, marginTop: 8 },
  cardContent: { flex: 1, paddingLeft: 16 },
  elderName: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  addressText: { fontSize: 13, color: COLORS.textMuted, marginLeft: 4, flex: 1 },
  detailButton: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  detailButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 13, marginRight: 4 },
});