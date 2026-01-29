import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client/react";
import { GET_CAREGIVER_PROFILE } from "../../../../graphql/queries";
import { CaregiverProfile } from "@/src/types/__generated__/graphql";

export default function CaregiverDetailsScreen() {
    const { caregiverId } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    
    const parsedId = parseInt(Array.isArray(caregiverId) ? caregiverId[0] : caregiverId, 10);

    const { data, loading, error } = useQuery(GET_CAREGIVER_PROFILE, {
        variables: { profileId: parsedId },
        skip: !parsedId,
    });

    if (loading) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error || !data?.getCaregiver) {
        return (
            <View style={[styles.center, { paddingTop: insets.top }]}>
                <Text style={styles.errorText}>
                    {error ? "Error loading profile" : "Caregiver not found"}
                </Text>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const caregiver = data.getCaregiver as CaregiverProfile;

    const calculateExperience = () => {
        if (!caregiver.experience || caregiver.experience.length === 0) return "New";
        const earliestStart = Math.min(...caregiver.experience.map(e => e.startYear));
        const currentYear = new Date().getFullYear();
        return `${currentYear - earliestStart}+ years`;
    };

    return (
        <View style={styles.container}>
            
            {/* --- FIXED HEADER BAR (Back + Book Now) --- */}
            <View style={[styles.topBar, { paddingTop: insets.top }]}>
                <Pressable 
                    style={styles.iconButton} 
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </Pressable>

                <Pressable
                    style={styles.headerBookBtn}
                    onPress={() =>
                        router.push({
                            pathname: "/(client)/(modals)/booking-requests",
                            params: { caregiverId: caregiverId },
                        })
                    }
                >
                    <Text style={styles.headerBookText}>Book Now</Text>
                </Pressable>
            </View>

            <ScrollView
                // Add padding to top so content starts below the fixed header
                contentContainerStyle={{ paddingTop: insets.top + 60, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header Content */}
                <View style={styles.headerContent}>
                    <View style={styles.profileRow}>
                        <Image 
                            source={{ uri: caregiver.profilePhotoUrl || 'https://via.placeholder.com/150' }} 
                            style={styles.avatar} 
                        />
                        <View style={styles.headerInfo}>
                            <Text style={styles.name}>
                                {caregiver.firstName} {caregiver.lastName}
                            </Text>
                            
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={16} color="#facc15" />
                                <Text style={styles.ratingText}>
                                    {caregiver.rating?.toFixed(1) || "New"} 
                                    {caregiver.reviews?.length ? ` (${caregiver.reviews.length} reviews)` : ""}
                                </Text>
                            </View>

                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={14} color="#64748b" />
                                <Text style={styles.location}>{caregiver.city || "Finland"}</Text>
                            </View>
                            
                            {/* Price moved here since bottom bar is gone */}
                            <Text style={styles.priceText}>
                                €{caregiver.hourlyRate}/hr
                            </Text>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <StatItem 
                            label="Experience" 
                            value={calculateExperience()} 
                            icon="briefcase-outline" 
                        />
                        <StatItem 
                            label="Verified" 
                            value={caregiver.verified ? "Yes" : "Pending"} 
                            icon="shield-checkmark-outline" 
                        />
                        <StatItem 
                            label="Jobs" 
                            value={`${caregiver.completedJobsCount}`} 
                            icon="checkmark-circle-outline" 
                        />
                    </View>
                </View>

                {/* Content Sections */}
                <Section title="About">
                    <Text style={styles.aboutText}>{caregiver.bio || "No bio provided."}</Text>
                </Section>

                <Section title="Skills & Services">
                    <View style={styles.tagContainer}>
                        {caregiver.skills?.map((skill) => (
                            <View key={`skill-${skill.id}`} style={styles.tag}>
                                <Text style={styles.tagText}>{skill.title}</Text>
                            </View>
                        ))}
                        {caregiver.offeredServices?.map((service) => (
                            <View key={`service-${service.serviceId}`} style={[styles.tag, styles.serviceTag]}>
                                <Text style={[styles.tagText, styles.serviceTagText]}>
                                    {service.serviceName}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Section>

                {caregiver.experience && caregiver.experience.length > 0 && (
                    <Section title="Work Experience">
                        {caregiver.experience.map((exp) => (
                            <View key={exp.id} style={styles.timelineItem}>
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineRole}>{exp.role}</Text>
                                    <Text style={styles.timelineOrg}>{exp.organization || "Private Family"}</Text>
                                    <Text style={styles.timelineDate}>{exp.startYear} - {exp.endYear || "Present"}</Text>
                                    {exp.description && <Text style={styles.timelineDesc}>{exp.description}</Text>}
                                </View>
                            </View>
                        ))}
                    </Section>
                )}

                {caregiver.education && caregiver.education.length > 0 && (
                    <Section title="Education">
                        {caregiver.education.map((edu) => (
                            <View key={edu.id} style={styles.eduItem}>
                                <Ionicons name="school-outline" size={20} color="#64748b" />
                                <View>
                                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                                    <Text style={styles.eduInst}>{edu.institution}, {edu.graduationYear}</Text>
                                </View>
                            </View>
                        ))}
                    </Section>
                )}

                {caregiver.reviews && caregiver.reviews.length > 0 && (
                    <Section title="Recent Reviews">
                        {caregiver.reviews.map((review) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewAuthor}>{review.reviewerName || "Client"}</Text>
                                    <View style={styles.miniRating}>
                                        <Ionicons name="star" size={12} color="#facc15" />
                                        <Text style={styles.miniRatingText}>{review.rating}</Text>
                                    </View>
                                </View>
                                {review.comment && <Text style={styles.reviewText}>"{review.comment}"</Text>}
                            </View>
                        ))}
                    </Section>
                )}
            </ScrollView>
        </View>
    );
}

// ... Sub-components ...
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
}

function StatItem({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
    return (
        <View style={styles.statItem}>
            <View style={styles.statIconBox}>
                <Ionicons name={icon} size={20} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: { color: "#ef4444", marginBottom: 10, fontWeight: "500" },
    backBtn: { padding: 10 },
    backBtnText: { color: "#2563eb", fontWeight: "600" },
    
    // --- Fixed Top Bar ---
    topBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: "rgba(248, 250, 252, 0.95)", // Slightly transparent background
        borderBottomWidth: 1,
        borderColor: "#e2e8f0",
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    headerBookBtn: {
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    headerBookText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    // --- Header Content ---
    headerContent: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 24,
        paddingTop: 10,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginRight: 16, borderWidth: 3, borderColor: "#f1f5f9" },
    headerInfo: { flex: 1 },
    name: { fontSize: 22, fontWeight: "700", color: "#0f172a", marginBottom: 4 },
    ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    ratingText: { marginLeft: 6, color: "#475569", fontWeight: "600", fontSize: 14 },
    locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
    location: { color: "#64748b", fontSize: 14 },
    priceText: { fontSize: 18, fontWeight: "700", color: "#2563eb" },

    statsGrid: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f8fafc", borderRadius: 16, padding: 16 },
    statItem: { alignItems: "center", flex: 1 },
    statIconBox: { backgroundColor: "#e0e7ff", padding: 8, borderRadius: 12, marginBottom: 8 },
    statValue: { fontWeight: "700", fontSize: 14, color: "#0f172a" },
    statLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
    
    // --- Other Sections ---
    section: { paddingHorizontal: 20, paddingTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginBottom: 12 },
    aboutText: { color: "#334155", lineHeight: 24, fontSize: 15 },
    tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: { backgroundColor: "#f1f5f9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    serviceTag: { backgroundColor: "#e0f2fe" },
    tagText: { color: "#475569", fontSize: 13, fontWeight: "500" },
    serviceTagText: { color: "#0284c7" },
    timelineItem: { flexDirection: "row", marginBottom: 16 },
    timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563eb", marginTop: 6, marginRight: 12 },
    timelineContent: { flex: 1, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
    timelineRole: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
    timelineOrg: { fontSize: 14, color: "#475569" },
    timelineDate: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
    timelineDesc: { fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 20 },
    eduItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "#f1f5f9", gap: 12 },
    eduDegree: { fontSize: 14, fontWeight: "600", color: "#0f172a" },
    eduInst: { fontSize: 13, color: "#64748b" },
    reviewCard: { backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#f1f5f9" },
    reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    reviewAuthor: { fontWeight: "600", fontSize: 14, color: "#0f172a" },
    miniRating: { flexDirection: "row", alignItems: "center", gap: 4 },
    miniRatingText: { fontSize: 12, fontWeight: "700", color: "#475569" },
    reviewText: { color: "#334155", fontStyle: "italic", lineHeight: 20 },
});