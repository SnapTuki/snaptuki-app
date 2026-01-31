import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  LayoutAnimation,
  UIManager
} from 'react-native';
import {
  Search,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_CARE_SERVICES } from '@/src/graphql/queries';
import { useSelectedServices } from '@/src/hooks/useSelectedservices';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FindHelpScreen() {
  // Use Context instead of local state
  const { selectedServices, addService, removeService } = useSelectedServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const { loading, error, data } = useQuery(GET_ALL_CARE_SERVICES);

  let serviceCategories = data?.getAllServiceCategories ?? [];

  const toggleTask = (service: { id: number, title: string }) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);

    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const toggleCategory = (categoryId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearSelection = () => {
    selectedServices.forEach(obj => removeService(obj.id));
  };

  // Filter categories and tasks based on search
  const filteredCategories = serviceCategories.map((cat: any) => ({
    ...cat,
    tasks: cat.serviceTasks.filter((t: any) =>
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter((cat: any) => cat.tasks.length > 0);

  // Auto-expand categories if searching
  React.useEffect(() => {
    if (searchQuery.length > 0) {
      setExpandedCategories(filteredCategories.map((c: any) => parseInt(c.categoryId)));
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- Elegant Header --- */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Find Care Services</Text>
          {selectedServices.length > 0 && (
            <TouchableOpacity onPress={clearSelection} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear ({selectedServices.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchWrapper}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for care (e.g., 'Nursing')..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* --- Service Content --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories?.map((category: any) => {
          const catId = parseInt(category.categoryId);
          const isExpanded = expandedCategories.includes(catId);
          const hasSelectedTasks = category.tasks.some((t: any) =>
            selectedServices.some(s => s.id === parseInt(t.serviceId))
          );

          return (
            <View key={category.categoryId} style={styles.categoryCard}>
              {/* Expandable Header */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleCategory(catId)}
                style={[
                  styles.categoryHeader,
                  isExpanded && styles.categoryHeaderExpanded,
                  hasSelectedTasks && styles.categoryHeaderActive
                ]}
              >
                <View style={styles.categoryTitleRow}>
                  <View style={[styles.iconBox, hasSelectedTasks && styles.iconBoxActive]}>
                    <HeartHandshake size={20} color={hasSelectedTasks ? "#fff" : "#0d9488"} />
                  </View>
                  <Text style={[styles.categoryTitle, hasSelectedTasks && styles.categoryTitleActive]}>
                    {category.categoryName}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronUp size={20} color={hasSelectedTasks ? "#0f766e" : "#94a3b8"} />
                ) : (
                  <ChevronDown size={20} color={hasSelectedTasks ? "#0f766e" : "#94a3b8"} />
                )}
              </TouchableOpacity>

              {/* Tasks List (Conditional Render) */}
              {isExpanded && (
                <View style={styles.tasksContainer}>
                  {category.tasks.map((task: any) => {
                    const taskId = parseInt(task.serviceId);
                    const isSelected = selectedServices.some((s) => s.id === taskId);
                    return (
                      <TouchableOpacity
                        key={task.serviceId}
                        activeOpacity={0.7}
                        onPress={() => toggleTask({ id: taskId, title: task.serviceName })}
                        style={[
                          styles.taskRow,
                          isSelected && styles.taskRowSelected
                        ]}
                      >
                        <Text style={[
                          styles.taskLabel,
                          isSelected && styles.taskLabelSelected
                        ]}>
                          {task.serviceName}
                        </Text>

                        <View style={[
                          styles.checkbox,
                          isSelected ? styles.checkboxSelected : styles.checkboxDefault
                        ]}>
                          {isSelected && <CheckCircle2 size={18} color="#fff" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Floating Action Button --- */}
      {selectedServices.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.9}
            onPress={() => router.push('/(client)/(tabs)/find-help/caregivers')}
          >
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{selectedServices.length}</Text>
            </View>
            <Text style={styles.fabText}>See Available Caregivers</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDFA', // Very light teal background
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#0F766E', // Teal shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#134E4A', // Deep Teal
    letterSpacing: -0.5,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },

  // Content
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Category Card (Large Item)
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',

  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',

  },
  categoryHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryHeaderActive: {
    backgroundColor: '#F0FDFA', // Subtle tint if items selected inside
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow row to expand
    marginRight: 10, // Avoid overlapping arrow
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0, // Prevent icon from shrinking
  },
  iconBoxActive: {
    backgroundColor: '#0d9488', // Solid teal when active
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    flex: 1, // Allow text to wrap
    flexWrap: 'wrap', // Enable wrapping
  },
  categoryTitleActive: {
    color: '#0f766e',
  },

  // Tasks List inside Category
  tasksContainer: {
    backgroundColor: '#FAFAFA', // Slightly darker inside
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  taskRowSelected: {
    backgroundColor: '#F0FDFA',
  },
  taskLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
    flex: 1,
    marginRight: 10,
    flexWrap: 'wrap', // Enable wrapping for task items too
  },
  taskLabelSelected: {
    color: '#0f766e',
    fontWeight: '600',
  },

  // Checkbox Style
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Prevent checkbox from shrinking
  },
  checkboxDefault: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#0D9488', // Solid Teal
    borderColor: '#0D9488',
  },

  // Floating Action Button
  fabContainer: {
    position: 'absolute',
    bottom: 120, // Adjusted to sit above tab bar
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A', // Dark Slate
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 32,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    width: '100%',
  },
  fabBadge: {
    backgroundColor: '#2DD4BF', // Teal 400
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 12,
  },
  fabBadgeText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  fabText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
});