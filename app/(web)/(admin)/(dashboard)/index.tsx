import { Text } from '@/components/ui/text';
import axiosClient from '@/lib/axios';
import { loadingAtom, queueDataAtom, statusQueueAtom, userDataAtom } from '@/utils/store';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { ChartBar, MessageCircleX, PersonStanding, Settings } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
    const router = useRouter();
    const [users, setUsers] = useAtom(userDataAtom);
    const [queueData, setQueueData] = useAtom(statusQueueAtom);
    const [loading, setLoading] = useAtom(loadingAtom);

    // Calculate stats from data
    const totalUsers = users?.length || 0;
    const activeQueue = queueData?.filter(item => item.status === 'waiting').length || 0;
    const completedToday = queueData?.filter(item => item.status === 'completed').length || 0;
    const pendingQueue = queueData?.filter(item => item.status === 'onProcess').length || 0;

    const statsData = [
        { title: 'Total Users', value: totalUsers.toString(), icon: 'people', color: '#3B82F6' },
        { title: 'Active Queue', value: activeQueue.toString(), icon: 'queue', color: '#10B981' },
        { title: 'Completed Today', value: completedToday.toString(), icon: 'check-circle', color: '#8B5CF6' },
        { title: 'Pending', value: pendingQueue.toString(), icon: 'schedule', color: '#F59E0B' },
    ];

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get('/users');
            console.log('Users data:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchQueueData = async () => {
        try {
            const response = await axiosClient.get('/queue');
            console.log('Queue data:', response.data);
            setQueueData(response.data);
        } catch (error) {
            console.error('Error fetching queue data:', error);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchUsers(),
                fetchQueueData()
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="p-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-800">Admin Dashboard</Text>
                        <Text className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</Text>
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
                                        <Text className="text-2xl font-bold text-gray-800">
                                            {loading ? '...' : stat.value}
                                        </Text>
                                        <Text className="text-sm text-gray-600 mt-1">{stat.title}</Text>
                                    </View>
                                    <View
                                        className="w-12 h-12 rounded-lg items-center justify-center"
                                        style={{ backgroundColor: stat.color + '20' }}
                                    >
                                        {stat.icon === 'people' && <PersonStanding size={20} color={stat.color} />}
                                        {stat.icon === 'queue' && <MessageCircleX size={20} color={stat.color} />}
                                        {stat.icon === 'check-circle' && <ChartBar size={20} color={stat.color} />}
                                        {stat.icon === 'schedule' && <Settings size={20} color={stat.color} />}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Recent Activity Summary */}
                    <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100" style={{ elevation: 2 }}>
                        <Text className="text-xl font-semibold text-gray-800 mb-4">Today's Summary</Text>
                        <View className="space-y-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600">Users in Waiting List</Text>
                                <Text className="text-lg font-semibold text-blue-600">
                                    {loading ? '...' : activeQueue}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600">Currently Being Served</Text>
                                <Text className="text-lg font-semibold text-orange-600">
                                    {loading ? '...' : pendingQueue}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600">Completed Services</Text>
                                <Text className="text-lg font-semibold text-green-600">
                                    {loading ? '...' : completedToday}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600">Total Registered Users</Text>
                                <Text className="text-lg font-semibold text-purple-600">
                                    {loading ? '...' : totalUsers}
                                </Text>
                            </View>
                        </View>
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
                                <Text className="text-white text-xs mt-1 opacity-80">
                                    {totalUsers} total users
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/(web)/(admin)/(dashboard)/queue')}
                                className="w-[48%] bg-green-500 rounded-lg p-4 mb-3">
                                <MessageCircleX size={24} color="white" />
                                <Text className="text-white font-medium mt-2">View Queue</Text>
                                <Text className="text-white text-xs mt-1 opacity-80">
                                    {activeQueue} waiting
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push('/(web)/(admin)/(dashboard)/settings')}
                                className="w-[48%] bg-purple-500 rounded-lg p-4">
                                <Settings size={24} color="white" />
                                <Text className="text-white font-medium mt-2">Settings</Text>
                                <Text className="text-white text-xs mt-1 opacity-80">
                                    System config
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={fetchDashboardData}
                                className="w-[48%] bg-gray-600 rounded-lg p-4">
                                <ChartBar size={24} color="white" />
                                <Text className="text-white font-medium mt-2">Refresh Data</Text>
                                <Text className="text-white text-xs mt-1 opacity-80">
                                    {loading ? 'Loading...' : 'Update stats'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}