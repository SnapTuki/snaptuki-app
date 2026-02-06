import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, ActivityIndicator, Platform, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BOOKING_DETAILS } from '@/src/graphql/queries';
import { ACCEPT_BOOKING, CANCEL_BOOKING } from '@/src/graphql/mutations';

const COLORS = {
    primary: '#005FB8',
    secondary: '#00A79D',
    background: '#F4F7F9',
    white: '#FFFFFF',
    textMain: '#1A1C1E',
    textMuted: '#6C727A',
    border: '#E1E6EB',
    danger: '#FF3B30',
    info: '#E5F1FF',
};


export const formatDateTime = (
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

/**
 * Safely calculates age.
 * Returns 'N/A' or a specific string if birthDate is missing.
 */
export const calculateAge = (birthDate: Date | string | null | undefined): string | number => {
    if (!birthDate) return 'N/A';

    const today = new Date();
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

/**
 * Safely calculates duration in hours between two points in time.
 * Handles 'Maybe' types from GraphQL and returns a professional fallback.
 */
export const getVisitDuration = (
    start: Date | string | null | undefined,
    end: Date | string | null | undefined
): string => {
    if (!start || !end) return 'N/A';

    const startTime = typeof start === 'string' ? new Date(start).getTime() : start.getTime();
    const endTime = typeof end === 'string' ? new Date(end).getTime() : end.getTime();

    // Basic validation to ensure end is after start
    if (endTime <= startTime) return '0.0 hrs';

    const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
    return `${diffInHours.toFixed(1)} hrs`;
};


export default function RequestDetailsScreen() {
    const { requestId } = useLocalSearchParams();
    const router = useRouter();
    const { data, loading, error } = useQuery(GET_BOOKING_DETAILS, {
        variables: { bookingId: parseInt(requestId as string) }
    });

    const [acceptBooking, { loading: isAccepting }] = useMutation(ACCEPT_BOOKING, {
        variables: { bookingId: parseInt(requestId as string) },
        onCompleted: () => {
            Alert.alert("Success", "Booking has been confirmed.");
            router.replace('/(caregiver)/(tabs)/requests'); // Return to list
        },
        onError: (err) => {
            Alert.alert("Error", err.message);
        }
    });


    const [declineBooking, { loading: isDeclining }] = useMutation(CANCEL_BOOKING, {
    variables: { bookingId: parseInt(requestId as string) },
    onCompleted: () => {
      Alert.alert("Declined", "The request has been removed.");
      router.replace('/(caregiver)/(tabs)/requests');
    },
    onError: (err) => Alert.alert("Error", err.message)
  });

    if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

    const booking = data?.getBooking;


    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Fixed Action Header */}
            <View style={styles.fixedHeader}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.declineBtn]} 
                    onPress={() => {
              Alert.alert(
                "Decline Request",
                "Are you sure you want to decline this care request?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Decline", style: "destructive", onPress: () => declineBooking() }
                ]
              );
            }}
            disabled={isDeclining && isAccepting}
                    
                    >
                        <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => acceptBooking()}
                    >
                        <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 2. Patient & Health Profile Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Patient Information</Text>
                    <View style={styles.patientRow}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{booking?.elder.firstName[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.patientName}>{booking?.elder.firstName} {booking?.elder.lastName}</Text>
                            <Text style={styles.patientSub}>
                                Requested by {booking?.elder?.firstName || "Family"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.healthGrid}>
                        <View style={styles.healthTag}>
                            <Text style={styles.tagLabel}>Age</Text>
                            <Text style={styles.tagValue}>{calculateAge(booking?.elder.dateOfBirth)} yrs</Text>
                        </View>
                        <View style={styles.healthTag}>
                            <Text style={styles.tagLabel}>Mobility</Text>
                            <Text style={styles.tagValue}>{booking?.elder.mobilityLevel || 'Standard'}</Text>
                        </View>
                    </View>
                </View>

                {/* Visit Logistics Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visit Details</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                        <View style={styles.infoTextGroup}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>
                                {formatDateTime(booking?.startTime, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                        <View style={styles.infoTextGroup}>
                            <Text style={styles.infoLabel}>Time & Duration</Text>
                            <Text style={styles.infoValue}>
                                {formatDateTime(booking?.startTime, { hour: '2-digit', minute: '2-digit', weekday: undefined, month: undefined, day: undefined })}
                                {" - "}
                                {formatDateTime(booking?.endTime, { hour: '2-digit', minute: '2-digit', weekday: undefined, month: undefined, day: undefined })}
                                <Text style={styles.durationText}> ({getVisitDuration(booking?.startTime, booking?.endTime)})</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                        <View style={styles.infoTextGroup}>
                            <Text style={styles.infoLabel}>Address</Text>
                            <Text style={styles.infoValue}>{booking?.elder.address || 'Address not provided'}</Text>
                        </View>
                    </View>
                </View>

                {/* 4. Care Plan & Tasks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Care Plan</Text>
                    {booking?.careTaskBook?.tasks.map((task: any) => (
                        <View key={task.id} style={styles.taskItem}>
                            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.secondary} />
                            <Text style={styles.taskText}>{task.title}</Text>
                            {task.isMandatory && (
                                <View style={styles.mandatoryBadge}>
                                    <Text style={styles.mText}>Required</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* 5. Clinical Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Medical & Behavioral Notes</Text>
                    <View style={styles.notesBox}>
                        <Text style={styles.notesText}>
                            {booking?.elder.medicalNotes || "No specific clinical notes provided."}
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fixedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        zIndex: 10,
    },
    backBtn: { padding: 8, marginRight: 8 },
    headerActions: { flexDirection: 'row', gap: 10 },
    actionBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, minWidth: 90, alignItems: 'center' },
    acceptBtn: { backgroundColor: COLORS.secondary },
    declineBtn: { backgroundColor: '#FFF1F1' },
    acceptText: { color: COLORS.white, fontWeight: '700' },
    declineText: { color: COLORS.danger, fontWeight: '700' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    section: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5 },
    patientRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.info, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: COLORS.primary, fontSize: 24, fontWeight: '700' },
    patientName: { fontSize: 20, fontWeight: '700', color: COLORS.textMain },
    patientSub: { fontSize: 13, color: COLORS.textMuted },
    healthGrid: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 16 },
    healthTag: { flex: 1, backgroundColor: '#F8F9FB', padding: 10, borderRadius: 12, alignItems: 'center' },
    tagLabel: { fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 2 },
    tagValue: { fontSize: 14, fontWeight: '700', color: COLORS.textMain },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
    infoTextGroup: { flex: 1 },
    infoLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
    infoValue: { fontSize: 15, color: COLORS.textMain, fontWeight: '500' },
    taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
    taskText: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textMain },
    mandatoryBadge: { backgroundColor: '#FFF8E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    mText: { fontSize: 10, fontWeight: '800', color: '#B7791F' },
    notesBox: { backgroundColor: '#F8F9FB', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: COLORS.secondary },
    notesText: { fontSize: 14, color: COLORS.textMain, lineHeight: 22, fontStyle: 'italic' },
    durationText: {
        color: COLORS.secondary, // Uses Vitality Teal for the duration
        fontWeight: '600',
        fontSize: 14,
    },
});