import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform, Pressable, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Table, Row, Rows } from 'react-native-table-component';
import { PlusCircle, Search } from 'lucide-react-native';
import { useAtom } from 'jotai';
import { actionIndexAtom, deleteIndexAtom, selectedAtom, showActionDialogAtom, showDeleteDialogAtom, showModalAtom, userDataAtom } from '@/utils/store';
import { Form } from "@/components/form/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import z from "zod";
import { FormField } from "@/components/form/FormField";
import { FormLabel } from "@/components/form/FormLabel";
import { FormMessage } from "@/components/form/FormMessage";
import { UserFormData } from '@/Interfaces/IUser';

// Validation schema for user form
const userValidationSchema = z.object({
  nik: z.string().min(1, "NIK is required").max(16, "NIK maximum 16 characters"),
  nama: z.string().min(1, "Name is required"),
  tempat_lahir: z.string().min(1, "Place of birth is required"),
  tgl_lahir: z.string().min(1, "Date of birth is required"),
  jenis_kelamin: z.string().min(1, "Gender is required"),
  agama: z.string().min(1, "Religion is required"),
  status_perkawinan: z.string().min(1, "Marital status is required"),
  pekerjaan: z.string().min(1, "Occupation is required"),
  kewarganegaraan: z.string().min(1, "Nationality is required"),
  alamat: z.object({
    name: z.string().min(1, "Street name is required"),
    rt_rw: z.string().min(1, "RT/RW is required"),
    kel_desa: z.string().min(1, "Village is required"),
    kecamatan: z.string().min(1, "District is required"),
    kabupaten: z.string().min(1, "Regency is required"),
    provinsi: z.string().min(1, "Province is required"),
  })
});



export default function UsersPage() {
  const [users, setUsers] = useAtom(userDataAtom)
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedAtom);
  const [showDeleteDialog, setShowDeleteDialog] = useAtom(showDeleteDialogAtom);
  const [showActionDialog, setShowActionDialog] = useAtom(showActionDialogAtom);
  const [deleteIndex, setDeleteIndex] = useAtom(deleteIndexAtom);
  const [actionIndex, setActionIndex] = useAtom(actionIndexAtom);

  const methods = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      nik: '',
      nama: '',
      tempat_lahir: '',
      tgl_lahir: '',
      jenis_kelamin: '',
      agama: '',
      status_perkawinan: '',
      pekerjaan: '',
      kewarganegaraan: '',
      alamat: {
        name: '',
        rt_rw: '',
        kel_desa: '',
        kecamatan: '',
        kabupaten: '',
        provinsi: ''
      }
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });

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
    if(showModal) return;
    setSelectedUser(null);
    setShowModal(true);
    console.log('Adding new user');
  };

  const handleEditUser = (index: number): void => {
    if(showModal)return
    setSelectedUser({ index, data: users[index] });
    setShowModal(true);
  };

  const handleDeleteUser = (index: number): void => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const confirmDelete = (): void => {
    if (deleteIndex !== null) {
      const newUsers = users.filter((_, i) => i !== deleteIndex);
      setUsers(newUsers);
    }
    setShowDeleteDialog(false);
    setDeleteIndex(null);
  };

  const handleRowPress = (index: number): void => {
    setActionIndex(index);
    setShowActionDialog(true);
    console.log('clicked row press', index)
  };

  const handleSaveUser = (data: UserFormData): void => {
    console.log('Saving user with form data:', data);

    if (selectedUser) {
      // Update existing user
      const updatedUsers = [...users];
      updatedUsers[selectedUser.index] = [
        users[selectedUser.index][0], // Keep ID
        data.nama,
        data.nik,
        users[selectedUser.index][3], // Keep email
        users[selectedUser.index][4], // Keep phone
        users[selectedUser.index][5], // Keep status
      ];
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser = [
        String(users.length + 1), // Generate new ID
        data.nama,
        data.nik,
        'new@email.com', // Default email
        '081234567890', // Default phone
        'Active'
      ];
      setUsers([...users, newUser]);
    }

    setShowModal(false);
    methods.reset();
  };
  
  const UserModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View className="bg-white rounded-xl p-5 w-full max-w-lg max-h-[90%]">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {selectedUser ? 'Edit User' : 'Add User'}
              </Text>
            </View>

            <Form methods={methods}>
              <VStack space="md">
                {/* NIK Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">NIK</Text>
                  </FormLabel>
                  <FormField
                    name="nik"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="NIK"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="nik" />
                </View>

                {/* Nama Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Nama Lengkap</Text>
                  </FormLabel>
                  <FormField
                    name="nama"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Nama Lengkap"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="nama" />
                </View>

                {/* Tempat Lahir Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Tempat Lahir</Text>
                  </FormLabel>
                  <FormField
                    name="tempat_lahir"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Tempat Lahir"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="tempat_lahir" />
                </View>

                {/* Tanggal Lahir Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Tanggal Lahir</Text>
                  </FormLabel>
                  <FormField
                    name="tgl_lahir"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Tanggal Lahir"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="tgl_lahir" />
                </View>

                {/* Jenis Kelamin Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Jenis Kelamin</Text>
                  </FormLabel>
                  <FormField
                    name="jenis_kelamin"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Jenis Kelamin"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="jenis_kelamin" />
                </View>

                {/* Agama Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Agama</Text>
                  </FormLabel>
                  <FormField
                    name="agama"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Agama"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="agama" />
                </View>

                {/* Status Perkawinan Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Status Perkawinan</Text>
                  </FormLabel>
                  <FormField
                    name="status_perkawinan"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Status Perkawinan"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="status_perkawinan" />
                </View>

                {/* Pekerjaan Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Pekerjaan</Text>
                  </FormLabel>
                  <FormField
                    name="pekerjaan"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Pekerjaan"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="pekerjaan" />
                </View>

                {/* Kewarganegaraan Field */}
                <View>
                  <FormLabel>
                    <Text className="text-gray-700 font-medium text-sm">Kewarganegaraan</Text>
                  </FormLabel>
                  <FormField
                    name="kewarganegaraan"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Kewarganegaraan"
                        className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="kewarganegaraan" />
                </View>

                {/* Alamat Section */}
                <View className="mt-2">
                  <Text className="text-lg font-semibold mb-2 text-gray-800">Alamat:</Text>

                  {/* Nama Jalan */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">Nama Jalan</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.name"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Nama Jalan"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.name" />
                  </View>

                  {/* RT/RW */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">RT/RW</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.rt_rw"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="RT/RW"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.rt_rw" />
                  </View>

                  {/* Kelurahan/Desa */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">Kelurahan/Desa</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.kel_desa"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kelurahan/Desa"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.kel_desa" />
                  </View>

                  {/* Kecamatan */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">Kecamatan</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.kecamatan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kecamatan"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.kecamatan" />
                  </View>

                  {/* Kabupaten */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">Kabupaten</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.kabupaten"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kabupaten"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.kabupaten" />
                  </View>

                  {/* Provinsi */}
                  <View className="mb-3">
                    <FormLabel>
                      <Text className="text-gray-700 font-medium text-sm">Provinsi</Text>
                    </FormLabel>
                    <FormField
                      name="alamat.provinsi"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Provinsi"
                          className="mt-1 border border-gray-300 rounded-lg p-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat.provinsi" />
                  </View>
                </View>
              </VStack>
            </Form>

            <View className="flex-row justify-end gap-3 mt-4">
              <TouchableOpacity
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={methods.handleSubmit(handleSaveUser)}
              >
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
          <Pressable
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={handleAddUser}
          >
            <PlusCircle size={20} color="white" />
            <Text className="text-white font-medium ml-1">Add User</Text>
          </Pressable>
        </View>
      </View>

      {/* Table */}
      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-100" style={{ elevation: 2 }}>
          <Table borderStyle={{ borderWidth: 0 }}>
            <Row
              data={tableHead}
              style={{ height: 50, backgroundColor: '#F8FAFC' }}
              textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#374151' }}
              widthArr={widthArr}
            />
            {users.map((user, index) => (
              <Pressable
                key={index}
                onPress={() => handleRowPress(index)}
              >
                <Row
                  data={user}
                  style={{ height: 60, backgroundColor: index % 2 ? '#FAFAFA' : 'white' }}
                  textStyle={{ textAlign: 'center', paddingVertical: 8 }}
                  widthArr={widthArr}
                />
              </Pressable>
            ))}
          </Table>
        </View>
      </View>

      {/* User Modal */}
      <UserModal />

      {/* Action Dialog */}
      <Modal
        visible={showActionDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionDialog(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-xl p-5 w-full max-w-sm">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">User Actions</Text>
            </View>

            <View className="mb-5">
              <Text className="text-sm text-gray-600">What would you like to do?</Text>
            </View>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={() => setShowActionDialog(false)}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={() => {
                  setShowActionDialog(false);
                  if (actionIndex !== null) handleEditUser(actionIndex);
                }}
              >
                <Text className="text-gray-600 font-medium">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={() => {
                  setShowActionDialog(false);
                  if (actionIndex !== null) handleDeleteUser(actionIndex);
                }}
              >
                <Text className="text-white font-medium">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        visible={showDeleteDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-xl p-5 w-full max-w-sm">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800">Delete User</Text>
            </View>

            <View className="mb-5">
              <Text className="text-sm text-gray-600">Are you sure you want to delete this user?</Text>
            </View>

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={() => setShowDeleteDialog(false)}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-md min-w-[70] items-center"
                onPress={confirmDelete}
              >
                <Text className="text-white font-medium">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}