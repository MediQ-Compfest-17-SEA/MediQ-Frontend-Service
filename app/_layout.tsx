import { Stack } from "expo-router";
import "../styles/global.css";
import { Platform } from "react-native";

export default function RootLayout() {

  console.log(Platform.OS);
  console.log(console.log('RootLayout - Platform details:', {
    OS: Platform.OS,
    Version: Platform.Version,
    isTV: Platform.isTV,
  }));
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(mobile)" options={{ headerShown: false }} />
      <Stack.Screen name="(web)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}