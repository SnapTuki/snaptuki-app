import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Modal,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F8F9FB',
  white: '#FFFFFF',
  border: '#E1E6EB',
  danger: '#FF3B30',
  success: '#34C759',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
};

export default function ActiveCareScreen() {
  const [modalVisible, setModalVisible] = useState<{type: string | null, visible: boolean}>({
    type: null,
    visible: false
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning Medication administered', completed: false },
    { id: 2, title: 'Assistance with light stretching', completed: false },
    { id: 3, title: 'Prepare high-protein lunch', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const openTool = (type: string) => setModalVisible({ type, visible: true });

  return (
    <View style={styles.container}>
      {/* 1. Status & Timer Header */}
      <View style={styles.header}>
        <View style={styles.statusIndicator}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>Live Session: Robert J.</Text>
        </View>
        <Text style={styles.timerText}>01:24:15</Text>
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

        <TouchableOpacity style={styles.toolButton} onPress={() => openTool('CareGuide')}>
          <View style={[styles.iconCircle, { backgroundColor: '#E6F7F6' }]}>
            <Ionicons name="book" size={22} color={COLORS.secondary} />
          </View>
          <Text style={styles.toolLabel}>Care Guide</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 3. Tasks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Services</Text>
          {tasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskItem} onPress={() => toggleTask(task.id)}>
              <Ionicons 
                name={task.completed ? "checkbox" : "square-outline"} 
                size={24} 
                color={task.completed ? COLORS.success : COLORS.border} 
              />
              <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Vitals Reporting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals & Notes</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Blood Pressure</Text>
              <TextInput style={styles.input} placeholder="120/80" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pulse (BPM)</Text>
              <TextInput style={styles.input} placeholder="72" />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => Alert.alert("End Visit", "Submit all logs and notify family?")}
        >
          <Text style={styles.submitButtonText}>Complete & Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tool Modal Placeholder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible.visible}
        onRequestClose={() => setModalVisible({ type: null, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalVisible.type} Support</Text>
              <TouchableOpacity onPress={() => setModalVisible({ type: null, visible: false })}>
                <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.placeholderText}>
                Loading {modalVisible.type} details for Robert Jenkins...
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: { flexDirection: 'row', alignItems: 'center' },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#62F58F', marginRight: 8 },
  statusText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  timerText: { color: COLORS.white, fontWeight: '700', fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  
  // Toolbar Styles
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

  scrollContent: { padding: 20, paddingBottom: 100 },
  section: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 20, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginBottom: 15 },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  taskText: { fontSize: 15, color: COLORS.textMain, marginLeft: 12 },
  taskTextCompleted: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  vitalsGrid: { flexDirection: 'row', gap: 12 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 6 },
  input: { backgroundColor: '#F4F7F9', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  submitButton: { backgroundColor: COLORS.secondary, borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textMain },
  modalBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: COLORS.textMuted, textAlign: 'center' }
});