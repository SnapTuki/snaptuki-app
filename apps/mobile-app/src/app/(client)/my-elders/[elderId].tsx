import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ELDER_PROFILE, GET_MY_ELDERS } from "../../../graphql/queries"; // Adjust path
import { REMOVE_ELDER_PROFILE, UPDATE_ELDER_PROFILE } from "../../../graphql/mutations"; // Adjust path
import { MobilityLevel } from "@/src/types/__generated__/graphql";

// Helper to sanitize backend data for the form
const getInitialValues = (data: any) => ({
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  dateOfBirth: data?.dateOfBirth || "",
  phone: data?.phone || "",
  address: data?.address || "",
  mobilityLevel: (data?.mobilityLevel || "independent") as MobilityLevel,
  medicalNotes: data?.medicalNotes || "",
  // These fields might not exist in your backend yet, keeping defaults
  livesInNursingHome: false,
  nursingHomeName: "",
  isDefault: false, 
});

export default function EditElderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params.elderId);
  const parsedId = parseInt(Array.isArray(params.elderId) ? params.elderId[0] : params.elderId, 10);

  console.log(parsedId);
  // 1. Fetch Elder Data
  const { data, loading, error } = useQuery(GET_ELDER_PROFILE, {
    variables: { elderId: parsedId },
    skip: !parsedId,
    fetchPolicy: "network-only",
  });

  // 2. Setup Update Mutation
  const [updateElder, { loading: updating }] = useMutation(UPDATE_ELDER_PROFILE, {
    refetchQueries: [{ query: GET_MY_ELDERS }],
    onCompleted: () => {
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  // 3. Setup Remove Mutation
  const [removeElder, { loading: removing }] = useMutation(REMOVE_ELDER_PROFILE, {
    refetchQueries: [{ query: GET_MY_ELDERS }],
    onCompleted: () => {
      router.back();
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to remove this profile? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeElder({ variables: { elderId: parsedId } }),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (error || !data?.getElderProfile) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Profile not found or error loading data.</Text>
        <Pressable onPress={router.back} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const elderData = data.getElderProfile;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={router.back} hitSlop={10}>
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <Formik
        initialValues={getInitialValues(elderData)}
        enableReinitialize
        onSubmit={(values) => {
          updateElder({
            variables: {
              elderId: parsedId,
              input: {
                // Map form values to GraphQL input
                firstName: values.firstName,
                lastName: values.lastName,
                address: values.address,
                phone: values.phone,
                medicalNotes: values.medicalNotes,
                mobilityLevel: values.mobilityLevel,
                dateOfBirth: values.dateOfBirth 
              },
            },
          });
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <>
            {/* Personal Info */}
            <Section title="Personal Information">
              <Input 
                label="First Name" 
                value={values.firstName} 
                onChangeText={handleChange("firstName")} 
              />
              <Input 
                label="Last Name" 
                value={values.lastName} 
                onChangeText={handleChange("lastName")} 
              />
              {/* Note: Standard Date Picker would be better here, keeping TextInput for now */}
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={values.dateOfBirth ? new Date(values.dateOfBirth).toLocaleDateString() : ""}
                editable={false} // Often DOB is locked or needs specific UI
                style={{ color: '#9ca3af' }}
              />
              <Input
                label="Phone"
                value={values.phone}
                onChangeText={handleChange("phone")}
                keyboardType="phone-pad"
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
                onChange={(v: any) => setFieldValue("livesInNursingHome", v)}
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

            {/* Save Button */}
            <Pressable 
              style={[styles.submitBtn, updating && styles.disabledBtn]} 
              onPress={() => handleSubmit()}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="save" size={18} color="#fff" />
                  <Text style={styles.submitText}>Save Changes</Text>
                </>
              )}
            </Pressable>

            {/* Delete Button */}
            <Pressable 
              style={[styles.deleteBtn, removing && styles.disabledBtn]} 
              onPress={handleDelete}
              disabled={removing}
            >
              {removing ? (
                <ActivityIndicator color="#dc2626" size="small" />
              ) : (
                <Text style={styles.deleteText}>Remove Profile</Text>
              )}
            </Pressable>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

// --- Local Components ---

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      {!!title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function Input({ label, style, ...props }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input, 
          props.multiline && { height: 90, textAlignVertical: "top" },
          style
        ]}
      />
    </View>
  );
}

function SwitchRow({ label, helper, value, onChange }: any) {
  return (
    <View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>{label}</Text>
        <Switch 
          value={value} 
          onValueChange={onChange} 
          trackColor={{ false: "#e5e7eb", true: "#0a7ea4" }}
        />
      </View>
      {!!helper && <Text style={{ fontSize: 12, color: "#6b7280" }}>{helper}</Text>}
    </View>
  );
}

function formatMobility(level: string) {
  switch (level) {
    case "independent": return "Independent";
    case "needs_assistant": return "Needs Assistance";
    case "wheelchair": return "Wheelchair";
    default: return level;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 15,
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
    fontSize: 15,
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
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
  errorText: {
    color: "#6b7280",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
});