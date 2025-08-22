import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Table, Row, Rows } from 'react-native-table-component';
import { ArrowBigDownDashIcon, PauseCircle, PlusCircle, RefreshCcw } from 'lucide-react-native';
import { filterAtom, loadingAtom, queueDataAtom } from '../../../../utils/store';
import { useAtom } from 'jotai';
import { Spinner } from '@/components/ui/spinner';
import useWebSocket from '@/hooks/useWebSocket';


export default function QueueScreen() {
  const [queueData, setQueueData] = useAtom(queueDataAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  // Mock data - replace with real API call and socket.io
  const mockQueueData = [
    ['001', 'John Doe', '1234567890123456', 'Waiting', '09:00', 'General'],
    ['002', 'Jane Smith', '2345678901234567', 'Processing', '09:15', 'Specialist'],
    ['003', 'Bob Johnson', '3456789012345678', 'Completed', '09:30', 'Emergency'],
    ['004', 'Alice Brown', '4567890123456789', 'Waiting', '09:45', 'General'],
    ['001', 'John Doe', '1234567890123456', 'Waiting', '09:00', 'General'],
    ['002', 'Jane Smith', '2345678901234567', 'Processing', '09:15', 'Specialist'],
    ['003', 'Bob Johnson', '3456789012345678', 'Completed', '09:30', 'Emergency'],
    ['004', 'Alice Brown', '4567890123456789', 'Waiting', '09:45', 'General'],
    ['001', 'John Doe', '1234567890123456', 'Waiting', '09:00', 'General'],
    ['002', 'Jane Smith', '2345678901234567', 'Processing', '09:15', 'Specialist'],
    ['003', 'Bob Johnson', '3456789012345678', 'Completed', '09:30', 'Emergency'],
    ['004', 'Alice Brown', '4567890123456789', 'Waiting', '09:45', 'General'],
    ['001', 'John Doe', '1234567890123456', 'Waiting', '09:00', 'General'],
    ['002', 'Jane Smith', '2345678901234567', 'Processing', '09:15', 'Specialist'],
    ['003', 'Bob Johnson', '3456789012345678', 'Completed', '09:30', 'Emergency'],
    ['004', 'Alice Brown', '4567890123456789', 'Waiting', '09:45', 'General'],
  ];

  const tableHead = ['Queue', 'Name', 'KTP', 'Status', 'Time', 'Type'];
  const widthArr = [60, 120, 140, 80, 70, 80];

  useEffect(() => {
    useWebSocket.connect()
    const handleQueueUpdate = (data: any[]) => {
      console.log("Queue update:", data);
      setQueueData(data);
      setLoading(false);
    };
    useWebSocket.addCallbacks("queueUpdate", handleQueueUpdate);
    useWebSocket.emit("getQueue", null);
    return () => {
      useWebSocket.removeCallbacks("queueUpdate", handleQueueUpdate);
    };
  }, []);


  const filteredData = queueData.filter(item => {
    if (filter === "all") return true;
    return item[3]?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <View className="flex-1 mt-20  items-center justify-center">
        <Spinner size={32} color="#3B82F6" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-6 shadow-sm border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Queue Management</Text>
            <Text className="text-gray-600">Real-time queue monitoring</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg mr-2">
              <RefreshCcw size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
              <PlusCircle size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="flex-row mt-4">
          {['all', 'waiting', 'processing', 'completed'].map((filterType) => (
            <TouchableOpacity
              key={filterType}
              className={`px-4 py-2 rounded-lg mr-2 ${filter === filterType ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => setFilter(filterType)}
            >
              <Text className={`capitalize font-medium ${filter === filterType ? 'text-white' : 'text-gray-700'}`}>
                {filterType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Table */}
      <View
        style={{ flex: 1, padding: 4 }}
      >
        <View className="bg-white rounded-xl shadow-sm border border-gray-100" style={{ elevation: 2 }}>
          <Table borderStyle={{ borderWidth: 0 }}>
            <Row
              data={tableHead}
              style={{ height: 50, backgroundColor: '#F8FAFC' }}
              textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#374151' }}
              widthArr={widthArr}
            />
            {filteredData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={widthArr}
                style={{ minHeight: 60, backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}
                textStyle={{ textAlign: 'center', paddingVertical: 8 }}
              />
            ))}

          </Table>
        </View>

        {/* Action Buttons */}
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() => console.log('Process Next')}
              className="w-[48%] bg-orange-500 rounded-lg p-4 mb-3">

              <ArrowBigDownDashIcon size={24} color="white" />
              <Text className="text-white font-medium mt-2">Process Next</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log('Pause Queue')}
              className="w-[48%] bg-red-500 rounded-lg p-4 mb-3">
              <PauseCircle size={24} color="white" />
              <Text className="text-white font-medium mt-2">Pause Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
