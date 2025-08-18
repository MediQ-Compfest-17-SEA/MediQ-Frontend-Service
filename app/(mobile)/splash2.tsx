// app/(mobile)/landing.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  Heart,
  Activity,
  Plus,
  CreditCard,
  Clock,
  Shield,
  ArrowRight
} from 'lucide-react-native';

import { useRouter } from "expo-router";

export default function Splash2() {
  const router = useRouter();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));
  const [buttonScale] = useState(new Animated.Value(1));

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

    // Pulse animation for main icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, pulseAnim, floatAnim]);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.push("/(mobile)/(home)/landing");
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Floating Decorative Elements */}
      <View className="absolute inset-0">
        {/* Top floating elements */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            }],
          }}
          className="absolute top-20 left-6"
        >
          <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
            <Plus size={20} color="#3B82F6" />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 6],
              }),
            }],
          }}
          className="absolute top-32 right-8"
        >
          <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
            <Activity size={16} color="#10B981" />
          </View>
        </Animated.View>

        {/* Bottom floating elements */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateX: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
            }],
          }}
          className="absolute bottom-32 left-4"
        >
          <View className="w-14 h-14 bg-purple-100 rounded-2xl items-center justify-center">
            <Heart size={20} color="#8B5CF6" />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateX: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            }],
          }}
          className="absolute bottom-40 right-6"
        >
          <View className="w-11 h-11 bg-red-100 rounded-xl items-center justify-center">
            <Shield size={18} color="#EF4444" />
          </View>
        </Animated.View>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: pulseAnim }
            ]
          }}
          className="items-center mb-8"
        >
          <View className="relative items-center justify-center">
            {/* Main Logo */}
            <View className="w-28 h-28 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
              <Heart size={40} color="white" />
            </View>

            {/* Activity Indicator */}
            <View className="absolute -bottom-1 -right-1">
              <View className="w-8 h-8 bg-red-500 rounded-full items-center justify-center shadow-md">
                <Activity size={14} color="white" />
              </View>
            </View>
          </View>

          {/* App Name */}
          <Text className="text-gray-800 text-3xl font-bold mb-2">
            MediQ
          </Text>
          <Text className="text-gray-600 text-base font-medium">
            Sistem Antrean Digital
          </Text>
        </Animated.View>

        {/* Welcome Message */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="items-center mb-10"
        >
          <Text className="text-2xl font-bold mb-4 text-center text-gray-800 leading-8">
            Selamat Datang di{'\n'}Sistem Antrian Kesehatan
          </Text>
          <Text className="text-gray-500 text-center text-base px-4 leading-6">
            Daftar dengan mudah menggunakan KTP Anda{'\n'}untuk pengalaman yang lebih cepat dan efisien
          </Text>
        </Animated.View>

        {/* Features Preview */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="w-full mb-8"
        >
          <View className="flex-row justify-around px-4">
            <View className="items-center">
              <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center mb-2">
                <CreditCard size={24} color="#3B82F6" />
              </View>
              <Text className="text-gray-600 text-xs font-medium text-center">
                Scan KTP{'\n'}Otomatis
              </Text>
            </View>

            <View className="items-center">
              <View className="w-16 h-16 bg-green-50 rounded-2xl items-center justify-center mb-2">
                <Clock size={24} color="#10B981" />
              </View>
              <Text className="text-gray-600 text-xs font-medium text-center">
                Antrian{'\n'}Real-time
              </Text>
            </View>

            <View className="items-center">
              <View className="w-16 h-16 bg-purple-50 rounded-2xl items-center justify-center mb-2">
                <Shield size={24} color="#8B5CF6" />
              </View>
              <Text className="text-gray-600 text-xs font-medium text-center">
                Data{'\n'}Aman
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: buttonScale }
            ]
          }}
          className="w-full px-4"
        >
          <TouchableOpacity
            onPress={handleButtonPress}
            className="bg-blue-500 rounded-2xl py-4 px-6 shadow-lg flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <CreditCard size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-3 mr-2">
              Mulai Daftar via KTP
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Helper Text */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="mt-6 items-center"
        >
          <Text className="text-gray-400 text-sm text-center px-8">
            Siapkan KTP Anda untuk proses pendaftaran yang cepat
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Info */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute bottom-8 left-0 right-0 items-center"
      >
        <Text className="text-gray-300 text-xs">
          © 2024 MediQ Healthcare Solutions
        </Text>
      </Animated.View>
    </View>
  );
}