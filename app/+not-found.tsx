import { View, Text } from 'react-native';


export default function NotFoundScreen(){
    return (
        <View className="flex-1 items-center justify-center bg-primary-500">
            <Text className="text-center text-2xl font-bold text-white">
                Page Not Found
            </Text>
            <Text className="text-center text-lg text-white mt-2">
                The page you are looking for does not exist.
            </Text>
        </View>
    );
}