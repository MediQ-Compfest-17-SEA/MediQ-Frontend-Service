import { Redirect } from "expo-router";
import { Platform } from "react-native";

export default function Index() {
  const isMobile = Platform.OS !== "web";

  console.log('Index - Platform details:', {
    OS: Platform.OS,
    Version: Platform.Version,
    isTV: Platform.isTV,
  });
  console.log('Redirecting based on platform:', isMobile ? 'Mobile' : 'Web');
  if (isMobile) {
    return <Redirect href="/(mobile)" />;
  } else {
    return <Redirect href="/(web)/(admin)" />;
  }
}