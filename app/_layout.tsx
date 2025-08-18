import { Stack } from "expo-router";
import "../styles/global.css";


export default function RootLayout() {


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(mobile)" options={{ headerShown: false }} />
      <Stack.Screen name="(web)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}