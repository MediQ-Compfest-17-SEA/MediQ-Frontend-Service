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
  Home,
  AlertTriangle,
  ArrowLeft,
  Search
} from 'lucide-react-native';
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
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

    // Floating animation for decorative elements
    Animated.timing(floatAnim, { 
      toValue: 1, 
      duration: 1500, 
      useNativeDriver: true 
    }).start();
  }, [fadeAnim, slideAnim, floatAnim]);

  const handleBackPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.back();
    });
  };

  const handleHomePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.push("/(mobile)/(home)/landing");
    });
  };

  return (
    <View className="flex-1 bg-blue-500">
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Floating Decorative Elements */}
      <View className="absolute inset-0">
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
          <View className="w-12 h-12 bg-white bg-opacity-20 rounded-xl items-center justify-center">
            <Search size={20} color="white" />
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
          <View className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center">
            <Heart size={16} color="white" />
          </View>
        </Animated.View>

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
          <View className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl items-center justify-center">
            <Home size={20} color="white" />
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
          <View className="w-11 h-11 bg-white bg-opacity-20 rounded-xl items-center justify-center">
            <AlertTriangle size={18} color="white" />
          </View>
        </Animated.View>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Error Icon */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="items-center mb-8"
        >
          <View className="w-24 h-24 bg-white bg-opacity-20 rounded-full items-center justify-center mb-4">
            <AlertTriangle size={48} color="white" />
          </View>
          
          <Text className="text-white text-6xl font-bold mb-2">404</Text>
          <View className="w-16 h-1 bg-white bg-opacity-50 rounded-full"></View>
        </Animated.View>

        {/* Error Message */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="items-center mb-10"
        >
          <Text className="text-white text-2xl font-bold mb-4 text-center leading-8">
            Halaman Tidak Ditemukan
          </Text>
          <Text className="text-white text-opacity-80 text-center text-base px-4 leading-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.{'\n'}Periksa kembali URL atau kembali ke halaman utama.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="w-full px-4 space-y-4"
        >
          {/* Home Button */}
          <TouchableOpacity
            onPress={handleHomePress}
            className="bg-white rounded-2xl py-4 px-6 shadow-lg flex-row items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <Home size={24} color="#3B82F6" />
            <Text className="text-blue-500 text-lg font-semibold ml-3">
              Kembali ke Beranda
            </Text>
          </TouchableOpacity>

          {/* Back Button */}
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }]
            }}
          >
            <TouchableOpacity
              onPress={handleBackPress}
              className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl py-4 px-6 flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color="white" />
              <Text className="text-white text-lg font-semibold ml-3">
                Halaman Sebelumnya
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Helper Text */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="mt-8 items-center"
        >
          <Text className="text-white text-opacity-60 text-sm text-center px-8">
            Jika masalah berlanjut, silakan hubungi tim support
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Branding */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute bottom-8 left-0 right-0 items-center"
      >
        <View className="flex-row items-center mb-2">
          <View className="w-6 h-6 bg-white bg-opacity-20 rounded-lg items-center justify-center mr-2">
            <Heart size={12} color="white" />
          </View>
          <Text className="text-white text-opacity-80 text-sm font-medium">MediQ</Text>
        </View>
        <Text className="text-white text-opacity-50 text-xs">
          © 2024 MediQ Healthcare Solutions
        </Text>
      </Animated.View>
    </View>
  );
}