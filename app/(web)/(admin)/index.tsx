import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
} from 'react-native';
import {
  Heart,
  Activity,
  Plus
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WebAdminSplash() {
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [textOpacity] = useState(new Animated.Value(0));
  const [textSlide] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [floatAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/(web)/(admin)/(dashboard)');
    }, 10000);


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

  }, [floatAnim, logoScale, logoOpacity, pulseAnim, textOpacity, textSlide]);

  return (
    <View className="h-screen w-screen bg-white items-center justify-center overflow-hidden">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
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
          <Text className="text-gray-800 text-center text-4xl font-bold mb-2">
            MediQ Admin
          </Text>
          <Text className="text-gray-600 text-lg font-medium">
            Dashboard Manajemen Antrian
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
            Kelola sistem antrian digital{'\n'}dengan mudah dan efisien
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
          <Text className="text-gray-400 text-center text-sm mt-4">
            Memuat dashboard...
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Info */}
      <View className="absolute bottom-12 items-center">
        <Animated.View
          style={{ opacity: textOpacity }}
        >
          <Text className="text-gray-400 text-center text-xs">
            Versi 1.0.0
          </Text>
          <Text className="text-gray-300 text-xs mt-1 text-center">
            © 2024 MediQ Healthcare Solutions
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}