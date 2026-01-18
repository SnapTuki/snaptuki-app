import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";

type Message = {
  id: string;
  text: string;
  sender: "ME" | "THEM";
  timestamp: string;
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Good morning, I have arrived at the elder’s home.",
    sender: "THEM",
    timestamp: "09:00",
  },
  {
    id: "2",
    text: "Thank you. Please keep me updated.",
    sender: "ME",
    timestamp: "09:02",
  },
  {
    id: "3",
    text: "Morning care tasks are completed successfully.",
    sender: "THEM",
    timestamp: "10:15",
  },
];

export default function DMDetailScreen() {
  const { dmId } = useLocalSearchParams();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;
    // 🔜 Hook GraphQL send message mutation here
    setMessage("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Conversation",
          headerTitleAlign: "center",
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages */}
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
          renderItem={({ item }) => (
            <MessageBubble message={item} />
          )}
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
          <Pressable
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Ionicons
              name="send"
              size={18}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "ME";

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isMe ? styles.alignRight : styles.alignLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text style={styles.text}>{message.text}</Text>
        <Text style={styles.time}>{message.timestamp}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  messages: {
    padding: 16,
  },

  bubbleWrapper: {
    marginBottom: 10,
    maxWidth: "78%",
  },

  alignRight: {
    alignSelf: "flex-end",
  },

  alignLeft: {
    alignSelf: "flex-start",
  },

  bubble: {
    padding: 12,
    borderRadius: 16,
  },

  myBubble: {
    backgroundColor: "#0a7ea4",
    borderTopRightRadius: 4,
  },

  theirBubble: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  text: {
    fontSize: 14,
    color: "#111827",
  },

  time: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },

  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
    color: "#111827",
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
  },
});
