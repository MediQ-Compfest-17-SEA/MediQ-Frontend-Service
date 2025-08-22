import { QueueItem } from '@/Interfaces/IQueue';
import { useRouter } from "expo-router";
import {
  Activity,
  CheckCircle,
  Clock,
  Heart,
  Monitor,
  RefreshCw,
  User
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import axios, { setAuthToken } from '../../../lib/axios';
import socket from '@/lib/socket';
import { storage } from '@/utils/storage';

export default function Leaderboard() {
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [currentQueue, setCurrentQueue] = useState<QueueItem | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const router = useRouter();
  const isMountedRef = useRef(true);

  const normalizeStatus = (status: string) => {
    const s = (status || '').toLowerCase().replace(/-/g, '_').trim();
    if (s === 'onprocess' || s === 'inprocess') return 'in_progress';
    return s;
  };

  const fetchLeaderboardData = useCallback(async () => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // For public display, prefer WebSocket. Only try HTTP if we have a token.
      const token = await storage.getItem('token');
      if (!token) {
        setIsConnected(socket.isConnected);
        return; // rely on WebSocket snapshot
      }
      setAuthToken(token);
      const response = await axios.get('/queue', {
        params: institutionId ? { institutionId } : undefined,
      });

      const payload = (Array.isArray(response?.data?.data) ? response.data.data
        : Array.isArray(response?.data) ? response.data
        : []) as QueueItem[];

      const currentlyServing = payload.find((q) => {
        const s = normalizeStatus(q.status as any);
        return s === 'current' || s === 'in_progress';
      });

      const waitingList = payload.filter((q) => q.id !== currentlyServing?.id);

      if (isMountedRef.current) {
        setCurrentQueue(currentlyServing || null);
        setQueueData(waitingList);
        setIsConnected(true);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setIsConnected(socket.isConnected);
        // Do not redirect on 401; this page can run unauthenticated via WebSocket
        if (err?.response?.status !== 401) {
          console.error("Failed to fetch leaderboard:", err);
          setError("Tidak dapat mengambil data dari server.");
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [isRefreshing, institutionId]);

  // Memoized sorted queue data
  const sortedQueueData = useMemo(() => {
    return queueData.sort((a, b) => {
      // Sort by queue number if available
      if (a.number && b.number) {
        return parseInt(a.number) - parseInt(b.number);
      }
      return 0;
    });
  }, [queueData]);

  // Initial load: resolve institution, connect socket, subscribe and fetch snapshot via WS (and HTTP if token exists)
  useEffect(() => {
    (async () => {
      try {
        const token = await storage.getItem('token');
        if (token) setAuthToken(token);
      } catch {}
      try {
        // Resolve institution list (open endpoint with HTTP fallback in gateway)
        const instResp = await axios.get('/institutions');
        const list = instResp?.data?.data ?? instResp?.data ?? [];
        const firstId = list?.[0]?.id || list?.[0]?.code || 'default-inst';
        setInstitutionId(firstId);
      } catch {
        setInstitutionId('default-inst');
      }

      // Connect socket and subscribe
      socket.connect();
      setIsConnected(socket.isConnected);
      const effectiveInst = institutionId || 'default-inst';
      socket.subscribeQueueUpdates(effectiveInst);

      // Request current snapshot via WebSocket if server supports it
      try {
        socket.emit('get_queue_status', { institutionId: effectiveInst });
      } catch {}

      fetchLeaderboardData();
    })();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auto refresh every 30 seconds (HTTP fallback); realtime handled by WebSocket
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (isMountedRef.current && !isLoading) {
        setIsRefreshing(true);
        fetchLeaderboardData();
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [fetchLeaderboardData, isLoading]);

  // Time and animations
  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTime(new Date());
      }
    }, 1000);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    );

    const fade = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    );

    pulse.start();
    fade.start();

    return () => {
      clearInterval(timeInterval);
      pulse.stop();
      fade.stop();
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
    switch (normalizeStatus(status)) {
      case 'current':
      case 'in_progress':
        return 'bg-blue-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'called':
        return 'bg-purple-500';
      case 'cancelled':
      case 'missed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'current':
      case 'in_progress':
        return <Activity size={24} color="white" />;
      case 'waiting':
        return <Clock size={24} color="white" />;
      case 'completed':
        return <CheckCircle size={24} color="white" />;
      default:
        return <User size={24} color="white" />;
    }
  };

  const isCurrentlyBeingServed = (status: string) => {
    const s = normalizeStatus(status);
    return s === 'current' || s === 'in_progress';
  };

  const handleRetry = () => {
    setError(null);
    setIsRefreshing(true);
    fetchLeaderboardData();
  };

  // WebSocket handlers
  useEffect(() => {
    const onQueueUpdate = (data: any) => {
      if (!isMountedRef.current) return;
      let payload: QueueItem[] = [];
      if (Array.isArray(data)) payload = data;
      else if (Array.isArray(data?.queue)) payload = data.queue;
      else if (Array.isArray(data?.queueData)) payload = data.queueData;

      if (!payload.length) return;

      const currentlyServing = payload.find((q: any) => {
        const s = normalizeStatus(q.status);
        return s === 'current' || s === 'in_progress';
      });
      const waitingList = payload.filter((q: any) => q.id !== currentlyServing?.id);

      setCurrentQueue((currentlyServing as any) || null);
      setQueueData(waitingList as any);
      setIsConnected(true);
      setIsLoading(false);
      setIsRefreshing(false);
    };

    const onReady = () => fetchLeaderboardData();
    const onAlmostReady = () => fetchLeaderboardData();
    const onCalled = () => fetchLeaderboardData();

    socket.addCallbacks('queue_update', onQueueUpdate);
    socket.addCallbacks('queue_ready', onReady);
    socket.addCallbacks('queue_almost_ready', onAlmostReady);
    socket.addCallbacks('queue_called', onCalled);

    return () => {
      socket.removeCallbacks('queue_update', onQueueUpdate);
      socket.removeCallbacks('queue_ready', onReady);
      socket.removeCallbacks('queue_almost_ready', onAlmostReady);
      socket.removeCallbacks('queue_called', onCalled);
    };
  }, [fetchLeaderboardData]);

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
        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <Text className="text-red-700 text-base mb-2">{error}</Text>
            <TouchableOpacity 
              onPress={handleRetry}
              className="bg-red-100 px-4 py-2 rounded-lg flex-row items-center justify-center"
            >
              <RefreshCw size={16} color="#DC2626" />
              <Text className="text-red-600 font-medium ml-2">Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Indicator */}
        {isLoading && !error && (
          <View className="items-center justify-center py-8">
            <Animated.View
              style={{
                transform: [{ rotate: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: ['0deg', '360deg']
                }) }]
              }}
            >
              <RefreshCw size={32} color="#3B82F6" />
            </Animated.View>
            <Text className="text-gray-600 text-lg mt-2">Memuat data...</Text>
          </View>
        )}

        {/* Current Queue Section */}
        {currentQueue && !isLoading && (
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
        {!isLoading && (
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 text-2xl font-bold">Daftar Antrean</Text>
              {isRefreshing && (
                <Animated.View
                  style={{
                    transform: [{ rotate: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: ['0deg', '360deg']
                    }) }]
                  }}
                >
                  <RefreshCw size={20} color="#3B82F6" />
                </Animated.View>
              )}
            </View>
            
            <View className="space-y-4">
              {sortedQueueData.map((queue, index) => (
                <Animated.View
                  key={queue.id}
                  style={{
                    opacity: isCurrentlyBeingServed(queue.status) ? fadeAnim : 1,
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
                          {isCurrentlyBeingServed(queue.status) && (
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
        )}

        {/* Empty State */}
        {sortedQueueData.length === 0 && !currentQueue && !isLoading && !error && (
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
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-400 text-sm">
            © 2024 MediQ Healthcare Solutions - TV Display Mode
          </Text>
          <Text className="text-gray-400 text-xs">
            Auto refresh setiap 30 detik
          </Text>
        </View>
      </View>
    </View>
  );
}