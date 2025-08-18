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

export default function WaitingListScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [refreshRotation] = useState(new Animated.Value(0));

  // Sample queue data
  const [currentQueue] = useState('A-012');
  const [userQueue] = useState('A-018');
  const [estimatedTime] = useState(25);
  const [remainingQueue] = useState(6);

  const queueList = [
    { number: 'A-010', status: 'completed', name: 'Ahmad Santoso' },
    { number: 'A-011', status: 'completed', name: 'Siti Rahayu' },
    { number: 'A-012', status: 'current', name: 'Budi Prakoso' },
    { number: 'A-013', status: 'waiting', name: 'Maya Sari' },
    { number: 'A-014', status: 'waiting', name: 'Dedi Kurnia' },
    { number: 'A-015', status: 'waiting', name: 'Lisa Permata' },
    { number: 'A-016', status: 'waiting', name: 'Rudi Hartono' },
    { number: 'A-017', status: 'waiting', name: 'Nina Anggraini' },
    { number: 'A-018', status: 'your-turn', name: 'Anda' },
    { number: 'A-019', status: 'waiting', name: 'Tono Wijaya' },
    { number: 'A-020', status: 'waiting', name: 'Rika Sari' },
  ];

  useEffect(() => {
    // Initial entrance animation
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
  }, [fadeAnim, slideAnim, pulseAnim]);

  const handleRefresh = () => {
    Animated.timing(refreshRotation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      refreshRotation.setValue(0);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'current': return 'bg-blue-100 text-blue-600';
      case 'your-turn': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'current': return <Activity size={16} color="#3B82F6" />;
      case 'your-turn': return <AlertCircle size={16} color="#EF4444" />;
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
              <Text className="text-white text-3xl font-bold text-center">{currentQueue}</Text>
            </Animated.View>
          </View>

          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mb-2">
                <Users size={20} color="#EF4444" />
              </View>
              <Text className="text-gray-500 text-xs mb-1">Nomor Anda</Text>
              <Text className="text-gray-800 text-lg font-bold">{userQueue}</Text>
            </View>

            <View className="items-center">
              <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mb-2">
                <Clock size={20} color="#F59E0B" />
              </View>
              <Text className="text-gray-500 text-xs mb-1">Perkiraan</Text>
              <Text className="text-gray-800 text-lg font-bold">{estimatedTime} min</Text>
            </View>

            <View className="items-center">
              <View className="w-12 h-12 bg-purple-50 rounded-xl items-center justify-center mb-2">
                <AlertCircle size={20} color="#8B5CF6" />
              </View>
              <Text className="text-gray-500 text-xs mb-1">Sisa</Text>
              <Text className="text-gray-800 text-lg font-bold">{remainingQueue}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

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
          {queueList.map((item, index) => (
            <View
              key={item.number}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
                item.status === 'your-turn' ? 'border-2 border-red-200' : ''
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
                  </View>
                </View>

                <View className="items-end">
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    <Text className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'completed' ? 'Selesai' :
                       item.status === 'current' ? 'Sedang Dilayani' :
                       item.status === 'your-turn' ? 'Giliran Anda' : 'Menunggu'}
                    </Text>
                  </View>
                  
                  {item.status === 'your-turn' && (
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
            Antrian diperbarui secara otomatis setiap 30 detik
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}