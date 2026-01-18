import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Alert,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- Types ---
interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// --- Mock Data ---
const CURRENT_PLAN = {
  name: "Premium Care Plus",
  price: "$199.00",
  period: "per month",
  renewalDate: "Oct 22, 2025",
  features: ["24/7 Monitoring", "Daily Vitals Check", "Priority Support"]
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'Mastercard', last4: '8839', expiry: '09/25', isDefault: false },
];

const TRANSACTIONS: Transaction[] = [
  { id: 'INV-001', date: 'Sep 22, 2025', amount: '$199.00', status: 'Paid', description: 'Monthly Subscription' },
  { id: 'INV-002', date: 'Aug 22, 2025', amount: '$199.00', status: 'Paid', description: 'Monthly Subscription' },
  { id: 'INV-003', date: 'Aug 10, 2025', amount: '$50.00', status: 'Pending', description: 'Specialist Consultation' },
];

// --- Helper Components ---

const TransactionItem = ({ item }: { item: Transaction }) => {
  const statusColor = 
    item.status === 'Paid' ? '#10b981' : 
    item.status === 'Pending' ? '#f59e0b' : '#ef4444';

  return (
    <View style={styles.transactionRow}>
      <View style={styles.transactionIcon}>
        <Ionicons 
          name={item.description.includes('Subscription') ? "sync" : "medical"} 
          size={20} 
          color="#64748b" 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transDesc}>{item.description}</Text>
        <Text style={styles.transDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmountCol}>
        <Text style={styles.transAmount}>{item.amount}</Text>
        <Text style={[styles.transStatus, { color: statusColor }]}>{item.status}</Text>
      </View>
    </View>
  );
};

const CardItem = ({ method, onDelete }: { method: PaymentMethod; onDelete: () => void }) => (
  <View style={styles.cardItem}>
    <View style={styles.cardLeft}>
      <View style={styles.cardLogo}>
        <FontAwesome5 
          name={method.type === 'Visa' ? 'cc-visa' : 'cc-mastercard'} 
          size={24} 
          color="#1e293b" 
        />
      </View>
      <View>
        <Text style={styles.cardText}>•••• •••• •••• {method.last4}</Text>
        <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
      </View>
    </View>
    <View style={styles.cardRight}>
      {method.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Default</Text>
        </View>
      )}
      {!method.isDefault && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
           <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// --- Main Screen Component ---

export default function PaymentScreen() {
  const router = useRouter();

  const handleAddCard = () => Alert.alert("Add Card", "Opens secure payment gateway...");
  const handleDownloadInvoice = (id: string) => Alert.alert("Download", `Downloading Invoice #${id}`);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Billing & Payments',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerTintColor: '#0f172a',
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Section 1: Active Subscription Plan */}
        <Text style={styles.sectionTitle}>Current Plan</Text>
        <LinearGradient
          colors={['#059669', '#10b981']} // Emerald Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCard}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>{CURRENT_PLAN.name}</Text>
              <Text style={styles.planRenewal}>Renews on {CURRENT_PLAN.renewalDate}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>

          <View style={styles.planPriceContainer}>
            <Text style={styles.planPrice}>{CURRENT_PLAN.price}</Text>
            <Text style={styles.planPeriod}>/{CURRENT_PLAN.period}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {CURRENT_PLAN.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#ecfdf5" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.managePlanBtn} activeOpacity={0.8}>
            <Text style={styles.managePlanText}>Manage Subscription</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Section 2: Payment Methods */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity onPress={handleAddCard}>
            <Text style={styles.addBtnText}>+ Add New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteCard}>
          {PAYMENT_METHODS.map((method, index) => (
            <React.Fragment key={method.id}>
              <CardItem 
                method={method} 
                onDelete={() => Alert.alert("Remove Card", "Are you sure?")} 
              />
              {index < PAYMENT_METHODS.length - 1 && <View style={styles.cardDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Section 3: Transaction History */}
        <Text style={styles.sectionTitle}>Billing History</Text>
        <View style={styles.whiteCard}>
          {TRANSACTIONS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => handleDownloadInvoice(item.id)}
              activeOpacity={0.7}
            >
              <TransactionItem item={item} />
              {index < TRANSACTIONS.length - 1 && <View style={styles.cardDivider} />}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Transactions</Text>
            <Ionicons name="arrow-forward" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Security Footer */}
        <View style={styles.securityFooter}>
          <Ionicons name="lock-closed" size={14} color="#94a3b8" />
          <Text style={styles.securityText}>
            Payments are processed securely via Stripe. Your financial data is encrypted.
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 24,
    marginBottom: 12,
  },
  addBtnText: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 14,
  },

  // Plan Card Styles
  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  planRenewal: {
    color: '#d1fae5',
    fontSize: 12,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  planPrice: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  planPeriod: {
    color: '#d1fae5',
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  managePlanBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  managePlanText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },

  // General Card Container
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 60, // Indent divider for sleek look
  },

  // Payment Methods
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  cardExpiry: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 8,
  },

  // Transactions
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  transDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  transactionAmountCol: {
    alignItems: 'flex-end',
  },
  transAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  transStatus: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  viewAllBtn: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  viewAllText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },

  // Footer
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: '80%',
  },
});