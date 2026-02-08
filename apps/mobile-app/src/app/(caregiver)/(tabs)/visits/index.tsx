import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useQuery } from '@apollo/client/react';
import { GET_CONFIRMED_VISITS } from '@/src/graphql/caregiverQueries';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

/* -------------------------------------------------------------------------- */
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

const COLORS = {
  primary: '#0B5ED7',
  secondary: '#20C997',
  background: '#F4F7FA',
  white: '#FFFFFF',
  textMain: '#1F2933',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  pastBg: '#F1F5F9',
  pastText: '#94A3B8',
};

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                MAIN SCREEN                                 */
/* -------------------------------------------------------------------------- */

export default function VisitsScreen() {
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data, loading } = useQuery(GET_CONFIRMED_VISITS);

  const visits = data?.confirmedVisits ?? [];

  /* -------------------------------------------------------------------------- */
  /*                              DATE FILTERING                                */
  /* -------------------------------------------------------------------------- */

  const filteredVisits = useMemo(() => {
    const now = dayjs();

    if (view === 'daily') {
      return visits
        .filter(v => dayjs(v.startTime).isSame(selectedDate, 'day'))
        .filter(v => dayjs(v.startTime).isAfter(now))
        .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)));
    }

    if (view === 'weekly') {
      return visits
        .filter(v =>
          dayjs(v.startTime).isoWeek() === selectedDate.isoWeek() &&
          dayjs(v.startTime).year() === selectedDate.year()
        )
        .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)));
    }

    // Monthly
    return visits
      .filter(v =>
        dayjs(v.startTime).month() === selectedDate.month() &&
        dayjs(v.startTime).year() === selectedDate.year()
      )
      .sort((a, b) => dayjs(a.startTime).diff(dayjs(b.startTime)));
  }, [visits, view, selectedDate]);

  /* -------------------------------------------------------------------------- */
  /*                                  RENDER                                    */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Visits</Text>
        {view !== 'weekly' && (
          <TouchableOpacity onPress={() => setCalendarOpen(true)}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* View Switcher */}
      <View style={styles.tabs}>
        {['daily', 'weekly', 'monthly'].map(v => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v as any)}
            style={[styles.tab, view === v && styles.tabActive]}
          >
            <Text style={[styles.tabText, view === v && styles.tabTextActive]}>
              {v.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Date Info */}
      <Text style={styles.subtitle}>
        {view === 'daily' && selectedDate.format('dddd, MMM D')}
        {view === 'weekly' && `Week ${selectedDate.isoWeek()} · ${selectedDate.year()}`}
        {view === 'monthly' && selectedDate.format('MMMM YYYY')}
      </Text>

      {/* Visits List */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredVisits.length === 0 && (
          <Text style={styles.empty}>No visits found.</Text>
        )}

        {filteredVisits.map(visit => {
          const isPast = dayjs(visit.endTime).isBefore(dayjs());

          return (
            <View
              key={visit.id}
              style={[
                styles.card,
                isPast && styles.cardPast,
              ]}
            >
              <View>
                <Text style={[styles.patient, isPast && styles.pastText]}>
                  {visit.elder.firstName + ' ' + visit.elder.lastName}

                </Text>

                <Text style={[styles.time, isPast && styles.pastText]}>
                  {visit.elder.address}
                </Text>


                <Text style={[styles.time, isPast && styles.pastText]}>
                  {dayjs(visit.startTime).format('HH:mm')} –{' '}
                  {dayjs(visit.endTime).format('HH:mm')}
                </Text>
              </View>

              {!isPast && (
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingText}>UPCOMING</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Calendar Modal */}
      {calendarOpen && (
        <View style={styles.calendarWrapper}>
          <Calendar
            current={selectedDate.format('YYYY-MM-DD')}
            onDayPress={day => {
              setSelectedDate(dayjs(day.dateString));
              setCalendarOpen(false);
            }}
            markedDates={{
              [selectedDate.format('YYYY-MM-DD')]: {
                selected: true,
                selectedColor: COLORS.primary,
              },
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  subtitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardPast: {
    backgroundColor: COLORS.pastBg,
    borderLeftColor: COLORS.border,
  },
  patient: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  time: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  pastText: {
    color: COLORS.pastText,
  },
  upcomingBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 40,
  },
  calendarWrapper: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 10,
  },
});
