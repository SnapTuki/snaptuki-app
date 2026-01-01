import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack>
      
      <Stack.Screen
        name="booking-requests"
        options={{
          presentation: 'modal',
          headerShown: false
        }}
      />
    </Stack>
  );
}
