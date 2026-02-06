import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useQuery } from '@apollo/client/react';
import { GET_CONFIRMED_VISITS } from '@/src/graphql/caregiverQueries';

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


  // Fetch confirmed bookings from backend
  const { data, loading, error, refetch } = useQuery(GET_CONFIRMED_VISITS, {
    fetchPolicy: 'cache-and-network'
  });

  console.log(data)

  // Filter bookings based on the selected date for Daily/Weekly views
  const filteredVisits = useMemo(() => {
    if (!data?.confirmedVisits) return [];
    return data.confirmedVisits.filter((booking: any) => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === selectedDate;
    });
  }, [data, selectedDate]);


  // Mark dates on calendar for Monthly view
  const markedDates = useMemo(() => {
    const marks: any = {};
    data?.confirmedVisits.forEach((booking: any) => {
      const date = new Date(booking.startTime).toISOString().split('T')[0];
      marks[date] = { marked: true, dotColor: COLORS.secondary };
    });
    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: COLORS.primary 
    };
    return marks;
  }, [data, selectedDate]);

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  if(error){
    console.log(error.message)
  }
  const formatDateTime = (
    date: Date | string | null | undefined,
    options: Intl.DateTimeFormatOptions = {}
): string => {
    if (!date) return 'N/A'; // Healthcare UI fallback

    const d = typeof date === 'string' ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return d.toLocaleDateString(undefined, defaultOptions);
};
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Schedule</Text>
          <Text style={styles.headerDate}>{formatDateTime(selectedDate, { month: 'long', day: 'numeric', year: 'numeric', weekday: undefined, hour: undefined, minute: undefined })}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => refetch()}>
          <Ionicons name="refresh" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

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

        <View style={styles.visitListHeader}>
          <Text style={styles.sectionLabel}>
            {activeView === 'Daily' ? "Today's Schedule" : `Visits for ${selectedDate}`}
          </Text>
        </View>

        {filteredVisits.length > 0 ? (
          filteredVisits.map((booking: any) => (
            <VisitCard 
              key={booking.id}
              booking={booking}
              //onPress={() => router.push(`/(caregiver)/requests/${booking.id}`)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No confirmed visits for this date.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const VisitCard = ({ booking, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardTimeColumn}>
      <Text style={styles.timeText}>
        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <View style={[styles.statusIndicator, { backgroundColor: COLORS.secondary }]} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.elderName}>{booking.elder?.firstName} {booking.elder?.lastName}</Text>
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.addressText} numberOfLines={1}>{booking.elder?.address}</Text>
      </View>
      <View style={styles.detailButton}>
        <Text style={styles.detailButtonText}>View Details</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </View>
    </View>
  </TouchableOpacity>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  visitListHeader: { marginBottom: 12, paddingLeft: 4 },
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
  emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 20 },
});