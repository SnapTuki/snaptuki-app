import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Linking,
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Types ---
interface ContactOptionProps {
  label: string;
  subLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// --- Mock Data ---
const FAQS = [
  {
    question: "How do I add a new caregiver?",
    answer: "Go to the 'Connect' tab and tap the (+) icon in the top right corner. You can invite them via email or phone number."
  },
  {
    question: "I forgot my password.",
    answer: "On the login screen, tap 'Forgot Password'. We will send a secure reset link to your registered email address."
  },
  {
    question: "How do I update billing info?",
    answer: "Navigate to Profile > Account Settings > Payment Methods to update your credit card or insurance information."
  },
  {
    question: "Is my health data private?",
    answer: "Yes. We are fully HIPAA compliant. Your data is encrypted and only shared with the caregivers you explicitly approve."
  }
];

// --- Helper Components ---

const ContactCard: React.FC<ContactOptionProps> = ({ label, subLabel, icon, color, onPress }) => (
  <TouchableOpacity 
    style={styles.contactCard} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.contactTextContainer}>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactSubLabel}>{subLabel}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
  </TouchableOpacity>
);

const FAQAccordion: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity 
        style={styles.faqHeader} 
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={[styles.faqQuestion, expanded && styles.faqQuestionActive]}>
          {question}
        </Text>
        <Ionicons 
          name={expanded ? "remove-circle-outline" : "add-circle-outline"} 
          size={22} 
          color={expanded ? '#10b981' : '#94a3b8'} 
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

// --- Main Screen Component ---

export default function SupportScreen() {
  const router = useRouter();

  const handlePhoneCall = () => Linking.openURL('tel:+15550009999');
  const handleEmail = () => Linking.openURL('mailto:support@eldercareapp.com');
  const handleLiveChat = () => console.log('Open Chat Modal');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Help & Support',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Intro Text */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>How can we help you?</Text>
          <Text style={styles.headerSubtitle}>
            Our team is available 24/7 for medical and technical assistance.
          </Text>
        </View>

        {/* Primary Contact Channels */}
        <View style={styles.sectionContainer}>
          <ContactCard 
            label="Call Support Line" 
            subLabel="Wait time: < 2 min" 
            icon="call" 
            color="#10b981" // Emerald
            onPress={handlePhoneCall}
          />
          <ContactCard 
            label="Live Chat" 
            subLabel="Available now" 
            icon="chatbubbles" 
            color="#3b82f6" // Blue
            onPress={handleLiveChat}
          />
          <ContactCard 
            label="Email Us" 
            subLabel="Response within 24h" 
            icon="mail" 
            color="#8b5cf6" // Purple
            onPress={handleEmail}
          />
        </View>

        {/* FAQ Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.cardGroup}>
            {FAQS.map((faq, index) => (
              <FAQAccordion 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </View>
        </View>

        {/* Ticket History Button */}
        <TouchableOpacity style={styles.ticketButton}>
          <Text style={styles.ticketButtonText}>View My Support Tickets</Text>
          <Ionicons name="receipt-outline" size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            If this is a medical emergency, please dial 911 immediately.
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
  
  // Header
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },

  // Contact Cards
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  contactSubLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },

  // FAQ Accordion
  cardGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  faqContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
    marginRight: 12,
  },
  faqQuestionActive: {
    color: '#10b981', // Emerald highlight when open
  },
  faqBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f8fafc', // Slight contrast for answer area
  },
  faqAnswer: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },

  // Footer Buttons
  ticketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    marginBottom: 30,
  },
  ticketButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 8,
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    textAlign: 'center',
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
  },
});