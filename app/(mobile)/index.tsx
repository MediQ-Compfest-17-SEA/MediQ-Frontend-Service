import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import SplashScreen from "./splash";

export default function IndexSplash() {
  const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/(mobile)/splash2");
  //   }, 5000); 
  //   return () => clearTimeout(timer);
  // }, []);

  return <SplashScreen/>;
}
