import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 font-mobile items-center justify-center bg-primary-500">
      <Text className="font-inter-light text-lg">Inter Light Text</Text>
      <Text className="font-inter-regular text-xl">Inter Regular Text</Text>
      <Text className="font-inter-medium text-lg">Inter Medium Text</Text>
      <Text className="font-inter-semibold text-xl">Inter SemiBold Text</Text>
      <Text className="font-inter-bold text-2xl">Inter Bold Text</Text>
      <Text className="font-montserrat-light text-lg">Montserrat Light Text</Text>
      <Text className="font-montserrat-regular text-xl">Montserrat Regular Text</Text>
      <Text className="font-montserrat-medium text-lg">Montserrat Medium Text</Text>
      <Text className="font-montserrat-semibold text-xl">Montserrat SemiBold Text</Text>
      <Text className="font-montserrat-bold text-2xl">Montserrat Bold Text</Text>
    </View>
  );
}
