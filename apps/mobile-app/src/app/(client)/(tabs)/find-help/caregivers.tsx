import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  ChevronRight,
  Activity,
} from 'lucide-react-native';
import { router } from 'expo-router';

// --- Mock Data ---
const CAREGIVERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Certified Nursing Assistant (CNA)',
    rating: 4.9,
    reviews: 124,
    specialties: ['Dementia Care', 'Physical Therapy'],
    hourlyRate: 25,
    experience: '8 years',
    location: 'Downtown',
    availability: 'Full-time',
    verified: true,
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Registered Nurse (RN)',
    rating: 5.0,
    reviews: 89,
    specialties: ['Medical Monitoring', 'Diabetes'],
    hourlyRate: 45,
    experience: '12 years',
    location: 'North Heights',
    availability: 'Part-time',
    verified: true,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    title: 'Home Health Aide',
    rating: 4.8,
    reviews: 56,
    specialties: ['Companionship', 'Meal Prep'],
    hourlyRate: 20,
    experience: '5 years',
    location: 'West End',
    availability: 'Live-in',
    verified: true,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'David Wilson',
    title: 'Physical Therapist',
    rating: 4.9,
    reviews: 42,
    specialties: ['Mobility', 'Post-Op Care'],
    hourlyRate: 60,
    experience: '10 years',
    location: 'East Side',
    availability: 'Weekends',
    verified: true,
    image: 'https://images.unsplash.com/photo-1612531386530-97286d74c2ea?q=80&w=200&h=200&auto=format&fit=crop',
  },
];

const SPECIALTIES = ['All', 'Dementia Care', 'Medical Monitoring', 'Companionship', 'Physical Therapy', 'Post-Op Care'];

const CaregiverCard = ({ item }: { item: typeof CAREGIVERS[0] }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck size={12} color="#FFFFFF" fill="#3B82F6" />
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.titleText}>{item.title}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{item.availability}</Text>
          </View>
        </View>
      </View>
    </View>

    {/* Specialties / Tags */}
    <View style={styles.tagsRow}>
      {item.specialties.map((spec) => (
        <View key={spec} style={styles.tag}>
          <Text style={styles.tagText}>{spec}</Text>
        </View>
      ))}
    </View>

    {/* Footer Price & Action */}
    <View style={styles.cardFooter}>
      <View>
        <Text style={styles.rateLabel}>HOURLY RATE</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>${item.hourlyRate}</Text>
          <Text style={styles.priceUnit}>/hr</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewProfileBtn} onPress={() => router.push(`/(client)/(tabs)/find-help/${item.id}`)}>
        <Text style={styles.viewProfileText}>View Profile</Text>
        <ChevronRight size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CaregiverDirectory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCaregivers = useMemo(() => {
    return CAREGIVERS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.title.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === 'All' || c.specialties.includes(selectedCategory);
      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
     
      <FlatList
        data={filteredCaregivers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CaregiverCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>Find Caregivers</Text>
            <Text style={styles.pageSubtitle}>Qualified professionals for elder care.</Text>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Search size={20} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or specialty..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Horizontal Filter Scroll */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {SPECIALTIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterChip,
                    selectedCategory === cat && styles.filterChipActive
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    selectedCategory === cat && styles.filterTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.resultsBar}>
              <Text style={styles.resultsText}>{filteredCaregivers.length} matches found</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Filter size={14} color="#64748B" />
                <Text style={styles.sortButtonText}>Sort</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Activity size={40} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No caregivers found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    backgroundColor: '#2563EB',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },
  filterScroll: {
    marginTop: 16,
    marginHorizontal: -20,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  resultsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  titleText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  priceUnit: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 2,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  viewProfileText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIconContainer: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
});