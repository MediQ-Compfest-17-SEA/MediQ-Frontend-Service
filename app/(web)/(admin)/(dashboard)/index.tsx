import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChartBar, MessageCircleX, PersonStanding, Settings } from 'lucide-react-native'
import { useRouter } from 'expo-router';
// import { exportToExcel } from '@/utils/exportToExcel';
import { useAtom } from 'jotai';
import { queueDataAtom, userDataAtom } from '@/utils/store';
export default function Dashboard() {
    const router = useRouter();
    const [users] = useAtom(userDataAtom);
    const [queueData] = useAtom(queueDataAtom);
    const statsData = [
        { title: 'Total Users', value: '1,234', icon: 'people', color: '#3B82F6' },
        { title: 'Active Queue', value: '45', icon: 'queue', color: '#10B981' },
        { title: 'Completed Today', value: '78', icon: 'check-circle', color: '#8B5CF6' },
        { title: 'Pending', value: '12', icon: 'schedule', color: '#F59E0B' },
    ];
    const handleExportReport = async () => {
        // await exportToExcel({
        //     fileName: "MediQ-Report",
        //     sheets: [
        //         {
        //             name: "Users",
        //             header: ["ID", "Name", "KTP", "Email", "Phone", "Status"],
        //             rows: users,
        //         },
        //         {
        //             name: "Queue",
        //             header: ["Queue", "Name", "KTP", "Status", "Time", "Type"],
        //             rows: queueData,
        //         },
        //     ],
        // });
    };


    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-6">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-gray-800">Admin Dashboard</Text>
                    <Text className="text-gray-600 mt-1">Welcome back! Heres whats happening today.</Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap justify-between mb-6">
                    {statsData.map((stat, index) => (
                        <TouchableOpacity
                            key={index}
                            className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                            style={{ elevation: 2 }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1">
                                    <Text className="text-2xl font-bold text-gray-800">{stat.value}</Text>
                                    <Text className="text-sm text-gray-600 mt-1">{stat.title}</Text>
                                </View>
                                <View
                                    className="w-12 h-12 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: stat.color + '20' }}
                                >

                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* Quick Actions */}
                <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" style={{ elevation: 2 }}>
                    <Text className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</Text>
                    <View className="flex-row flex-wrap justify-between">
                        <TouchableOpacity
                            onPress={() => router.push('/(web)/(admin)/(dashboard)/users')}
                            className="w-[48%] bg-blue-500 rounded-lg p-4 mb-3">
                            <PersonStanding size={24} color="white" />
                            <Text className="text-white font-medium mt-2">Manage Users</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/(web)/(admin)/(dashboard)/queue')}
                            className="w-[48%] bg-green-500 rounded-lg p-4 mb-3">
                            <MessageCircleX size={24} color="white" />
                            <Text className="text-white font-medium mt-2">View Queue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/(web)/(admin)/(dashboard)/settings')}
                            className="w-[48%] bg-purple-500 rounded-lg p-4">
                            <Settings size={24} color="white" />
                            <Text className="text-white font-medium mt-2">Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleExportReport}
                            className="w-[48%] bg-orange-500 rounded-lg p-4">
                            <ChartBar size={24} color="white" />
                            <Text className="text-white font-medium mt-2">Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
