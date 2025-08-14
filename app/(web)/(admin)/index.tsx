import { Text } from "@/components/ui/text/index.web";
import { View } from "react-native";


export default function AdminDashboard(){
    return(
        <View className="flex-1 items-center justify-center bg-primary-500">
            <Text className="font-inter font-black">
                Admin
            </Text>
            <Text className=" text-black text-lg font-light">
                Hello NativeWind + Gluestack + Admin Dashboard
            </Text>
            <Text className="font-montserrat text-black text-lg font-black">
                Admin Dashboard
            </Text>
        </View>
    )
}