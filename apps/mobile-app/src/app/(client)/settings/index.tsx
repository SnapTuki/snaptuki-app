import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  SafeAreaView, 
  Alert,
  Platform 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// --- Types ---
interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingsItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type?: 'link' | 'toggle' | 'value';
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (val: boolean) => void;
  isLast?: boolean;
  isDestructive?: boolean;
}

// --- Helper Components ---

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>
      {children}
    </View>
  </View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  label, 
  icon, 
  type = 'link', 
  value, 
  onPress, 
  onToggle, 
  isLast,
  isDestructive 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.itemContainer, isLast && styles.lastItem]} 
      onPress={type !== 'toggle' ? onPress : undefined}
      activeOpacity={type === 'toggle' ? 1 : 0.7}
      disabled={type === 'toggle'}
    >
      <View style={[
        styles.iconBox, 
        isDestructive && styles.destructiveIconBox
      ]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isDestructive ? '#ef4444' : '#64748b'} 
        />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={[
          styles.itemLabel, 
          isDestructive && styles.destructiveLabel
        ]}>
          {label}
        </Text>
        
        {/* Render content based on type */}
        {type === 'toggle' && (
          <Switch
            value={value as boolean}
            onValueChange={onToggle}
            trackColor={{ false: '#e2e8f0', true: '#10b981' }} // Emerald active
            thumbColor={'#fff'}
            ios_backgroundColor="#e2e8f0"
          />
        )}

        {type === 'value' && (
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{value as string}</Text>
            <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
          </View>
        )}

        {type === 'link' && (
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

// --- Main Screen Component ---

export default function SettingsScreen() {
  const router = useRouter();

  // --- Mock State ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // --- Handlers ---
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and you will lose all care records.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => console.log("Account deleted") 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem 
            label="App Theme" 
            icon="moon-outline" 
            type="value"
            value="System Default"
            onPress={() => console.log('Change Theme')}
          />
          <SettingsItem 
            label="Language" 
            icon="language-outline" 
            type="value"
            value="English (US)"
            onPress={() => console.log('Change Language')}
            isLast
          />
        </SettingsSection>

        {/* Accessibility Section - Critical for Elder Care */}
        <SettingsSection title="Accessibility & Display">
          <SettingsItem 
            label="Large Text Mode" 
            icon="text-outline" 
            type="toggle"
            value={largeText}
            onToggle={setLargeText}
          />
          <SettingsItem 
            label="High Contrast" 
            icon="contrast-outline" 
            type="toggle"
            value={highContrast}
            onToggle={setHighContrast}
            isLast
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingsItem 
            label="Push Notifications" 
            icon="notifications-outline" 
            type="toggle"
            value={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingsItem 
            label="Email Digest" 
            icon="mail-outline" 
            type="toggle"
            value={emailDigest}
            onToggle={setEmailDigest}
            isLast
          />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security & Account">
          <SettingsItem 
            label="Change Password" 
            icon="lock-closed-outline" 
            onPress={() => console.log('Change Password')}
          />
          <SettingsItem 
            label="Biometric Login" 
            icon="finger-print-outline" 
            type="toggle"
            value={biometricsEnabled}
            onToggle={setBiometricsEnabled}
            isLast
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem 
            label="Help Center" 
            icon="help-buoy-outline" 
            onPress={() => console.log('Help')}
          />
          <SettingsItem 
            label="Privacy Policy" 
            icon="shield-checkmark-outline" 
            onPress={() => console.log('Privacy')}
          />
           <SettingsItem 
            label="Terms of Service" 
            icon="document-text-outline" 
            onPress={() => console.log('Terms')}
            isLast
          />
        </SettingsSection>

        {/* Danger Zone */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={[styles.sectionCard, styles.dangerCard]}>
            <SettingsItem 
              label="Delete Account" 
              icon="trash-outline" 
              isDestructive
              onPress={handleDeleteAccount}
              isLast
            />
          </View>
          <Text style={styles.dangerFooter}>
            Deleting your account will remove all data permanently.
          </Text>
        </View>

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
  
  // Section Styles
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
        elevation: 2,
      },
    }),
    overflow: 'hidden',
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  dangerFooter: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    color: '#94a3b8',
  },

  // Item Styles
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // slightly reduced padding for tighter list
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 56,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIconBox: {
    backgroundColor: '#fef2f2',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  destructiveLabel: {
    color: '#ef4444',
  },
  
  // Value Styles
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 15,
    color: '#94a3b8',
    marginRight: 8,
  },
});