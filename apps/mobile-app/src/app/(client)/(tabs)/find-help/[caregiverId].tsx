import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CaregiverDetailsScreen() {
  const { caregiverId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Mock data (replace with API)
  const caregiver = {
    id: caregiverId,
    name: "Sarah Ahmed",
    rating: 4.8,
    reviews: 126,
    experience: "6 years",
    hourlyRate: "$18 / hour",
    location: "Berlin, Germany",
    avatar:
      "https://i.pravatar.cc/300?img=47",
    specialties: ["Elder Care", "Post-Surgery", "Dementia"],
    about:
      "I am a certified caregiver with over 6 years of experience working with elderly patients and individuals with special needs. I focus on compassionate, respectful, and reliable care.",
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: caregiver.avatar }} style={styles.avatar} />

          <View style={styles.headerInfo}>
            <Text style={styles.name}>{caregiver.name}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#facc15" />
              <Text style={styles.ratingText}>
                {caregiver.rating} ({caregiver.reviews} reviews)
              </Text>
            </View>

            <Text style={styles.location}>{caregiver.location}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.cardRow}>
          <InfoCard
            icon="briefcase-outline"
            label="Experience"
            value={caregiver.experience}
          />
          <InfoCard
            icon="cash-outline"
            label="Rate"
            value={caregiver.hourlyRate}
          />
        </View>

        {/* Specialties */}
        <Section title="Specialties">
          <View style={styles.tagContainer}>
            {caregiver.specialties.map((item) => (
              <View key={item} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* About */}
        <Section title="About">
          <Text style={styles.aboutText}>{caregiver.about}</Text>
        </Section>

        {/* Reviews Preview */}
        <Section title="Reviews">
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              “Very kind and professional. Took excellent care of my mother.”
            </Text>
            <Text style={styles.reviewAuthor}>— Anna M.</Text>
          </View>

          <Pressable>
            <Text style={styles.viewAll}>View all reviews</Text>
          </Pressable>
        </Section>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom || 12 },
        ]}
      >
        <Pressable
          style={[styles.button, styles.messageButton]}
          onPress={() =>
            router.push(`/(client)/(tabs)/dm`)
          }
        >
          <Ionicons name="chatbubble-outline" size={18} color="#0f172a" />
          <Text style={styles.messageText}>Message</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.bookButton]}
          onPress={() =>
            router.push(
              `/(client)/(tabs)/bookings?caregiverId=${caregiver.id}`
            )
          }
        >
          <Text style={styles.bookText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- Components ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={20} color="#2563eb" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 6,
    color: "#334155",
  },
  location: {
    marginTop: 4,
    color: "#64748b",
  },

  cardRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  infoLabel: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 12,
  },
  infoValue: {
    marginTop: 4,
    fontWeight: "600",
    color: "#0f172a",
  },

  section: {
    padding: 16,
    marginTop: 12,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0f172a",
  },

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#3730a3",
    fontSize: 12,
  },

  aboutText: {
    color: "#334155",
    lineHeight: 20,
  },

  reviewCard: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 10,
  },
  reviewText: {
    color: "#0f172a",
    fontStyle: "italic",
  },
  reviewAuthor: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 12,
  },
  viewAll: {
    marginTop: 8,
    color: "#2563eb",
    fontWeight: "500",
  },

  bottomBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 80,
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginHorizontal: 4,
  },
  messageButton: {
    backgroundColor: "#f1f5f9",
  },
  bookButton: {
    backgroundColor: "#2563eb",
  },
  messageText: {
    marginLeft: 6,
    fontWeight: "600",
    color: "#0f172a",
  },
  bookText: {
    fontWeight: "600",
    color: "#fff",
  },
});
