import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import {
  Inter_900Black,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';


export default function LeaderboardLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': Inter_900Black,
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });
  
  if (!fontsLoaded) {
    return null; 
  }
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
