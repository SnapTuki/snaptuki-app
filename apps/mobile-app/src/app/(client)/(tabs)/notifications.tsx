import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Caregiver Assigned",
    description:
      "A caregiver has been assigned to John Doe for tomorrow’s visit.",
    createdAt: "Today · 09:45",
    isRead: false,
  },
  {
    id: "2",
    title: "Care Completed",
    description:
      "Morning care tasks were successfully completed.",
    createdAt: "Yesterday · 11:20",
    isRead: true,
  },
  {
    id: "3",
    title: "Booking Confirmed",
    description:
      "Your booking for March 20 has been confirmed.",
    createdAt: "Mar 18 · 14:10",
    isRead: true,
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <NotificationCard notification={item} />
        )}
      />
    </View>
  );
}

function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <Pressable
      style={[
        styles.card,
        !notification.isRead && styles.unreadCard,
      ]}
      onPress={() => {
        // 🔜 mark as read + navigate if needed
      }}
    >
      <View style={styles.iconWrapper}>
        <Ionicons
          name="notifications"
          size={20}
          color="#0a7ea4"
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            !notification.isRead && styles.unreadTitle,
          ]}
        >
          {notification.title}
        </Text>

        <Text style={styles.description}>
          {notification.description}
        </Text>

        <Text style={styles.time}>
          {notification.createdAt}
        </Text>
      </View>

      {!notification.isRead && (
        <View style={styles.unreadDot} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  list: {
    padding: 16,
  },

  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  unreadCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  unreadTitle: {
    color: "#0a7ea4",
  },

  description: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },

  time: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0a7ea4",
    alignSelf: "center",
    marginLeft: 8,
  },
});
