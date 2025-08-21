import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Table, Row, Rows } from 'react-native-table-component';
import { PlusCircle, Search } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  ktp: string;
  email: string;
  phone: string;
  status: string;
}

interface SelectedUser {
  index: number;
  data: string[];
}
export default function UsersPage() {
  const [users, setUsers] = useState<string[][]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  const mockUsers = [
    ['1', 'John Doe', '1234567890123456', 'john@email.com', '08123456789', 'Active'],
    ['2', 'Jane Smith', '2345678901234567', 'jane@email.com', '08234567890', 'Active'],
    ['3', 'Bob Johnson', '3456789012345678', 'bob@email.com', '08345678901', 'Inactive'],
  ];

  const tableHead = ['ID', 'Name', 'KTP', 'Email', 'Phone', 'Status'];
  const widthArr = [50, 120, 140, 150, 120, 80];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (index: number): void => {
    setSelectedUser({ index, data: users[index] } as SelectedUser);
    setShowModal(true);
  };


  interface AlertButton {
    text: string;
    style?: 'cancel' | 'destructive' | 'default';
    onPress?: () => void;
  }

  const handleDeleteUser = (index: number): void => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // API call to delete user
          const newUsers = users.filter((_, i) => i !== index);
          setUsers(newUsers);
        }},
      ] as AlertButton[]
    );
  };

  const UserModal = () => (
    <Modal visible={showModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 m-4 w-full max-w-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {selectedUser ? 'Edit User' : 'Add User'}
          </Text>
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3"
            placeholder="Full Name"
            defaultValue={selectedUser?.data[1]}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3"
            placeholder="KTP Number"
            defaultValue={selectedUser?.data[2]}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-3"
            placeholder="Email"
            defaultValue={selectedUser?.data[3]}
          />
          
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4"
            placeholder="Phone"
            defaultValue={selectedUser?.data[4]}
          />
          
          <View className="flex-row justify-end">
            <TouchableOpacity
              className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={() => {
                // Handle save logic here
                setShowModal(false);
              }}
            >
              <Text className="text-white font-medium">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-6 shadow-sm border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Users Management</Text>
            <Text className="text-gray-600">Manage registered users</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddUser}
          >
            <PlusCircle size={20} color="white" />
            <Text className="text-white font-medium ml-1">Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="relative">
          <TextInput
            className="bg-gray-100 rounded-lg pl-10 pr-4 py-3"
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Search size={20} color="#6B7280" className="absolute left-3 top-3" />
        </View>
      </View>

      {/* Table */}
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-100" style={{ elevation: 2 }}>
          <Table borderStyle={{ borderWidth: 0 }}>
            <Row 
              data={tableHead} 
              style={{ height: 50, backgroundColor: '#F8FAFC' }} 
              textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#374151' }}
              widthArr={widthArr}
            />
            {users.map((user, index) => (
              <TouchableOpacity
                key={index}
                onLongPress={() => {
                  Alert.alert(
                    'User Actions',
                    'What would you like to do?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Edit', onPress: () => handleEditUser(index) },
                      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteUser(index) },
                    ]
                  );
                }}
              >
                <Row 
                  data={user} 
                  style={{ height: 60, backgroundColor: index % 2 ? '#FAFAFA' : 'white' }}
                  textStyle={{ textAlign: 'center', paddingVertical: 8 }}
                  widthArr={widthArr}
                />
              </TouchableOpacity>
            ))}
          </Table>
        </View>
      </ScrollView>

      <UserModal />
    </View>
  );
}