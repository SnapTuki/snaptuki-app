import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// --- Types ---
interface ProfileItemProps {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

// --- Mock Data ---
const USER_DATA = {
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martha',
  firstName: 'Martha',
  lastName: 'Smith',
  dob: 'March 15, 1954',
  email: 'martha.smith@example.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '124 Maple Avenue',
    city: 'Springfield',
    state: 'IL',
    zip: '62704'
  },
  memberId: 'EC-88392-2024'
};

// --- Helper Components ---

const ProfileSection: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>
      {children}
    </View>
  </View>
);

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value, icon, isLast }) => (
  <View style={[styles.itemContainer, isLast && styles.lastItem]}>
    <View style={styles.itemIconContainer}>
      {icon && <Ionicons name={icon} size={20} color="#64748b" />}
    </View>
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

// --- Main Screen Component ---

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Configure the Header via Expo Router */}
      <Stack.Screen 
        options={{
          title: 'My Profile',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log('Edit Profile')}>
              <Text style={styles.headerBtn}>Edit</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile Card */}
        <View style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: USER_DATA.avatar }} 
              style={styles.avatar} 
            />
            <View style={styles.editAvatarBtn}>
              <MaterialIcons name="photo-camera" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{USER_DATA.firstName} {USER_DATA.lastName}</Text>
          <Text style={styles.userRole}>Premium Member</Text>
        </View>

        {/* Section 1: Personal Information */}
        <ProfileSection title="Personal Information">
          <ProfileItem 
            label="First Name" 
            value={USER_DATA.firstName} 
            icon="person-outline" 
          />
          <ProfileItem 
            label="Last Name" 
            value={USER_DATA.lastName} 
            icon="person-outline" 
          />
          <ProfileItem 
            label="Date of Birth" 
            value={USER_DATA.dob} 
            icon="calendar-outline" 
            isLast
          />
        </ProfileSection>

        {/* Section 2: Account Information */}
        <ProfileSection title="Account Details">
          <ProfileItem 
            label="Email" 
            value={USER_DATA.email} 
            icon="mail-outline" 
          />
          <ProfileItem 
            label="Member ID" 
            value={USER_DATA.memberId} 
            icon="card-outline" 
            isLast 
          />
        </ProfileSection>

        {/* Section 3: Address Information */}
        <ProfileSection title="Address Book">
          <ProfileItem 
            label="Street Address" 
            value={USER_DATA.address.street} 
            icon="location-outline" 
          />
          <ProfileItem 
            label="City" 
            value={USER_DATA.address.city} 
            icon="business-outline" 
          />
          <ProfileItem 
            label="State / Province" 
            value={USER_DATA.address.state} 
            icon="map-outline" 
          />
           <ProfileItem 
            label="Zip Code" 
            value={USER_DATA.address.zip} 
            icon="navigate-outline" 
            isLast
          />
        </ProfileSection>


        <Text style={styles.versionText}>Version 1.0.4 (Build 202)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerBtn: {
    color: '#10b981', // Emerald 500
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    marginLeft: 8,
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 12,
  },
});