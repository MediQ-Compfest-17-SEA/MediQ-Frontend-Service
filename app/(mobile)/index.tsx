import { useEffect } from "react";

import { useRouter } from "expo-router";
import SplashScreen from "./splash";

export default function IndexSplash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(mobile)/splash2");
    }, 10000); 
    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen/>;
}
