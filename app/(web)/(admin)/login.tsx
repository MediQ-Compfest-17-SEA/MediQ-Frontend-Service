import { Form } from "@/components/form/Form";
import { FormField } from "@/components/form/FormField";
import { FormLabel } from "@/components/form/FormLabel";
import { FormMessage } from "@/components/form/FormMessage";
import { VStack } from "@/components/ui/vstack";
import { LoginProps } from "@/Interfaces/IAuth";
import axiosClient from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Heart, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import z from "zod";

const validationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  const onSubmit = async (data: LoginProps) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/auth/login/admin", data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("id", response.data.id);
      router.push('/(web)/(admin)/(dashboard)');
    } catch (error) {
      Alert.alert("Login failed", "Please check your credentials and try again." + error);
      
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 min-h-screen bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="flex-1 items-center justify-center px-6 py-8">
        {/* Logo & Header */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-3 shadow-lg">
            <Heart size={28} color="white" />
          </View>
          <Text className="text-gray-800 text-2xl font-bold mb-1">MediQ Admin</Text>
          <Text className="text-gray-600 text-sm text-center">
            Masuk ke sistem administrasi
          </Text>
        </View>

        <Form methods={methods}>
          {/* Login Form Card */}
          <View className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <VStack space="lg">
              {/* Email Field */}
              <View>
                <FormLabel>
                  <View className="flex-row items-center">
                    <Mail size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-medium text-base ml-2">Email</Text>
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
                      className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 text-sm"
                    />
                  )}
                />
                <FormMessage name="email" />
              </View>

              {/* Password Field */}
              <View>
                <FormLabel>
                  <View className="flex-row items-center">
                    <Lock size={16} color="#6B7280" />
                    <Text className="text-gray-700 font-medium text-base ml-2">Password</Text>
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
                      placeholder="Masukkan password"
                      className="mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 text-sm"
                    />
                  )}
                />
                <FormMessage name="password" />
              </View>
            </VStack>

            {/* Login Button */}
            <TouchableOpacity
              onPress={methods.handleSubmit(onSubmit, (errors) => {
                console.log("Form validation errors:", errors);
                Alert.alert("Form Error", "Ada field yang belum diisi dengan benar");
              })}
              className="mt-6 bg-blue-500 rounded-lg py-3 shadow-sm"
            >
              <Text className="text-white text-center font-semibold text-sm">
                {isLoading ? "Loading..." : "Masuk"}
              </Text>
            </TouchableOpacity>
          </View>
        </Form>

        {/* Footer Info */}
        <View className="mt-6 items-center">
          <Text className="text-gray-400 text-xs text-center">
            MediQ Healthcare Solutions
          </Text>
          <Text className="text-gray-300 text-xs mt-1">
            Admin Panel v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
}