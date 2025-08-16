// app/(mobile)/landing.tsx
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function Splash2() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
        Selamat Datang di Sistem Antrian Kesehatan
      </Text>
      <Text className="text-gray-500 text-center mb-10">
        Daftar dengan mudah menggunakan KTP Anda
      </Text>
      <Button
        size="lg"
        // className="w-full rounded-2xl bg-blue-600"
        variant="solid"
        onPress={() => router.push("/(mobile)/(home)/landing")}
      >
        <Text>Mulai Daftar via KTP</Text>
      </Button>
    </View>
  );
}
