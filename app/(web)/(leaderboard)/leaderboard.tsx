import React, { useState, useEffect } from 'react';
import { View, ScrollView, Animated, StatusBar, Text } from 'react-native';
import {
  Heart,
  Activity,
  Clock,
  CheckCircle,
  User,
  Monitor
} from 'lucide-react-native';
import { QueueItem } from '@/Interfaces/IQueue';
import socket from '@/lib/socket';


export default function Leaderboard() {
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));

  // Mock data untuk demo - nanti diganti dengan WebSocket
  const mockQueueData = [
    { id: 1, number: 'A001', name: 'John Doe', status: 'current', doctor: 'Dr. Smith', estimatedTime: '10:30' },
    { id: 2, number: 'A002', name: 'Jane Smith', status: 'waiting', doctor: 'Dr. Smith', estimatedTime: '10:45' },
    { id: 3, number: 'A003', name: 'Bob Johnson', status: 'waiting', doctor: 'Dr. Johnson', estimatedTime: '11:00' },
    { id: 4, number: 'B001', name: 'Alice Brown', status: 'current', doctor: 'Dr. Williams', estimatedTime: '10:35' },
    { id: 5, number: 'B002', name: 'Charlie Wilson', status: 'waiting', doctor: 'Dr. Williams', estimatedTime: '10:50' },
    { id: 6, number: 'C001', name: 'Diana Prince', status: 'completed', doctor: 'Dr. Davis', estimatedTime: '10:15' },
  ];

  useEffect(() => {
    
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Fade animation for queue updates
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    return () => {
      // if (ws) ws.close();
      clearInterval(timeInterval);
    };
  }, [pulseAnim, fadeAnim]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-blue-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current':
        return <Activity size={24} color="white" />;
      case 'waiting':
        return <Clock size={24} color="white" />;
      case 'completed':
        return <CheckCircle size={24} color="white" />;
      default:
        return <User size={24} color="white" />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />  
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-200">
        <View className="flex-row items-center justify-between px-8 py-6">
          {/* Logo & Title */}
          <View className="flex-row items-center">
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }]
              }}
              className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mr-4"
            >
              <Heart size={28} color="white" />
            </Animated.View>
            <View>
              <Text className="text-gray-800 text-3xl font-bold">MediQ</Text>
              <Text className="text-gray-600 text-lg">Sistem Antrean Digital</Text>
            </View>
          </View>

          {/* Current Time & Status */}
          <View className="items-end">
            <Text className="text-gray-800 text-2xl font-bold font-mono">
              {formatTime(currentTime)}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text className="text-gray-600 text-base">
                {isConnected ? 'Terhubung' : 'Tidak Terhubung'}
              </Text>
              <Monitor size={20} color="#6B7280" className="ml-2" />
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-8 py-6">
        {/* Current Queue Section */}
        {currentQueue && (
          <View className="mb-8">
            <Text className="text-gray-800 text-2xl font-bold mb-4">Sedang Dilayani</Text>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }]
              }}
              className="bg-blue-500 rounded-3xl p-6 shadow-lg"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mr-4">
                    <Activity size={32} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-3xl font-bold">{currentQueue.number}</Text>
                    <Text className="text-blue-100 text-lg">{currentQueue.name}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-white text-xl font-bold">{currentQueue.estimatedTime}</Text>
                  <Text className="text-blue-200 text-base">Estimasi</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Queue List */}
        <View>
          <Text className="text-gray-800 text-2xl font-bold mb-4">Daftar Antrean</Text>
          
          <View className="space-y-4">
            {queueData.map((queue, index) => (
              <Animated.View
                key={queue.id}
                style={{
                  opacity: queue.status === 'onProcess' ? fadeAnim : 1,
                }}
                className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    {/* Status Badge */}
                    <View className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${getStatusColor(queue.status)}`}>
                      {getStatusIcon(queue.status)}
                    </View>
                    
                    {/* Queue Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-gray-800 text-xl font-bold mr-3">{queue.number}</Text>
                        {queue.status === 'onProcess' && (
                          <View className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-blue-600 text-sm font-medium">Sedang Dilayani</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-600 text-base mt-1">{queue.name}</Text>
                    </View>
                  </View>
                  
                  {/* Time & Position */}
                  <View className="items-end">
                    <Text className="text-gray-800 text-lg font-bold">{queue.estimatedTime}</Text>
                    <Text className="text-gray-500 text-sm">#{index + 1}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {queueData.length === 0 && (
          <View className="items-center justify-center py-16">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Clock size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-600 text-xl font-medium mb-2">Tidak Ada Antrean</Text>
            <Text className="text-gray-500 text-base text-center">
              Belum ada pasien yang mendaftar{'\n'}antrean hari ini
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View className="bg-white border-t border-gray-200 px-8 py-4">
        <Text className="text-gray-400 text-sm text-center">
          © 2024 MediQ Healthcare Solutions - TV Display Mode
        </Text>
      </View>
    </View>
  );
}