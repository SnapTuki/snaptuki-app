import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery, useMutation } from "@apollo/client/react"; // Updated import
import { GET_CAREGIVER_PROFILE, GET_MY_ELDERS, GET_BOOKING_CARDS, GET_MY_PROFILE } from "../../../graphql/queries"; // Added GET_BOOKING_CARDS for refetch
import { CREATE_BOOKING } from "../../../graphql/mutations"; // Import mutation
import { CaregiverProfile, CareTaskStatus } from "@/src/types/__generated__/graphql";
import { useSelectedServices } from "@/src/hooks/useSelectedservices";

const PAYMENT_METHODS = [
  { id: "card", label: "Card Payment", icon: "card-outline" },
  { id: "cash", label: "Cash on Arrival", icon: "cash-outline" },
  { id: "invoice", label: "Invoice (Email)", icon: "document-text-outline" },
];

export default function BookingRequestModal() {
  const { caregiverId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Use Booking Context
  const {
    selectedServices,
    addService,
    removeService
  } = useSelectedServices();

  const parsedId = parseInt(Array.isArray(caregiverId) ? caregiverId[0] : caregiverId, 10);

  // --- Data Fetching ---
  const { data: caregiverData, loading: loadingCaregiver } = useQuery(GET_CAREGIVER_PROFILE, {
    variables: { profileId: parsedId },
    skip: !parsedId,
  });

  const { data: eldersData, loading: loadingElders } = useQuery(GET_MY_ELDERS);

  // Fetch current user profile to get familyMemberId
  const { data: profileData } = useQuery(GET_MY_PROFILE);
  const familyMemberId = profileData?.me?.familyMemberProfile?.id
    ? parseInt(profileData.me.familyMemberProfile.id, 10)
    : 0;

  // --- Mutation Setup ---
  const [createBooking, { loading: creating }] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKING_CARDS }], // Refresh bookings list after creation
    onCompleted: () => {
      Alert.alert("Success", "Your booking request has been sent!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err) => {
      console.error("Booking Error:", err);
      Alert.alert("Booking Failed", err.message || "Something went wrong. Please try again.");
    }
  });

  // --- Local State ---
  const [selectedElderId, setSelectedElderId] = useState<number | null>(null);
  const [arrivalTime, setArrivalTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 2 * 60 * 60 * 1000));
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notes, setNotes] = useState("");

  const caregiver = caregiverData?.getCaregiver as CaregiverProfile;
  const elders = eldersData?.listMyElders || [];

  // --- Helpers ---
  const toggleServiceInModal = (service: { id: number, title: string }) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const durationHours = useMemo(() => {
    const diffMs = endTime.getTime() - arrivalTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return Math.max(0, Number(hours.toFixed(1)));
  }, [arrivalTime, endTime]);

  const totalPrice = useMemo(() => {
    if (!caregiver?.hourlyRate) return 0;
    return Math.round(durationHours * caregiver.hourlyRate);
  }, [durationHours, caregiver]);

  const handleBook = async () => {
    // 1. Validation
    if (!selectedElderId) {
      Alert.alert("Missing Information", "Please select an elder receiving care.");
      return;
    }
    if (selectedServices.length === 0) {
      Alert.alert("Missing Information", "Please select at least one service.");
      return;
    }

    // 2. Prepare Variables

    const careTasks = selectedServices.map((service) => ({
      title: service.title,          
      //description: service.description || "", 
      isMandatory: true,                   
      status: CareTaskStatus.Pending
    }));

    try {
      await createBooking({
        variables: {
          input: {
            caregiverId: parsedId,
            elderId: selectedElderId,
            familyMemberId: familyMemberId,
            startTime: arrivalTime,
            endTime: endTime,
            tasks:careTasks,
            totalPrice: totalPrice,
            notes: notes
          }
        }
      });
    } catch (e) {
      // Error handled by onError callback
    }
  };

  if (loadingCaregiver || loadingElders) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!caregiver) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Caregiver not found.</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: 'blue' }}>Go Back</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 20 : 0 }]}>

      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Booking Request</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#334155" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. Caregiver Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Caregiver</Text>
          <View style={styles.caregiverCard}>
            <Image
              source={{ uri: caregiver.profilePhotoUrl || 'https://via.placeholder.com/100' }}
              style={styles.caregiverAvatar}
            />
            <View>
              <Text style={styles.caregiverName}>{caregiver.firstName} {caregiver.lastName}</Text>
              <Text style={styles.caregiverRole}>{caregiver.city || "Available Provider"}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.ratingText}>{caregiver.rating?.toFixed(1) || "New"}</Text>
              </View>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>€{caregiver.hourlyRate}/hr</Text>
            </View>
          </View>
        </View>

        {/* 2. Elder Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Recipient</Text>
          {elders.length === 0 ? (
            <View style={styles.emptyElderCard}>
              <Text style={styles.emptyElderText}>No profiles found</Text>
              <Pressable onPress={() => router.push('/(client)/my-elders/add')} style={styles.addElderLink}>
                <Text style={styles.addElderText}>+ Add New Profile</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.elderScroll}>
              {elders.map((elder: any) => {
                const isSelected = selectedElderId === parseInt(elder.id);
                return (
                  <Pressable
                    key={elder.id}
                    onPress={() => setSelectedElderId(parseInt(elder.id))}
                    style={[styles.elderCard, isSelected && styles.elderCardSelected]}
                  >
                    <View style={[styles.elderAvatarPlaceholder, isSelected && { backgroundColor: '#dbeafe' }]}>
                      <Text style={[styles.elderInitials, isSelected && { color: '#2563eb' }]}>
                        {elder.firstName[0]}{elder.lastName[0]}
                      </Text>
                    </View>
                    <Text style={[styles.elderName, isSelected && styles.elderNameSelected]} numberOfLines={1}>
                      {elder.firstName}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* 3. Services Selection (Toggleable List) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Select Services</Text>
            <Text style={styles.sectionSubLabel}>{selectedServices.length} selected</Text>
          </View>

          <View style={styles.servicesContainer}>
            {caregiver.offeredServices?.length ? (
              caregiver.offeredServices.map((service) => {
                // Ensure IDs are numbers
                const serviceId = parseInt(service.serviceId as any);
                const isSelected = selectedServices.some((s) => s.id === serviceId);

                return (
                  <Pressable
                    key={service.serviceId}
                    onPress={() => toggleServiceInModal({id: Number(service.serviceId), title: service.serviceName})}
                    style={[styles.serviceRow, isSelected && styles.serviceRowSelected]}
                  >
                    <View style={styles.serviceInfo}>
                      <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                        {service.serviceName}
                      </Text>
                    </View>

                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No specific services listed.</Text>
            )}
          </View>
        </View>

        {/* 4. Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Schedule</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.dateRow}>
              <View>
                <Text style={styles.dateLabel}>Start Time</Text>
                <DateTimePicker
                  value={arrivalTime}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(_, d) => d && setArrivalTime(d)}
                  style={{ alignSelf: 'flex-start' }}
                />
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.dateRow}>
              <View>
                <Text style={styles.dateLabel}>End Time</Text>
                <DateTimePicker
                  value={endTime}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  minimumDate={arrivalTime}
                  onChange={(_, d) => d && setEndTime(d)}
                  style={{ alignSelf: 'flex-start' }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 5. Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Payment Method</Text>
          <View style={styles.paymentContainer}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => setPaymentMethod(method.id)}
                  style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={20}
                    color={isSelected ? "#2563eb" : "#64748b"}
                  />
                  <Text style={[styles.paymentText, isSelected && styles.paymentTextSelected]}>
                    {method.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#2563eb" style={{ marginLeft: 'auto' }} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 6. Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Extra Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Gate code, specific instructions, etc."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

      </ScrollView>

      {/* --- Footer --- */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalPrice}>€{totalPrice}</Text>
          <Text style={styles.durationText}>{durationHours} hrs</Text>
        </View>

        <Pressable
          style={[styles.bookBtn, (!selectedElderId || selectedServices.length === 0 || creating) && styles.bookBtnDisabled]}
          onPress={handleBook}
          disabled={creating || !selectedElderId || selectedServices.length === 0}
        >
          {creating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSubLabel: {
    fontSize: 12,
    color: '#64748b',
  },

  // Caregiver Card
  caregiverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  caregiverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
  },
  caregiverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  caregiverRole: {
    fontSize: 13,
    color: "#64748B",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B45309",
  },
  priceTag: {
    marginLeft: "auto",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceTagText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 12,
  },

  // Elder Selection
  elderScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  elderCard: {
    width: 100,
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    padding: 8,
  },
  elderCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  elderAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  elderInitials: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },
  elderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  elderNameSelected: {
    color: "#2563EB",
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    padding: 2,
  },
  emptyElderCard: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyElderText: {
    color: "#64748B",
    marginBottom: 8,
  },
  addElderLink: {
    padding: 8,
  },
  addElderText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  // Services
  servicesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  serviceRowSelected: {
    backgroundColor: "#F0F9FF", // Very light blue
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  serviceNameSelected: {
    color: "#1E40AF",
    fontWeight: "700",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  emptyText: {
    padding: 16,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Schedule
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  dateRow: {
    paddingVertical: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },

  // Payment
  paymentContainer: {
    gap: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  paymentOptionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  paymentTextSelected: {
    color: "#1E3A8A",
  },

  // Notes
  notesInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#0F172A",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 11,
    color: "#64748B",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  durationText: {
    fontSize: 12,
    color: "#64748B",
  },
  bookBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookBtnDisabled: {
    backgroundColor: "#94A3B8",
    opacity: 0.7,
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});