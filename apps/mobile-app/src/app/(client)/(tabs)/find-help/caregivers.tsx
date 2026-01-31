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
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client/react'; // Import gql to define local query
import { useSelectedServices } from '@/src/hooks/useSelectedservices';
// import { CaregiverProfileCard } from '@/src/types/__generated__/graphql'; // We'll define a local interface or use 'any' for the extended field
import { GET_CAREGIVER_CARDS } from '@/src/graphql/queries';
// Define a local query that includes offeredServices for filtering

// Filter categories for the UI
const SPECIALTIES = ['All', 'Verified', 'Dementia Care', 'Medical Monitoring', 'Mobility Support'];

const CaregiverCard = ({ item }: { item: any }) => (
  <TouchableOpacity 
    style={styles.card} 
    activeOpacity={0.9}
    onPress={() => router.push(`/(client)/(tabs)/find-help/${item.id}`)}
  >
    <View style={styles.cardContent}>
      {/* Header Row: Avatar + Main Info */}
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: item.profilePhotoUrl || 'https://via.placeholder.com/100' }} 
            style={styles.avatar} 
          />
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.firstName} {item.lastName}
            </Text>
            <View style={styles.ratingBadge}>
              <Star size={10} color="#B45309" fill="#B45309" />
              <Text style={styles.ratingText}>{item.rating?.toFixed(1) || 'New'}</Text>
            </View>
          </View>
          
          <Text style={styles.bioText} numberOfLines={2}>
            {item.bio || "Experienced professional ready to assist with elder care needs."}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={12} color="#64748B" />
              <Text style={styles.metaText}>{item.city || "Finland"}</Text>
            </View>
            <View style={styles.metaSeparator} />
            <View style={styles.metaItem}>
              <Clock size={12} color="#64748B" />
              <Text style={styles.metaText}>{item.completedJobsCount} jobs</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Row: Price & Tags */}
      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>€{item.hourlyRate}</Text>
          <Text style={styles.priceUnit}>/hr</Text>
        </View>
        
        <View style={styles.skillsRow}>
           {item.languages && item.languages.slice(0, 2).map((lang: string, index: number) => (
             <View key={index} style={styles.miniTag}>
               <Text style={styles.miniTagText}>{lang}</Text>
             </View>
           ))}
           {item.languages && item.languages.length > 2 && (
             <Text style={styles.moreText}>+{item.languages.length - 2}</Text>
           )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function CaregiverDirectory() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get selected services from context
  const { selectedServices } = useSelectedServices();

  // Use the local query that fetches services
  const { data, loading, error, refetch } = useQuery(GET_CAREGIVER_CARDS, {
    fetchPolicy: 'cache-and-network',
    variables: {offeredServiceIds: selectedServices.map(obj => obj.id)}
  });

  const caregivers = data?.listCaregivers || [];

  const filteredCaregivers = useMemo(() => {
    return caregivers.filter((c: any) => {
      // 1. Text Search
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase()) || 
                            (c.city && c.city.toLowerCase().includes(search.toLowerCase()));
      
      // 2. Category Filter (UI Tabs)
      let matchesCat = true;
      if (selectedCategory === 'Verified') {
        matchesCat = c.verified;
      }
      
      // 3. Service Matching (Context)
      // If user selected services, caregiver MUST offer at least one (or all) of them
      // Logic: Show caregivers who match *all* selected services for better relevance? 
      // Or *any*? Usually "Find Help" implies "I need someone who can do X AND Y".
      // Let's go with: Caregiver must have ALL selected services.
      /* let matchesServices = true;
      if (selectedServiceIds.length > 0 && c.offeredServices) {
        const caregiverServiceIds = c.offeredServices.map((s: any) => parseInt(s.serviceId));
        // Check if every selected ID is present in caregiver's services
        matchesServices = selectedServiceIds.every((id) => caregiverServiceIds.includes(id));
      } */

      return matchesSearch && matchesCat //matchesServices;
    });
  }, [search, selectedCategory, caregivers]); //selectedServiceIds]);

  if (loading && !data) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  if (error) {
    console.log(error)
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#EF4444', marginBottom: 10 }}>Failed to load Caregivers</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
     
      <FlatList
        data={filteredCaregivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CaregiverCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <Text style={styles.pageTitle}>Find Caregivers</Text>
            
            {/* Context Awareness: Show active filters */}
            {selectedServices.length > 0 && (
              <View style={styles.activeFiltersRow}>
                <Text style={styles.activeFilterText}>
                  Matching {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Search size={18} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or city..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Filters */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.filterScrollContent}
              style={styles.filterScroll}
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
              <Text style={styles.resultsText}>{filteredCaregivers.length} professionals found</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Filter size={14} color="#64748B" />
                <Text style={styles.sortButtonText}>Sort</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ActivityIndicator size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No caregivers found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  activeFiltersRow: {
    marginBottom: 12,
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  activeFilterText: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
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
  searchIcon: {
    marginRight: 12, 
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#0F766E', 
    borderColor: '#0F766E',
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
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  retryBtn: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0F766E',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },

  // --- CARD STYLES ---
  card: {
    backgroundColor: '#F8FAFC', 
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0F766E', 
    borderRadius: 10,
    padding: 3,
    borderWidth: 2,
    borderColor: '#F8FAFC', 
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', 
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  bioText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metaSeparator: {
    width: 1,
    height: 12,
    backgroundColor: '#94A3B8',
    marginHorizontal: 8,
  },
  
  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F766E', 
  },
  priceUnit: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
    fontWeight: '500',
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniTag: {
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniTagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  moreText: {
    fontSize: 11,
    color: '#64748B', 
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
});