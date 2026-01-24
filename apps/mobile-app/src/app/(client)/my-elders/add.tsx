import React, { useState } from "react";
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
  Platform,
  TouchableOpacity
} from "react-native";
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@apollo/client/react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { CREATE_ELDER_PROFILE } from "../../../graphql/mutations"; 
import { GET_MY_ELDERS } from "../../../graphql/queries";
import { useSession } from "@/src/hooks/useSession";
import { MobilityLevel } from "@/src/types/__generated__/graphql";


export default function AddElderScreen() {
  const router = useRouter();

  // 1. Get Current User ID
  const { user } = useSession();

  // 2. Setup Mutation
  const [createElder, { loading }] = useMutation(CREATE_ELDER_PROFILE, {
    refetchQueries: [{ query: GET_MY_ELDERS }],
    onCompleted: () => {
      Alert.alert("Success", "Elder profile created successfully.");
      router.replace('/(client)/my-elders');
    },
    onError: (err) => {
      console.error(err);
      Alert.alert("Error", "Failed to create profile. " + err.message);
    }
  });

  const handleCancel = () => router.replace('/(client)/my-elders');

  return (
    <View style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleCancel} hitSlop={10}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Create a profile for your loved one to manage their care schedule and vitals.
        </Text>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            dateOfBirth: new Date(), // Initialize as Date object
            phone: "",
            mobilityLevel: "independent" as MobilityLevel,
            medicalNotes: "",
            address: "",
            livesInNursingHome: false,
          }}
          validate={(values) => {
            const errors: any = {};
            if (!values.firstName) errors.firstName = "Required";
            if (!values.lastName) errors.lastName = "Required";
            if (!values.dateOfBirth) errors.dateOfBirth = "Required";
            return errors;
          }}
          onSubmit={(values) => {
            console.log(`Current User: ${user}`)
            if (!user) {
              console.log(`Current User: ${user}`)
              Alert.alert("Error", "User session not found. Please relogin.",);
              return;
            }
             console.log(`Current User: ${user?.id}`)
            createElder({
              variables: {
                input: {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  dateOfBirth: values.dateOfBirth,
                  address: values.address,
                  phone: values.phone,
                  medicalNotes: values.medicalNotes,
                  mobilityLevel: values.mobilityLevel,
                  familyMemberId: Number(user?.id),
                  relationship: 'Family Member'
                }
              }
            });
          }}
        >
          {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
            <View>
              {/* Personal Info */}
              <Section title="Personal Information">
                <Input 
                  label="First Name" 
                  placeholder="e.g. John"
                  onChangeText={handleChange("firstName")} 
                  value={values.firstName}
                  error={touched.firstName ? errors.firstName : undefined} 
                />
                <Input 
                  label="Last Name" 
                  placeholder="e.g. Doe"
                  onChangeText={handleChange("lastName")} 
                  value={values.lastName}
                  error={touched.lastName ? errors.lastName : undefined}
                />
                
                {/* Date Picker Input */}
                <DateInput 
                  label="Date of Birth"
                  value={values.dateOfBirth}
                  onChange={(date) => setFieldValue("dateOfBirth", date)}
                  error={touched.dateOfBirth ? (errors.dateOfBirth as string) : undefined}
                />

                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("phone")}
                  value={values.phone}
                />
              </Section>

              {/* Health */}
              <Section title="Care Requirements">
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
                  placeholder="Allergies, chronic conditions, medications..."
                  multiline
                  onChangeText={handleChange("medicalNotes")}
                  value={values.medicalNotes}
                />
              </Section>

              {/* Location */}
              <Section title="Living Situation">
                <SwitchRow
                  label="Lives in a nursing home"
                  value={values.livesInNursingHome}
                  onChange={(v: boolean) => setFieldValue("livesInNursingHome", v)}
                />

                <Input
                  label={values.livesInNursingHome ? "Facility Name & Address" : "Home Address"}
                  placeholder="Street, City, Zip Code"
                  onChangeText={handleChange("address")}
                  value={values.address}
                />
                
              </Section>

              {/* Submit Actions */}
              <View style={styles.footerActions}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]} 
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View style={styles.submitContent}>
                      <Feather name="check" size={18} color="#fff" />
                      <Text style={styles.submitText}>Save Profile</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

// --- Reusable Components ---

function Section({ title, children }: { title?: string, children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      {!!title && <Text style={styles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
}

function Input({ label, error, ...props }: any) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input, 
          props.multiline && { height: 90, textAlignVertical: "top" },
          !!error && { borderColor: "#ef4444", backgroundColor: "#fef2f2" }
        ]}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Custom Date Input Component
function DateInput({ label, value, onChange, error }: { label: string, value: Date, onChange: (d: Date) => void, error?: string }) {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const togglePicker = () => {
    setShow((prev) => !prev);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={togglePicker} style={[styles.input, styles.dateInput, !!error && styles.inputError]}>
        <Text style={styles.inputText}>
          {value ? value.toLocaleDateString() : "Select Date"}
        </Text>
        <Feather name="calendar" size={18} color="#6b7280" />
      </Pressable>
      
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
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
      {!!helper && <Text style={styles.helperText}>{helper}</Text>}
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
  screenContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  headerSpacer: {
    width: 50,
  },
  cancelText: {
    fontSize: 16,
    color: "#6b7280",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginVertical: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  inputContainer: {
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#111827",
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  mobilityChipActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#0a7ea4",
  },
  mobilityText: {
    fontSize: 13,
    color: "#374151",
  },
  mobilityTextActive: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  footerActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: "#0a7ea4",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelBtnText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  }
});