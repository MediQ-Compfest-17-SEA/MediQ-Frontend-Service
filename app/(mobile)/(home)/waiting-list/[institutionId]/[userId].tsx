import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Heart,
  Activity,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react-native';
import axiosClient from '@/lib/axios';
import { useAtom } from 'jotai';
import { loadingAtom, userQueueAtom } from '@/utils/store';
import { useLocalSearchParams } from 'expo-router';
import { QueueItem } from '@/Interfaces/IQueue';
import socket from '@/lib/socket';

export default function WaitingListScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [refreshRotation] = useState(new Animated.Value(0));
  const { userId, institutionId } = useLocalSearchParams<{ userId: string, institutionId: string }>();
  const [queueData, setQueueData] = useAtom(userQueueAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  const currentUser = queueData.find((item) => item.id === userId);
  const waitingUsers = queueData.filter((user: QueueItem) => user.status === 'waiting');
  const currentUserIndex = waitingUsers.findIndex(user => user.id === currentUser?.id);
  const remainingQueue = currentUserIndex >= 0 ? currentUserIndex : 0;

  const queueList = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/queue?institutionId=${institutionId}`);
      console.log(response.data);
      setQueueData(response.data);
      return response.data;
    } catch (e) {
      console.error("Error Queue fetching queue data:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    //render list
    queueList();
    
    // Initialize WebSocket connection
    socket.connect();
    
    // Subscribe to queue updates
    const handleQueueUpdate = (data: any) => {
      console.log('Queue updated:', data);
      if (data.institutionId === institutionId) {
        setQueueData(data.queueData || data);
      }
    };
    
    const handleQueueReady = (data: any) => {
      console.log('Queue ready for user:', data);
      
      if (data.userId === userId) {
        // Refresh queue data when user's turn is ready
        queueList();
      }
    };
    
    const handleQueueAlmostReady = (data: any) => {
      console.log('Queue almost ready for user:', data);
      if (data.userId === userId) {
        // Show notification or update UI for almost ready
        queueList();
      }
    };
    
    // Add event listeners
    socket.addCallbacks('queue_update', handleQueueUpdate);
    socket.addCallbacks('queue_ready', handleQueueReady);
    socket.addCallbacks('queue_almost_ready', handleQueueAlmostReady);
    
    // Subscribe to notifications
    socket.subscribeToNotifications(userId, institutionId);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for current queue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Cleanup on unmount
    return () => {
      socket.removeCallbacks('queue_update', handleQueueUpdate);
      socket.removeCallbacks('queue_ready', handleQueueReady);
      socket.removeCallbacks('queue_almost_ready', handleQueueAlmostReady);
      socket.unsubscribeFromNotifications(userId, institutionId);
    };
  }, [fadeAnim, slideAnim, pulseAnim, userId, institutionId]);

  const handleRefresh = () => {
    Animated.timing(refreshRotation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      refreshRotation.setValue(0);
    });

    //re-render list
    queueList();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'waiting': return 'bg-blue-100 text-blue-600';
      case 'onProcess': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'waiting': return <Activity size={16} color="#3B82F6" />;
      case 'onProcess': return <AlertCircle size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
        className="bg-white px-6 pt-12 pb-6 shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-500 rounded-xl items-center justify-center mr-3">
              <Heart size={20} color="white" />
            </View>
            <View>
              <Text className="text-gray-800 text-lg font-bold">MediQ</Text>
              <Text className="text-gray-500 text-sm">Antrian Aktif</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRefresh}
            className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
          >
            <Animated.View
              style={{
                transform: [{
                  rotate: refreshRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }}
            >
              <RefreshCw size={20} color="#6B7280" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Current Queue Info */}
      {!loading && currentUser && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="mx-6 mt-4 mb-6"
        >
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="items-center mb-4">
              <Text className="text-gray-600 text-sm mb-2">Nomor Antrian Saat Ini</Text>
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }]
                }}
                className="bg-blue-500 rounded-2xl px-8 py-4 mb-3"
              >
                <Text className="text-white text-3xl font-bold text-center">{currentUser?.name}</Text>
              </Animated.View>
            </View>

            <View className="flex-row justify-around">
              <View className="items-center">
                <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mb-2">
                  <Users size={20} color="#EF4444" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Nomor Anda</Text>
                <Text className="text-gray-800 text-lg font-bold">{currentUser?.number}</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-2">
                  <Clock size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Sisa Antrian</Text>
                <Text className="text-gray-800 text-lg font-bold">
                  {currentUser?.status === 'waiting' ? remainingQueue :
                   currentUser?.status === 'onProcess' ? 0 : 'Selesai'}
                </Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 bg-green-50 rounded-xl items-center justify-center mb-2">
                  <Activity size={20} color="#10B981" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Estimasi</Text>
                <Text className="text-gray-800 text-lg font-bold">
                  {currentUser?.estimatedTime || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Queue List */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
        className="flex-1 mx-6"
      >
        <Text className="text-gray-800 text-lg font-bold mb-4">Daftar Antrian</Text>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {queueData && Array.isArray(queueData) && queueData.map((item, index) => (
            <View
              key={item.id}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
                item.id === userId ? 'border-2 border-blue-200' : 
                item.status === 'onProcess' ? 'border-2 border-red-200' : ''
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="mr-4">
                    {getStatusIcon(item.status)}
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 text-lg font-bold mb-1">
                      {item.number}
                    </Text>
                    <Text className="text-gray-600 text-sm">{item.name}</Text>
                    {item.estimatedTime && (
                      <Text className="text-gray-500 text-xs mt-1">
                        Estimasi: {item.estimatedTime}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="items-end">
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    <Text className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'completed' ? 'Selesai' :
                        item.status === 'waiting' ? 'Menunggu' :
                          item.status === 'onProcess' ? 'Giliran Anda' : 'Menunggu'}
                    </Text>
                  </View>

                  {item.status === 'onProcess' && item.id === userId && (
                    <TouchableOpacity className="flex-row items-center mt-2">
                      <Text className="text-red-500 text-sm font-medium mr-1">
                        Masuk Sekarang
                      </Text>
                      <ArrowRight size={14} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Bottom Info */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="bg-white px-6 py-4 border-t border-gray-100"
      >
        <View className="flex-row items-center justify-center">
          <Activity size={16} color="#10B981" />
          <Text className="text-gray-600 text-sm ml-2">
            Antrian diperbarui secara real-time via websocket
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}