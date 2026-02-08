import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    TextInput,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

/* -------------------------------------------------------------------------- */
/* THEME                                    */
/* -------------------------------------------------------------------------- */

const COLORS = {
    primary: '#005FB8',   // Deep Trust Blue
    secondary: '#00A79D', // Vitality Teal
    background: '#F4F7F9',
    white: '#FFFFFF',
    textMain: '#1A1C1E',
    textMuted: '#6C727A',
    success: '#22C55E',
    warning: '#F59E0B',
    border: '#E1E6EB',
    danger: '#FF3B30',
    info: '#E8F0FE',
};

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                   */
/* -------------------------------------------------------------------------- */

const INITIAL_VISIT = {
    elderName: 'Maria Schmidt',
    room: 'Room 203',
    startTime: dayjs().subtract(18, 'minute'),
    expectedDurationMin: 60,
    tasks: [
        {
            id: 1,
            title: 'Blood Pressure',
            type: 'VITAL_SIGNS',
            required: true,
            status: 'PENDING',
            instructions: 'Measure the elder\'s blood pressure while seated and relaxed. Ensure the arm is at heart level.',
        },
        {
            id: 2,
            title: 'Morning Medication',
            type: 'MEDICATION',
            required: true,
            status: 'COMPLETED',
            instructions: 'Administer 2x Metformin (500mg) and 1x Aspirin. Check for swallowing difficulties.',
        },
        {
            id: 3,
            title: 'Assisted Bathing',
            type: 'HYGIENE',
            required: false,
            status: 'PENDING',
            instructions: 'Assist with warm shower. Pay attention to skin integrity on the back and heels.',
        },
    ],
};

/* -------------------------------------------------------------------------- */
/* TASK MODAL CONTENT COMPONENT                        */
/* -------------------------------------------------------------------------- */

const TaskContent = ({ task, onComplete, onCancel }: any) => {
    const [notes, setNotes] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');

    const renderSpecificInputs = () => {
        switch (task.type) {
            case 'VITAL_SIGNS':
                return (
                    <View style={taskStyles.inputRow}>
                        <View style={taskStyles.inputBox}>
                            <Text style={taskStyles.inputLabel}>Systolic (mmHg)</Text>
                            <TextInput
                                style={taskStyles.textInput}
                                placeholder="120"
                                keyboardType="numeric"
                                value={systolic}
                                onChangeText={setSystolic}
                            />
                        </View>
                        <View style={taskStyles.inputBox}>
                            <Text style={taskStyles.inputLabel}>Diastolic (mmHg)</Text>
                            <TextInput
                                style={taskStyles.textInput}
                                placeholder="80"
                                keyboardType="numeric"
                                value={diastolic}
                                onChangeText={setDiastolic}
                            />
                        </View>
                    </View>
                );
            case 'MEDICATION':
                return (
                    <View style={taskStyles.checklist}>
                        <View style={taskStyles.checkItem}>
                            <Ionicons name="checkbox" size={20} color={COLORS.secondary} />
                            <Text style={taskStyles.checkText}>Metformin 500mg (Confirmed)</Text>
                        </View>
                        <View style={taskStyles.checkItem}>
                            <Ionicons name="checkbox" size={20} color={COLORS.secondary} />
                            <Text style={taskStyles.checkText}>Aspirin 81mg (Confirmed)</Text>
                        </View>
                    </View>
                );
            default:
                return <Text style={taskStyles.text}>Standard care procedure applies.</Text>;
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={taskStyles.content}>
                <View style={taskStyles.header}>
                    <View style={taskStyles.titleRow}>
                        <Text style={taskStyles.taskTitle}>{task.title}</Text>
                        <TouchableOpacity onPress={onCancel}>
                            <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    </View>
                    <View style={taskStyles.badgeRow}>
                        <View style={[styles.timerWrapper, { backgroundColor: task.required ? '#FFF4E5' : '#E8F0FE' }]}>
                            <Text style={[styles.timer, { color: task.required ? COLORS.warning : COLORS.primary }]}>
                                {task.required ? 'Mandatory Task' : 'Optional Care'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={taskStyles.card}>
                    <Text style={taskStyles.label}>Clinical Instructions</Text>
                    <Text style={taskStyles.text}>{task.instructions}</Text>
                </View>

                <View style={taskStyles.card}>
                    <Text style={taskStyles.label}>Log Values / Actions</Text>
                    {renderSpecificInputs()}
                </View>

                <View style={taskStyles.card}>
                    <Text style={taskStyles.label}>Caregiver Observations</Text>
                    <TextInput
                        style={taskStyles.notesInput}
                        placeholder="Record any skin changes, mood shifts, or concerns..."
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>

                <View style={taskStyles.actions}>
                    <TouchableOpacity style={taskStyles.completeButton} onPress={onComplete}>
                        <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
                        <Text style={taskStyles.completeText}>Log Task as Completed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={taskStyles.skipButton} onPress={onCancel}>
                        <Text style={taskStyles.skipText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

/* -------------------------------------------------------------------------- */
/* MAIN VISIT SCREEN COMPONENT                         */
/* -------------------------------------------------------------------------- */

export default function VisitInProgressScreen() {
    const [visit, setVisit] = useState(INITIAL_VISIT);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [elapsedMin, setElapsedMin] = useState(dayjs().diff(INITIAL_VISIT.startTime, 'minute'));
    const [modalVisible, setModalVisible] = useState<{ type: string | null, visible: boolean }>({
        type: null,
        visible: false
    });

    const openTool = (type: string) => setModalVisible({ type, visible: true });

    // Update timer every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedMin(dayjs().diff(visit.startTime, 'minute'));
        }, 60000);
        return () => clearInterval(interval);
    }, [visit.startTime]);

    const handleCompleteTask = (taskId: number) => {
        const updatedTasks = visit.tasks.map(t =>
            t.id === taskId ? { ...t, status: 'COMPLETED' } : t
        );
        setVisit({ ...visit, tasks: updatedTasks });
        setSelectedTask(null);
    };

    const progress = (visit.tasks.filter(t => t.status === 'COMPLETED').length / visit.tasks.length) * 100;

    return (
        <SafeAreaView style={styles.container}>
            {/* Sticky Top Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.elder}>{visit.elderName}</Text>
                    <Text style={styles.room}>{visit.room} • Session Active</Text>
                </View>
                <View style={styles.timerWrapper}>
                    <Ionicons name="pulse" size={18} color={COLORS.primary} />
                    <Text style={styles.timer}>{elapsedMin}m Elapsed</Text>
                </View>
            </View>

            {/* Modern Slim Progress Bar */}
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />

               
            </View>
             {/* 2. Quick Actions Toolbar */}
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolButton} onPress={() => openTool('Family')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E5F1FF' }]}>
                            <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.primary} />
                        </View>
                        <Text style={styles.toolLabel}>Family</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.toolButton} onPress={() => openTool('Supervisor')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F0F2F5' }]}>
                            <Ionicons name="business" size={22} color="#495057" />
                        </View>
                        <Text style={styles.toolLabel}>Supervisor</Text>
                    </TouchableOpacity>

                </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Required Care Plan</Text>
                    <Text style={styles.completionText}>{Math.round(progress)}% Done</Text>
                </View>

                {visit.tasks.map(task => (
                    <TouchableOpacity
                        key={task.id}
                        style={[styles.taskCard, task.status === 'COMPLETED' && styles.taskCardDone]}
                        onPress={() => setSelectedTask(task)}
                    >
                        <View style={styles.taskLeft}>
                            <View style={[
                                styles.statusIcon,
                                { backgroundColor: task.status === 'COMPLETED' ? COLORS.secondary : '#F0F2F5' }
                            ]}>
                                <Ionicons
                                    name={task.status === 'COMPLETED' ? 'checkmark' : 'medical'}
                                    size={16}
                                    color={task.status === 'COMPLETED' ? '#FFF' : COLORS.textMuted}
                                />
                            </View>
                            <View style={styles.taskTextWrapper}>
                                <Text style={[styles.taskTitle, task.status === 'COMPLETED' && styles.textStrikethrough]}>
                                    {task.title}
                                </Text>
                                <Text style={styles.optional}>
                                    {task.required ? 'High Priority' : 'Standard Routine'}
                                </Text>
                            </View>
                        </View>

                        <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
                    </TouchableOpacity>
                ))}

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                        Tapping a task allows you to record clinical values and caregiver notes for the family.
                    </Text>
                </View>
            </ScrollView>

            {/* End Visit Button Container */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.endButton}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.endText}>Finalize & Sync Visit</Text>
                </TouchableOpacity>
            </View>

            {/* TASK DETAIL MODAL */}
            <Modal
                visible={!!selectedTask}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                    {selectedTask && (
                        <TaskContent
                            task={selectedTask}
                            onComplete={() => handleCompleteTask(selectedTask.id)}
                            onCancel={() => setSelectedTask(null)}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                   */
/* -------------------------------------------------------------------------- */

const taskStyles = StyleSheet.create({
    content: { padding: 24, paddingBottom: 60 },
    header: { marginBottom: 24 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    taskTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textMain, flex: 1, marginRight: 10 },
    badgeRow: { marginTop: 12, flexDirection: 'row' },
    card: { backgroundColor: '#F8F9FB', borderRadius: 16, padding: 20, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
    label: { fontSize: 13, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
    text: { fontSize: 15, color: COLORS.textMain, lineHeight: 22 },
    inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    inputBox: { width: '48%' },
    inputLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },
    textInput: { backgroundColor: COLORS.white, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: COLORS.border, fontSize: 16, fontWeight: '600' },
    notesInput: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
    checklist: { gap: 10 },
    checkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    checkText: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
    actions: { marginTop: 20 },
    completeButton: { backgroundColor: COLORS.secondary, paddingVertical: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    completeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    skipButton: { marginTop: 15, alignItems: 'center', padding: 10 },
    skipText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: 20, backgroundColor: COLORS.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: COLORS.border },
    elder: { fontSize: 20, fontWeight: '800', color: COLORS.textMain },
    room: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    timerWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.info, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    timer: { marginLeft: 6, fontSize: 13, fontWeight: '700', color: COLORS.primary },
    progressBarBackground: { height: 4, backgroundColor: COLORS.border },
    progressBarFill: { height: 4, backgroundColor: COLORS.secondary },
    content: { padding: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
    completionText: { fontSize: 12, fontWeight: '700', color: COLORS.secondary },
    taskCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 2 } }) },
    taskCardDone: { opacity: 0.7, backgroundColor: '#F8F9FB' },
    taskLeft: { flexDirection: 'row', alignItems: 'center' },
    statusIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    taskTextWrapper: { marginLeft: 16 },
    taskTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
    textStrikethrough: { textDecorationLine: 'line-through', color: COLORS.textMuted },
    optional: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#FFF9E6', padding: 15, borderRadius: 12, marginTop: 10 },
    infoText: { flex: 1, fontSize: 12, color: '#946C00', lineHeight: 18 },
    footer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 10 : 20, borderTopWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
    endButton: { backgroundColor: COLORS.danger, borderRadius: 16, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    endText: { color: '#fff', fontSize: 16, fontWeight: '800', marginLeft: 10 },

    toolbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        justifyContent: 'space-around',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    toolButton: { alignItems: 'center', width: 80 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    toolLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMain },
});