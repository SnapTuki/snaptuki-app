import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Switch } from "react-native";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type MobilityLevel = "independent" | "needs_assistant" | "wheelchair";

export default function AddElderScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Elder Profile</Text>
      <Text style={styles.subtitle}>
        This information helps caregivers deliver safe and personalized care.
      </Text>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          ssn: "",
          mobilityLevel: "independent" as MobilityLevel,
          medicalConditions: "",
          medicalNotes: "",
          livesInNursingHome: false,
          address: "",
          nursingHomeName: "",
          isDefault: false,
        }}
        onSubmit={(values) => {
          console.log(values);
          // TODO: call GraphQL mutation
          router.back();
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <>
            {/* Personal Info */}
            <Section title="Personal Information">
              <Input label="First Name" onChangeText={handleChange("firstName")} value={values.firstName} />
              <Input label="Last Name" onChangeText={handleChange("lastName")} value={values.lastName} />
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                onChangeText={handleChange("dateOfBirth")}
                value={values.dateOfBirth}
              />
              <Input
                label="Social Security Number"
                secureTextEntry
                onChangeText={handleChange("ssn")}
                value={values.ssn}
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
                placeholder="e.g. Diabetes, Hypertension"
                onChangeText={handleChange("medicalConditions")}
                value={values.medicalConditions}
              />

              <Input
                label="Medical Notes"
                placeholder="Allergies, medications, special care instructions"
                multiline
                onChangeText={handleChange("medicalNotes")}
                value={values.medicalNotes}
              />
            </Section>

            {/* Living Situation */}
            <Section title="Living Situation">
              <SwitchRow
                label="Lives in a nursing home"
                value={values.livesInNursingHome}
                onChange={(v: any) => setFieldValue("livesInNursingHome", v)}
              />

              {values.livesInNursingHome ? (
                <Input
                  label="Nursing Home Name"
                  onChangeText={handleChange("nursingHomeName")}
                  value={values.nursingHomeName}
                />
              ) : (
                <Input
                  label="Home Address"
                  placeholder="Street, City, Country"
                  onChangeText={handleChange("address")}
                  value={values.address}
                />
              )}
            </Section>

            {/* Default Elder */}
            <Section>
              <SwitchRow
                label="Set as default elder"
                helper="This elder will be preselected when booking care"
                value={values.isDefault}
                onChange={(v: any) => setFieldValue("isDefault", v)}
              />
            </Section>

            {/* Submit */}
            <Pressable style={styles.submitBtn} onPress={() => handleSubmit()}>
              <Feather name="check" size={18} color="#fff" />
              <Text style={styles.submitText}>Save Elder Profile</Text>
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
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
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
    backgroundColor: "#fff",
  },

  mobilityRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
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
    fontSize: 15,
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
