import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MobileLayout() {
  return (
    <SafeAreaView 
    style={{flex: 1, backgroundColor:'white'}}
    edges={['top', 'bottom']}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}
