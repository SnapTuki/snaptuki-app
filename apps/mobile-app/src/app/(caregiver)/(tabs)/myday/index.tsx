import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useNavigation, useRouter } from 'expo-router';

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

const mockVisits = [
  {
    id: 1,
    time: '08:00 – 09:00',
    elder: 'Maria Schmidt',
    room: 'Room 203',
    tasksCompleted: 2,
    tasksTotal: 3,
    status: 'UPCOMING',
  },
  {
    id: 2,
    time: '10:00 – 11:00',
    elder: 'John Keller',
    room: 'Room 105',
    tasksCompleted: 1,
    tasksTotal: 1,
    status: 'COMPLETED',
  },
  {
    id: 3,
    time: '14:00 – 15:00',
    elder: 'Anna Weber',
    room: 'Room 310',
    tasksCompleted: 0,
    tasksTotal: 2,
    status: 'UPCOMING',
  },
];

/* -------------------------------------------------------------------------- */
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

const COLORS = {
  primary: '#0B5ED7',
  secondary: '#20C997',
  background: '#F4F7FA',
  card: '#FFFFFF',
  textMain: '#1F2933',
  textMuted: '#6B7280',
  success: '#22C55E',
  border: '#E5E7EB',
};

/* -------------------------------------------------------------------------- */
/*                                TODAY SCREEN                                */
/* -------------------------------------------------------------------------- */

export default function TodayScreen() {
  const router = useRouter()
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.date}>{dayjs().format('dddd, MMMM D')}</Text>
        <Text style={styles.greeting}>Good morning</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
          <Text style={styles.summaryValue}>3</Text>
          <Text style={styles.summaryLabel}>Visits</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="checkmark-done-outline" size={22} color={COLORS.secondary} />
          <Text style={styles.summaryValue}>3 / 6</Text>
          <Text style={styles.summaryLabel}>Tasks</Text>
        </View>
      </View>

      {/* Visits Section */}
      <Text style={styles.sectionTitle}>Today's Visits</Text>

      {mockVisits.map(visit => {
        const progress = `${visit.tasksCompleted}/${visit.tasksTotal}`;
        const isCompleted = visit.status === 'COMPLETED';

        return (
          <TouchableOpacity key={visit.id} style={styles.visitCard} onPress={() => router.push(`/(caregiver)/(tabs)/myday/${visit.id}`)}>
            <View style={styles.visitHeader}>
              <Text style={styles.visitTime}>{visit.time}</Text>
              {isCompleted && (
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              )}
            </View>

            <Text style={styles.elderName}>{visit.elder}</Text>
            <Text style={styles.room}>{visit.room}</Text>

            <View style={styles.visitFooter}>
              <Text style={styles.tasks}>{progress} tasks completed</Text>
              {!isCompleted && (
                <View style={styles.startButton}>
                  <Text style={styles.startText}>Start Visit</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 4,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
    color: COLORS.textMain,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  visitCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  visitTime: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  elderName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  room: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  visitFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tasks: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  startText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});