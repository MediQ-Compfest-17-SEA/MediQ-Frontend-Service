import { Form } from '@/components/form/Form';
import { FormField } from '@/components/form/FormField';
import { FormLabel } from '@/components/form/FormLabel';
import { FormMessage } from '@/components/form/FormMessage';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { AdminProps } from '@/Interfaces/IAdmin';
import axiosClient from '@/lib/axios';
import { loadingAtom } from '@/utils/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Lock, LogOut, Mail, Save, Settings, Shield, User } from "lucide-react-native";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import z from 'zod';

const validationSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100)
})

export default function SettingsPage() {
  const id = localStorage.getItem('id');
  const router = useRouter();
  const [adminProfile, setAdminProfile] = useState<AdminProps | null>(null)
  const [submit, setSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useAtom(loadingAtom)

  const methods = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: adminProfile?.name || "",
      email: adminProfile?.email || "",
      password: ''
    }
  })

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/admin/${id}`);
        const adminData = response.data;

        if (adminData) {
          setAdminProfile(adminData);
          methods.reset({
            name: adminData.name,
            email: adminData.email,
            password: "",
          })
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        Alert.alert("Error", "Failed to fetch admin profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdminProfile();
    }
  }, [id, methods]);

  const onSubmit = async (data: AdminProps) => {
    setSubmit(true);
    try {
      const response = await axiosClient.patch(`/admin/${id}`, {
        ...data,
        id: id
      });
      setAdminProfile(response.data);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again later.");
      console.log(error)
    } finally {
      setSubmit(false);
    }
  }

  const handleLogout = async () => {
    setSubmit(true);
    try {
      const token = localStorage.getItem('token');
      console.log("Token before logout:", token);

      if (!token) {
        console.log("No token found, performing local logout");
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        router.push('/(web)/(admin)/login');
        return;
      }

      try {
        await axiosClient.get('/auth/logout');
        console.log("Server logout successful");
      } catch (logoutError: any) {
        console.log("Server logout failed:", logoutError.response?.data);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('id');
      router.push('/(web)/(admin)/login');
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again later.");
      console.log(error);
    } finally {
      setSubmit(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 mt-20 bg-gray-50 items-center justify-center">
        <Spinner size={32} color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Settings size={28} color="#3B82F6" />
            <Text className="text-3xl font-bold text-gray-800 ml-3">Settings</Text>
          </View>
          <Text className="text-gray-600">Manage your admin profile and account settings</Text>
        </View>

        {/* Profile Info Card */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100" style={{ elevation: 2 }}>
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <Shield size={24} color="#3B82F6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-semibold text-gray-800">Admin Profile</Text>
              <Text className="text-sm text-gray-600">Update your personal information</Text>
            </View>
          </View>

          <Form methods={methods}>
            <VStack space="lg">
              {/* Name Field */}
              <View>
                <FormLabel>
                  <View className="flex-row items-center mb-2">
                    <User size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-medium text-base ml-2">Full Name</Text>
                  </View>
                </FormLabel>
                <FormField
                  name="name"
                  render={({ value, onChange, onBlur }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your full name"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
                      style={{ fontSize: 16 }}
                    />
                  )}
                />
                <FormMessage name="name" />
              </View>

              {/* Email Field */}
              <View>
                <FormLabel>
                  <View className="flex-row items-center mb-2">
                    <Mail size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-medium text-base ml-2">Email Address</Text>
                  </View>
                </FormLabel>
                <FormField
                  name="email"
                  render={({ value, onChange, onBlur }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="admin@mediq.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
                      style={{ fontSize: 16 }}
                    />
                  )}
                />
                <FormMessage name="email" />
              </View>

              {/* Password Field */}
              <View>
                <FormLabel>
                  <View className="flex-row items-center mb-2">
                    <Lock size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-medium text-base ml-2">New Password</Text>
                  </View>
                </FormLabel>
                <FormField
                  name="password"
                  render={({ value, onChange, onBlur }) => (
                    <TextInput
                      value={value}
                      keyboardType="default"
                      secureTextEntry
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter new password (leave blank to keep current)"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-base"
                      style={{ fontSize: 16 }}
                    />
                  )}
                />
                <FormMessage name="password" />
                <Text className="text-xs text-gray-500 mt-1">
                  Leave blank to keep your current password
                </Text>
              </View>
            </VStack>

            {/* Save Button */}
            <TouchableOpacity
              onPress={methods.handleSubmit(onSubmit)}
              disabled={submit}
              className={`mt-8 rounded-lg py-4 shadow-sm flex-row items-center justify-center ${submit ? 'bg-gray-400' : 'bg-blue-500'
                }`}
            >
              <Save size={20} color="white" />
              <Text className="text-white text-center font-semibold text-base ml-2">
                {submit ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              disabled={submit}
              className={`mt-4 rounded-lg py-4 shadow-sm flex-row items-center justify-center ${submit ? 'bg-gray-400' : 'bg-red-500'
                }`}
            >
              <LogOut size={20} color="white" />
              <Text className="text-white text-center font-semibold text-base ml-2">
                {submit ? 'Logging out...' : 'Logout'}
              </Text>
            </TouchableOpacity>
          </Form>
        </View>
      </View>
    </View>
  );
}