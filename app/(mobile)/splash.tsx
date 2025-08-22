import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  // Dimensions
} from 'react-native';
import {
  Heart,
  Activity,
  Plus
} from 'lucide-react-native';



export default function SplashScreen() {
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [textSlide] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));


  useEffect(() => {
    Animated.sequence([
      // Step 1: Logo muncul
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Text muncul
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

   
  }, [floatAnim, logoScale, logoOpacity, pulseAnim, textOpacity, textSlide, floatAnim]);


  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Floating Elements */}
      <View className="absolute inset-0">
        {/* Top floating elements */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            }],
          }}
          className="absolute top-20 left-8"
        >
          <View className="w-16 h-16 bg-blue-100 rounded-2xl items-center justify-center">
            <Plus size={24} color="#3B82F6" />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
              }),
            }],
          }}
          className="absolute top-32 right-12"
        >
          <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
            <Activity size={20} color="#10B981" />
          </View>
        </Animated.View>

        {/* Bottom floating elements */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{
              translateX: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }),
            }],
          }}
          className="absolute bottom-40 left-6"
        >
          <View className="w-20 h-20 bg-purple-100 rounded-3xl items-center justify-center">
            <Heart size={28} color="#8B5CF6" />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{
              translateX: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -12],
              }),
            }],
          }}
          className="absolute bottom-28 right-8"
        >
          <View className="w-14 h-14 bg-red-100 rounded-2xl items-center justify-center">
            <Plus size={22} color="#EF4444" />
          </View>
        </Animated.View>
      </View>

      {/* Main Content */}
      <View className="items-center">
        {/* Logo Container */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [
              { scale: Animated.multiply(logoScale, pulseAnim) }
            ]
          }}
          className="mb-8"
        >
          <View className="relative items-center justify-center">
            {/* Logo Background Circle */}
            <View className="w-32 h-32 bg-blue-500 rounded-full items-center justify-center mb-2 shadow-lg">
              <Heart size={48} color="white" />
            </View>

            {/* Activity Icon - Heartbeat */}
            <Animated.View
              style={{
                opacity: logoOpacity,
                transform: [{
                  scale: floatAnim.interpolate({
                    inputRange: [0, 0.2, 0.4, 1],
                    outputRange: [0.3, 1, 0.3, 0.3],
                  }),
                }],
              }}
              className="absolute -bottom-2 -right-2"
            >
              <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center shadow-md">
                <Activity size={18} color="white" />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textSlide }]
          }}
          className="items-center mb-4"
        >
          <Text className="text-gray-800 text-4xl font-bold mb-2">
            MediQ
          </Text>
          <Text className="text-gray-600 text-lg font-medium">
            Sistem Antrean Digital
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textSlide }]
          }}
          className="items-center mb-12"
        >
          <Text className="text-gray-500 text-center text-base px-8 leading-6">
            Daftar antrean dengan mudah{'\n'}menggunakan scan KTP otomatis
          </Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          style={{ opacity: textOpacity }}
          className="items-center"
        >
          <View className="flex-row items-center space-x-2">
            <Animated.View
              style={{
                opacity: floatAnim.interpolate({
                  inputRange: [0, 0.2, 0.4, 1],
                  outputRange: [0.3, 1, 0.3, 0.3],
                }),
              }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
            <Animated.View
              style={{
                opacity: floatAnim.interpolate({
                  inputRange: [0, 0.2, 0.4, 0.6, 1],
                  outputRange: [0.3, 0.3, 1, 0.3, 0.3],
                }),
              }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
            <Animated.View
              style={{
                opacity: floatAnim.interpolate({
                  inputRange: [0, 0.4, 0.6, 0.8, 1],
                  outputRange: [0.3, 0.3, 0.3, 1, 0.3],
                }),
              }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
          </View>
          <Text className="text-gray-400 text-sm mt-4">
            Memuat aplikasi...
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Info */}
      <View className="absolute bottom-12 items-center">
        <Animated.View
          style={{ opacity: textOpacity }}
        >
          <Text className="text-gray-400 text-xs">
            Versi 1.0.0
          </Text>
          <Text className="text-gray-300 text-xs mt-1 text-center">
            © 2025 MediQ Healthcare Solutions
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}