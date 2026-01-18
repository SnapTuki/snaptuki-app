import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Formik } from "formik";
import { Feather,  } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

type MobilityLevel = "independent" | "needs_assistant" | "wheelchair";

export default function EditElderScreen() {
  const router = useRouter();
  const { elderId } = useLocalSearchParams();

  // 🔹 Mocked elder data – replace with GraphQL query
  const elder = {
    firstName: "Anna",
    lastName: "Korhonen",
    dateOfBirth: "1942-04-12",
    ssn: "****-****",
    mobilityLevel: "needs_assistant" as MobilityLevel,
    medicalConditions: "Diabetes",
    medicalNotes: "Needs insulin every morning",
    livesInNursingHome: false,
    address: "Helsinki, Finland",
    nursingHomeName: "",
    isDefault: true,
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Elder Profile",
      "This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: delete mutation
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Edit Elder Profile</Text>

      <Formik
        initialValues={elder}
        enableReinitialize
        onSubmit={(values) => {
          console.log("Updated Elder:", values);
          // TODO: update mutation
          router.back();
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <>
            {/* Personal Info */}
            <Section title="Personal Information">
              <Input label="First Name" value={values.firstName} onChangeText={handleChange("firstName")} />
              <Input label="Last Name" value={values.lastName} onChangeText={handleChange("lastName")} />
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={values.dateOfBirth}
                onChangeText={handleChange("dateOfBirth")}
              />
              <Input
                label="Social Security Number"
                placeholder="Enter new SSN to update"
                secureTextEntry
                onChangeText={handleChange("ssn")}
              />
            </Section>

            {/* Health */}
            <Section title="Health Information">
              <Text style={styles.label}>Mobility Level</Text>
              <View style={styles.mobilityRow}>
                {(["independent", "needs_assistant", "wheelchair"] as MobilityLevel[]).map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      styles.mobilityChip,
                      values.mobilityLevel === level && styles.mobilityChipActive,
                    ]}
                    onPress={() => setFieldValue("mobilityLevel", level)}
                  >
                    <Text
                      style={[
                        styles.mobilityText,
                        values.mobilityLevel === level && styles.mobilityTextActive,
                      ]}
                    >
                      {formatMobility(level)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Input
                label="Medical Conditions"
                value={values.medicalConditions}
                onChangeText={handleChange("medicalConditions")}
              />

              <Input
                label="Medical Notes"
                multiline
                value={values.medicalNotes}
                onChangeText={handleChange("medicalNotes")}
              />
            </Section>

            {/* Living */}
            <Section title="Living Situation">
              <SwitchRow
                label="Lives in a nursing home"
                value={values.livesInNursingHome}
                onChange={(v:any) => setFieldValue("livesInNursingHome", v)}
              />

              {values.livesInNursingHome ? (
                <Input
                  label="Nursing Home Name"
                  value={values.nursingHomeName}
                  onChangeText={handleChange("nursingHomeName")}
                />
              ) : (
                <Input
                  label="Home Address"
                  value={values.address}
                  onChangeText={handleChange("address")}
                />
              )}
            </Section>

            {/* Default */}
            <Section>
              <SwitchRow
                label="Set as default elder"
                value={values.isDefault}
                onChange={(v:any) => setFieldValue("isDefault", v)}
              />
            </Section>

            {/* Save */}
            <Pressable style={styles.submitBtn} onPress={() => handleSubmit()}>
              <Feather name="save" size={18} color="#fff" />
              <Text style={styles.submitText}>Save Changes</Text>
            </Pressable>

            {/* Delete */}
            <Pressable style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteText}>Remove Elder Profile</Text>
            </Pressable>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 20,
    marginBottom: 12,
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },

  mobilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  mobilityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },

  mobilityChipActive: {
    backgroundColor: "#0a7ea4",
  },

  mobilityText: {
    fontSize: 13,
    color: "#374151",
  },

  mobilityTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  submitBtn: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },

  deleteBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  deleteText: {
    color: "#dc2626",
    fontWeight: "600",
  },
});


function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function Input({ label, ...props }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, props.multiline && { height: 90, textAlignVertical: "top" }]}
      />
    </View>
  );
}

function SwitchRow({ label, helper, value, onChange }: any) {
  return (
    <View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>{label}</Text>
        <Switch value={value} onValueChange={onChange} />
      </View>
      {helper && <Text style={{ fontSize: 12, color: "#6b7280" }}>{helper}</Text>}
    </View>
  );
}

function formatMobility(level: string) {
  switch (level) {
    case "independent":
      return "Independent";
    case "needs_assistant":
      return "Needs Assistance";
    case "wheelchair":
      return "Wheelchair";
    default:
      return level;
  }
}
