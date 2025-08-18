import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
export default function MobileLayout() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
      <Stack screenOptions={{ headerShown: false }} />;
    </SafeAreaView>
  )
}
