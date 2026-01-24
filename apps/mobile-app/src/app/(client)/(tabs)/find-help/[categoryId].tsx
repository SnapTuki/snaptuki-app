import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GET_CARE_SERVICE_BY_CATEGORY } from "../../../../graphql/queries";
import { useQuery } from "@apollo/client/react";

export default function CategoryTasksScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const { data, loading, error } = useQuery(
    GET_CARE_SERVICE_BY_CATEGORY,
    { variables: { categoryId } }
  );

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});

  const category = data?.getServiceCategoryById;
  const tasks = category?.serviceTasks ?? [];

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  if (loading) return <Text style={styles.state}>Loading services…</Text>;
  if (error) return <Text style={styles.state}>Failed to load services</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{category.category_name}</Text>
        <Text style={styles.categorySubtitle}>
          Select all services you need for your elder
        </Text>
      </View>

      {/* Tasks */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.task_id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = selectedTasks.includes(item.task_id);

          return (
            <View style={styles.taskCard}>
              <Pressable
                onPress={() => toggleTask(item.task_id)}
                style={styles.taskHeader}
              >
                <View
                  style={[
                    styles.checkbox,
                    selected && styles.checkboxSelected,
                  ]}
                >
                  {selected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#fff"
                    />
                  )}
                </View>

                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{item.service_name}</Text>
                  {item.description && (
                    <Text style={styles.taskDescription}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Optional Notes */}
              {selected && (
                <TextInput
                  placeholder="Add notes for caregiver (optional)"
                  style={styles.notesInput}
                  multiline
                  value={taskNotes[item.task_id] ?? ""}
                  onChangeText={(text) =>
                    setTaskNotes((prev) => ({
                      ...prev,
                      [item.task_id]: text,
                    }))
                  }
                />
              )}
            </View>
          );
        }}
      />

      {/* CTA */}
      <View style={styles.footer}>
        <Pressable
          disabled={selectedTasks.length === 0}
          style={[
            styles.ctaButton,
            selectedTasks.length === 0 && styles.ctaDisabled,
          ]}
          onPress={() => {
            // navigate to caregiver search
          }}
        >
          <Text style={styles.ctaText}>Looking for Caregiver</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  categoryTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  categorySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    marginTop: 2,
  },

  checkboxSelected: {
    backgroundColor: "#0A7EA4",
    borderColor: "#0A7EA4",
  },

  taskInfo: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  taskDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  notesInput: {
    marginTop: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    minHeight: 60,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  ctaButton: {
    backgroundColor: "#0A7EA4",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  ctaDisabled: {
    backgroundColor: "#9CA3AF",
  },

  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  state: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
});
