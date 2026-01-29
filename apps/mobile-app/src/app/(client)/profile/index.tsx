import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_PROFILE } from '../../../graphql/queries';
import { UPDATE_FAMILY_PROFILE } from '../../../graphql/mutations';

// --- Types ---
interface EditableFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  onChange: (key: string, text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
}

// --- Helper Components ---

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.sectionCard}>
    {children}
  </View>
);

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  fieldKey, 
  onChange, 
  icon, 
  isLast 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = React.useRef<TextInput>(null);

  useEffect(() => {
    if (isEditing) {
      // Small delay to ensure render happens before focus
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isEditing]);

  return (
    <View style={[styles.itemContainer, isLast && styles.lastItem]}>
      <View style={styles.itemIconContainer}>
        {icon && <Ionicons name={icon} size={20} color="#64748b" />}
      </View>
      
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemLabel}>{label}</Text>
        
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={value}
            onChangeText={(text) => onChange(fieldKey, text)}
            onBlur={() => setIsEditing(false)}
            returnKeyType="done"
          />
        ) : (
          <Text style={styles.itemValue} numberOfLines={1}>{value || "Not set"}</Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.editIconBtn}
        onPress={() => setIsEditing(!isEditing)}
        hitSlop={10}
      >
        <Feather 
          name={isEditing ? "check" : "edit-2"} 
          size={18} 
          color={isEditing ? "#10b981" : "#94a3b8"} 
        />
      </TouchableOpacity>
    </View>
  );
};

// --- Main Screen Component ---

export default function ProfileScreen() {
  const router = useRouter();
  
  // 1. Fetch Profile Data
  const { data, loading, error, refetch } = useQuery(GET_MY_PROFILE, {
    fetchPolicy: "network-only"
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_FAMILY_PROFILE, {
    onCompleted: () => {
      Alert.alert("Success", "Profile updated successfully.");
      setIsDirty(false);
      refetch();
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    }
  });

  // 2. Local State for Form
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });

  const [initialState, setInitialState] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  // 3. Sync Data to State
  useEffect(() => {
    if (data?.me) {
      const profile = data.me.familyMemberProfile || {};
      
      const loadedState = {
        firstName: data.me.firstName || "",
        lastName: data.me.lastName || "",
        email: data.me.email || "",
        phoneNumber: profile.phoneNumber || "",
        // Simple date handling for now
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        address: profile.address || "",
        city: profile.city || "",
        postalCode: profile.postalCode || "",
        country: profile.country || "Finland"
      };

      setFormState(loadedState);
      setInitialState(loadedState);
    }
  }, [data]);

  // 4. Handle Field Changes
  const handleFieldChange = (key: string, text: string) => {
    const newState = { ...formState, [key]: text };
    setFormState(newState);
    
    // Check if dirty
    if (initialState) {
      const hasChanged = JSON.stringify(newState) !== JSON.stringify(initialState);
      setIsDirty(hasChanged);
    }
  };

  const handleSave = () => {
    // Only send the profile fields for the mutation (User fields might need separate mutation)
    updateProfile({
      variables: {
        input: {
          phoneNumber: formState.phoneNumber,
          address: formState.address,
          city: formState.city,
          postalCode: formState.postalCode,
          country: formState.country,
          // dateOfBirth: formState.dateOfBirth ? new Date(formState.dateOfBirth).toISOString() : null
        }
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    console.log(error)
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: '#ef4444'}}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'My Profile',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
        }} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Profile Card */}
          <View style={styles.headerProfile}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formState.firstName}` }} 
                style={styles.avatar} 
              />
              <View style={styles.editAvatarBtn}>
                <MaterialIcons name="photo-camera" size={16} color="#fff" />
              </View>
            </View>
            <Text style={styles.userName}>{formState.firstName} {formState.lastName}</Text>
            <Text style={styles.userRole}>Family Member</Text>
          </View>

          {/* Section 1: Personal Information */}
          <View style={styles.sectionContainer}>
            <SectionTitle title="Personal Information" />
            <SectionCard>
              <EditableField 
                label="First Name" 
                value={formState.firstName} 
                fieldKey="firstName"
                onChange={handleFieldChange}
                icon="person-outline" 
              />
              <EditableField 
                label="Last Name" 
                value={formState.lastName} 
                fieldKey="lastName"
                onChange={handleFieldChange}
                icon="person-outline" 
              />
              <EditableField 
                label="Date of Birth" 
                value={formState.dateOfBirth} 
                fieldKey="dateOfBirth"
                onChange={handleFieldChange}
                icon="calendar-outline" 
                isLast
              />
            </SectionCard>
          </View>

          {/* Section 2: Contact Info */}
          <View style={styles.sectionContainer}>
            <SectionTitle title="Contact Details" />
            <SectionCard>
              <EditableField 
                label="Email (Read Only)" 
                value={formState.email} 
                fieldKey="email"
                onChange={() => {}} // Email usually not editable here
                icon="mail-outline" 
              />
              <EditableField 
                label="Phone Number" 
                value={formState.phoneNumber} 
                fieldKey="phoneNumber"
                onChange={handleFieldChange}
                icon="call-outline" 
                isLast
              />
            </SectionCard>
          </View>

          {/* Section 3: Address Information */}
          <View style={styles.sectionContainer}>
            <SectionTitle title="Address Book" />
            <SectionCard>
              <EditableField 
                label="Street Address" 
                value={formState.address} 
                fieldKey="address"
                onChange={handleFieldChange}
                icon="location-outline" 
              />
              <EditableField 
                label="City" 
                value={formState.city} 
                fieldKey="city"
                onChange={handleFieldChange}
                icon="business-outline" 
              />
              <EditableField 
                label="Postal Code" 
                value={formState.postalCode} 
                fieldKey="postalCode"
                onChange={handleFieldChange}
                icon="map-outline" 
              />
              <EditableField 
                label="Country" 
                value={formState.country} 
                fieldKey="country"
                onChange={handleFieldChange}
                icon="navigate-outline" 
                isLast
              />
            </SectionCard>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveBtn, 
              (!isDirty || updating) && styles.saveBtnDisabled
            ]}
            onPress={handleSave}
            disabled={!isDirty || updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Update Profile</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.5 (Build 203)</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBtn: {
    color: '#10b981', 
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Header Profile
  headerProfile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#f8fafc',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // Sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    overflow: 'hidden',
  },

  // Items
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 60,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemIconContainer: {
    width: 32,
    marginRight: 12,
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  textInput: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
    padding: 0, 
    borderBottomWidth: 1,
    borderBottomColor: '#10b981', // Highlight when editing
  },
  editIconBtn: {
    padding: 8,
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 12,
  },
});