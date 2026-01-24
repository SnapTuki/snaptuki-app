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
  StatusBar
} from 'react-native';
import { 
  Search, 
  Check,
  UserPlus,
  ArrowRight
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_CARE_SERVICES } from '@/src/graphql/queries';

// Data structure containing all required tasks


export default function FindHelpScreen() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {loading, error, data} = useQuery(GET_ALL_CARE_SERVICES);

  let serviceCategories = data?.getAllServiceCategories ?? [];
  console.log(serviceCategories)
  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  if(error){console.log(error)}

  const filteredCategories = serviceCategories.map(cat => ({
    ...cat,
    tasks: cat.serviceTasks.filter(t => 
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.tasks.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Help</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Choose tasks for care</Text>
          {selectedTasks.length > 0 && (
            <TouchableOpacity onPress={() => setSelectedTasks([])}>
              <Text style={styles.clearText}>Clear all ({selectedTasks.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCategories?.map((category) => (
          <View key={category.categoryId} style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{category.categoryName.toUpperCase()}</Text>
            {category.tasks.map((task) => {
              const isSelected = selectedTasks.includes(task.serviceId);
              return (
                <TouchableOpacity
                  key={task.serviceId}
                  activeOpacity={0.8}
                  onPress={() => toggleTask(task.serviceId)}
                  style={[
                    styles.taskCard,
                    isSelected && styles.taskCardSelected
                  ]}
                >
                  <View style={[
                    styles.iconContainer,
                    isSelected ? styles.iconContainerSelected : styles.iconContainerDefault
                  ]}>
                  </View>
                  
                  <View style={styles.taskInfo}>
                    <View style={styles.taskHeaderRow}>
                      <Text style={[
                        styles.taskLabel,
                        isSelected && styles.taskLabelSelected
                      ]}>
                        {task.serviceName}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkBadge}>
                          <Check size={12} color="#FFFFFF" strokeWidth={4} />
                        </View>
                      )}
                    </View>
                    <Text style={[
                      styles.taskDesc,
                      isSelected && styles.taskDescSelected
                    ]}>
                      No description yet
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        
        {/* Buffer for floating button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Action Button */}
      {selectedTasks.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.mainButton} onPress={() => router.push('/(client)/(tabs)/find-help/caregivers')}>
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.mainButtonText}>
              Find Caregivers ({selectedTasks.length})
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1E293B',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  categoryBlock: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.2,
    marginBottom: 12,
    paddingLeft: 4,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  taskCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerDefault: {
    backgroundColor: '#F8FAFC',
  },
  iconContainerSelected: {
    backgroundColor: '#4F46E5',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  taskLabelSelected: {
    color: '#4F46E5',
  },
  taskDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  taskDescSelected: {
    color: '#6366F1',
    opacity: 0.8,
  },
  checkBadge: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  mainButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    marginBottom: 80,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});