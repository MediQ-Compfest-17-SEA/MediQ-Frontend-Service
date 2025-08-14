// app/(mobile)/_layout.tsx
import { Stack } from "expo-router";
export default function MobileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}