import { Stack } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import "../styles/global.css";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isMobile = Platform.OS !== "web" || width <= 1024;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isMobile ? (
        <Stack.Screen name="(mobile)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(web)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
