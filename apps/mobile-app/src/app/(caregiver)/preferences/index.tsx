import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'; // Ensure this is installed

const COLORS = {
  primary: '#005FB8',
  secondary: '#00A79D',
  background: '#F4F7F9',
  white: '#FFFFFF',
  textMain: '#1A1C1E',
  textMuted: '#6C727A',
  border: '#E1E6EB',
};

export default function PreferencesScreen() {
  const [radius, setRadius] = useState(15);
  const [notifications, setNotifications] = useState(true);
  const [instantBooking, setInstantBooking] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.mainTitle}>Service Preferences</Text>

        {/* 1. Logistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Logistics</Text>
          
          <View style={styles.preferenceRow}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Travel Radius</Text>
              <Text style={styles.rowSub}>Maximum distance for visits</Text>
            </View>
            <Text style={styles.radiusVal}>{radius} miles</Text>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={radius}
            onValueChange={setRadius}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
          />

          <View style={styles.divider} />

          <PreferenceToggle 
            label="Instant Booking" 
            sub="Automatically accept agency-approved requests" 
            value={instantBooking} 
            onValueChange={setInstantBooking} 
          />
        </View>

        {/* 2. Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Availability</Text>
          
          <TouchableOpacity style={styles.navRow}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Work Schedule</Text>
              <Text style={styles.rowSub}>Manage your active hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.navRow}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>Blackout Dates</Text>
              <Text style={styles.rowSub}>Set vacation or leave days</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        {/* 3. Communication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Communication</Text>
          <PreferenceToggle 
            label="Push Notifications" 
            sub="Get alerts for new booking requests" 
            value={notifications} 
            onValueChange={setNotifications} 
          />
        </View>

        {/* 4. Action Footer */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Update Preferences</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Changes to travel radius and work hours may take up to 24 hours to reflect in agency matching.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-component for clean toggles
const PreferenceToggle = ({ label, sub, value, onValueChange }: any) => (
  <View style={styles.preferenceRow}>
    <View style={styles.rowInfo}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowSub}>{sub}</Text>
    </View>
    <Switch 
      value={value} 
      onValueChange={onValueChange} 
      trackColor={{ false: '#D1D1D6', true: COLORS.secondary }}
      ios_backgroundColor="#D1D1D6"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 60 },
  mainTitle: { fontSize: 26, fontWeight: '700', color: COLORS.textMain, marginBottom: 20 },
  section: { 
    backgroundColor: COLORS.white, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 }
    })
  },
  sectionHeader: { fontSize: 13, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  preferenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowInfo: { flex: 1, paddingRight: 10 },
  rowLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textMain },
  rowSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  radiusVal: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  slider: { width: '100%', height: 40, marginTop: 10 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  saveButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 12, 
    height: 56, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  footerNote: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: 20, paddingHorizontal: 20, lineHeight: 18 }
});