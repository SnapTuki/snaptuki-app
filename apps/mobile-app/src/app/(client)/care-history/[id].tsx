const MOCK_DETAIL = {
  elderName: "John Doe",
  caregiver: {
    name: "Sarah Smith",
    role: "Certified Caregiver",
    email: "sarah.smith@snaptuki.com",
  },
  date: "Jan 12, 2026",
  time: "09:00 AM – 12:00 PM",
  overallNotes:
    "Elder was calm and cooperative. Mobility slightly limited today but improved after exercises.",
  tasks: [
    {
      id: "1",
      title: "Administer medication",
      completedAt: "09:30 AM",
      comment: "Medication taken without resistance. No side effects observed.",
    },
    {
      id: "2",
      title: "Assist with breakfast",
      completedAt: "10:00 AM",
      comment: "Ate 80% of the meal. Required minimal assistance.",
    },
    {
      id: "3",
      title: "Physical therapy exercises",
      completedAt: "11:15 AM",
      comment: "Completed light stretching. Noted mild stiffness in right knee.",
    },
  ],
};


import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CareHistoryDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Care Session Details</Text>

      {/* Caregiver Card */}
      <View style={styles.caregiverCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.caregiverName}>
            {MOCK_DETAIL.caregiver.name}
          </Text>
          <Text style={styles.caregiverRole}>
            {MOCK_DETAIL.caregiver.role}
          </Text>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={14} color="#6b7280" />
            <Text style={styles.contactText}>
              {MOCK_DETAIL.caregiver.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Session Info */}
      <View style={styles.infoSection}>
        <InfoRow icon="calendar-outline" label="Date">
          {MOCK_DETAIL.date}
        </InfoRow>
        <InfoRow icon="time-outline" label="Time">
          {MOCK_DETAIL.time}
        </InfoRow>
        <InfoRow icon="person-outline" label="Elder">
          {MOCK_DETAIL.elderName}
        </InfoRow>
      </View>

      {/* Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tasks Performed</Text>

        {MOCK_DETAIL.tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#10b981"
              />
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>

            <Text style={styles.taskTime}>
              Completed at {task.completedAt}
            </Text>

            <View style={styles.commentBox}>
              <Text style={styles.commentLabel}>Caregiver Comment</Text>
              <Text style={styles.commentText}>{task.comment}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Overall Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Care Notes</Text>
        <View style={styles.notesBox}>
          <Text style={styles.notesText}>
            {MOCK_DETAIL.overallNotes}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#2563eb" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  caregiverCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  caregiverName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  caregiverRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  infoSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  taskCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  taskTime: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    marginLeft: 28,
  },
  commentBox: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  notesBox: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
});
