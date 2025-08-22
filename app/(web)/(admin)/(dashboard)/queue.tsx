import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Table, Row, Rows } from 'react-native-table-component';
import { ArrowBigDownDashIcon, PauseCircle, PlusCircle, RefreshCcw } from 'lucide-react-native';
import { filterAtom, loadingAtom, queueDataAtom, statusQueueAtom, institutionsAtom, selectedInstitutionIdAtom } from '../../../../utils/store';
import { useAtom } from 'jotai';
import { Spinner } from '@/components/ui/spinner';
import socket from '@/lib/socket';
import axiosClient, { setAuthToken } from '@/lib/axios';
import { storage, clearAuth } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { QueueItem } from '@/Interfaces/IQueue';
import { InstitutionProps } from '@/Interfaces/IInstitusi';

type FilterType = 'all' | 'waiting' | 'onProcess' | 'completed' | 'called' | 'missed';

export default function QueueScreen() {
  const router = useRouter();
  const [queueData, setQueueData] = useAtom<QueueItem[]>(statusQueueAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [institutions, setInstitutions] = useAtom(institutionsAtom);
  const [selectedInstitutionId, setSelectedInstitutionId] = useAtom(selectedInstitutionIdAtom);

  const tableHead = ['Queue', 'Name', 'KTP', 'Status', 'Time', 'Type'];
  const widthArr = [60, 120, 140, 80, 70, 80];

  const fetchQueueData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/queue', {
        params: selectedInstitutionId ? { institutionId: selectedInstitutionId } : undefined,
      });
      const payload = response?.data?.data ?? response?.data ?? [];
      console.log('Queue data fetched:', payload);
      setQueueData(payload);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessNext = async () => {
    try {
      const nextWaitingUser = queueData.find(item => item.status === 'waiting');
      if (nextWaitingUser) {
        await axiosClient.post(`/queue/${nextWaitingUser.id}/call`);
        fetchQueueData(); // Refresh data
      }
    } catch (error) {
      console.error('Error processing next queue:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: QueueItem['status']) => {
    try {
      // Normalize UI status to backend accepted values
      const backendStatus =
        status === 'onProcess' ? 'in-progress' : status;
      await axiosClient.patch(`/queue/${id}/status`, { status: backendStatus });
      fetchQueueData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Removed "pause queue" as backend endpoint is not available
  // Use callPatient/updateStatus instead via available endpoints

  useEffect(() => {
    (async () => {
      // Require admin auth
      const token = await storage.getItem('token');
      if (!token) {
        router.replace('/(web)/(admin)/login');
        return;
      }
      // Hydrate HTTP and WebSocket auth
      setAuthToken(token);
      socket.setToken(token);
      socket.connect();

      // Load institutions and select default if not set
      try {
        const resp = await axiosClient.get('/institutions');
        const list = resp?.data?.data ?? resp?.data ?? [];
        setInstitutions(list);
        if (!selectedInstitutionId && list.length) {
          const firstId = list[0]?.id || list[0]?.code || null;
          if (firstId) setSelectedInstitutionId(firstId);
        }
      } catch (e) {
        console.warn('Failed to load institutions', e);
      }

      // Initial fetch (may fetch all if institution not yet selected)
      await fetchQueueData();
    })();

    const handleQueueUpdate = (data: any) => {
      console.log("Queue update received:", data);
      if (data.queueData) {
        setQueueData(data.queueData);
      } else if (Array.isArray(data)) {
        setQueueData(data);
      } else if (data.queue) {
        setQueueData(data.queue);
      }
      setLoading(false);
    };

    const handleQueueReady = (data: any) => {
      console.log("Queue ready:", data);
      fetchQueueData();
    };

    const handleQueueAlmostReady = (data: any) => {
      console.log("Queue almost ready:", data);
      fetchQueueData();
    };

    const handleQueueCalled = (data: any) => {
      console.log("Queue called:", data);
      fetchQueueData();
    };

    const handleQueueCompleted = (data: any) => {
      console.log("Queue completed:", data);
      fetchQueueData();
    };

    // Add event listeners
    socket.addCallbacks("queue_update", handleQueueUpdate);
    socket.addCallbacks("queue_ready", handleQueueReady);
    socket.addCallbacks("queue_almost_ready", handleQueueAlmostReady);
    socket.addCallbacks("queue_called", handleQueueCalled);
    socket.addCallbacks("queue_completed", handleQueueCompleted);

    return () => {
      socket.removeCallbacks("queue_update", handleQueueUpdate);
      socket.removeCallbacks("queue_ready", handleQueueReady);
      socket.removeCallbacks("queue_almost_ready", handleQueueAlmostReady);
      socket.removeCallbacks("queue_called", handleQueueCalled);
      socket.removeCallbacks("queue_completed", handleQueueCompleted);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await clearAuth();
    } catch {}
    setAuthToken(null);
    try { socket.disconnect(); } catch {}
    router.replace('/(web)/(admin)/login');
  };

  // Subscribe to institution-specific queue updates when selection changes
  useEffect(() => {
    if (selectedInstitutionId) {
      socket.subscribeQueueUpdates(selectedInstitutionId);
      fetchQueueData();
    }
  }, [selectedInstitutionId]);

  // Normalize status helper (backend may return 'in-progress', UI previously used 'onProcess')
  const normalizeStatus = (status?: string) => {
    if (!status) return 'waiting';
    if (status === 'in-progress') return 'onProcess';
    return status;
  };

  // Transform queue data to table format
  const transformedData = queueData.map(item => {
    const statusNorm = normalizeStatus(item.status as any);
    return [
      item.number,
      item.name,
      item.nik || 'N/A',
      getStatusDisplay(statusNorm as any),
      item.estimatedTime || 'N/A',
      item.priority || 'General'
    ];
  });

  // Get display text for status
  const getStatusDisplay = (status: QueueItem['status']) => {
    const statusMap: Record<string, string> = {
      waiting: 'Waiting',
      onProcess: 'Processing',
      'in-progress': 'Processing',
      called: 'Called',
      completed: 'Completed',
      cancelled: 'Cancelled',
      missed: 'Missed',
    };
    return statusMap[status as string] || String(status || '');
  };

  // Get status color
  const getStatusColor = (status: QueueItem['status']) => {
    const colorMap: Record<string, string> = {
      waiting: '#3B82F6',        // blue
      onProcess: '#F59E0B',      // orange
      'in-progress': '#F59E0B',  // orange
      completed: '#10B981',      // green
      called: '#8B5CF6',         // purple
      missed: '#EF4444',         // red
      cancelled: '#9CA3AF',      // gray
    };
    return colorMap[status as string] || '#6B7280';
  };

  const filteredData = transformedData.filter(item => {
    if (filter === "all") return true;
    const originalItem = queueData.find(q => q.number === item[0]);
    const st = normalizeStatus(originalItem?.status as any);
    return st === filter;
  });

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'onProcess', label: 'Processing' },
    { key: 'called', label: 'Called' },
    { key: 'completed', label: 'Completed' },
    { key: 'missed', label: 'Missed' }
  ];

  if (loading) {
    return (
      <View className="flex-1 mt-20 items-center justify-center">
        <Spinner size={32} color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="bg-white p-6 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Queue Management</Text>
              <Text className="text-gray-600">Real-time queue monitoring</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={fetchQueueData}
                className="bg-green-500 px-4 py-2 rounded-lg mr-2"
              >
                <RefreshCcw size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg mr-2">
                <PlusCircle size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Institution Selection */}
          <View className="flex-row mt-4 flex-wrap">
            {institutions.map((inst: any) => {
              const id = inst?.id || inst?.code;
              const active = selectedInstitutionId === id;
              return (
                <TouchableOpacity
                  key={id || inst?.name}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
                  onPress={() => id && setSelectedInstitutionId(id)}
                >
                  <Text className={`font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
                    {inst?.name || inst?.code || 'Institution'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filter Buttons */}
          <View className="flex-row mt-2 flex-wrap">
            {filterOptions.map((filterOption) => (
              <TouchableOpacity
                key={filterOption.key}
                className={`px-4 py-2 rounded-lg mr-2 mb-2 ${filter === filterOption.key ? 'bg-blue-500' : 'bg-gray-200'}`}
                onPress={() => setFilter(filterOption.key)}
              >
                <Text className={`font-medium ${filter === filterOption.key ? 'text-white' : 'text-gray-700'}`}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Table */}
        <View style={{ flex: 1, padding: 16 }}>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100" style={{ elevation: 2 }}>
            <Table borderStyle={{ borderWidth: 0 }}>
              <Row
                data={tableHead}
                style={{ height: 50, backgroundColor: '#F8FAFC' }}
                textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#374151' }}
                widthArr={widthArr}
              />
              {filteredData.map((rowData, index) => {
                const originalItem = queueData.find(q => q.number === rowData[0]);
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => originalItem && console.log('Selected queue item:', originalItem)}
                  >
                    <Row
                      data={rowData}
                      widthArr={widthArr}
                      style={{ 
                        minHeight: 60, 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                        borderLeftWidth: 4,
                        borderLeftColor: originalItem ? getStatusColor(originalItem.status) : '#E5E7EB'
                      }}
                      textStyle={{ textAlign: 'center', paddingVertical: 8 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </Table>
          </View>

          {/* Action Buttons */}
          <View className="mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                onPress={handleProcessNext}
                className="w-[48%] bg-orange-500 rounded-lg p-4 mb-3"
                disabled={!queueData.some(item => item.status === 'waiting')}
                style={{
                  opacity: queueData.some(item => item.status === 'waiting') ? 1 : 0.5
                }}
              >
                <ArrowBigDownDashIcon size={24} color="white" />
                <Text className="text-white font-medium mt-2">Process Next</Text>
                <Text className="text-white text-xs mt-1 opacity-80">
                  Call next waiting patient
                </Text>
              </TouchableOpacity>

              {/* Pause removed: backend endpoint not available */}
            </View>
          </View>

          {/* Queue Statistics */}
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-2" style={{ elevation: 2 }}>
            <Text className="text-lg font-semibold text-gray-800 mb-3">Queue Statistics</Text>
            <View className="flex-row justify-around flex-wrap">
              <View className="items-center mb-2">
                <Text className="text-2xl font-bold text-blue-600">
                  {queueData.filter(item => item.status === 'waiting').length}
                </Text>
                <Text className="text-sm text-gray-600">Waiting</Text>
              </View>
              <View className="items-center mb-2">
                <Text className="text-2xl font-bold text-orange-600">
                  {queueData.filter(item => item.status === 'onProcess').length}
                </Text>
                <Text className="text-sm text-gray-600">Processing</Text>
              </View>
              <View className="items-center mb-2">
                <Text className="text-2xl font-bold text-purple-600">
                  {queueData.filter(item => item.status === 'onProcess').length}
                </Text>
                <Text className="text-sm text-gray-600">Called</Text>
              </View>
              <View className="items-center mb-2">
                <Text className="text-2xl font-bold text-green-600">
                  {queueData.filter(item => item.status === 'completed').length}
                </Text>
                <Text className="text-sm text-gray-600">Completed</Text>
              </View>
              <View className="items-center mb-2">
                <Text className="text-2xl font-bold text-gray-600">
                  {queueData.length}
                </Text>
                <Text className="text-sm text-gray-600">Total</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}