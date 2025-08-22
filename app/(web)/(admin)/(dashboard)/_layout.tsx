import { getToken } from "@/lib/axios";
import { Href, Link, Stack, usePathname, useRouter } from "expo-router";
import {
  BarChart3,
  Bell,
  ChevronRight,
  Clock,
  Heart,
  Settings,
  Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-20));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", icon: BarChart3, href: "/(web)/(admin)/(dashboard)" },
    { name: "Users", icon: Users, href: "/(web)/(admin)/(dashboard)/users" },
    { name: "Queue", icon: Clock, href: "/(web)/(admin)/(dashboard)/queue" },
    { name: "Settings", icon: Settings, href: "/(web)/(admin)/(dashboard)/settings" },
    { name: "Leaderboard", icon: Heart, href: "/(web)/(leaderboard)/leaderboard" },
  ];

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace('/(web)/(admin)/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/(web)/(admin)/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Animation effect
  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [isAuthenticated, fadeAnim, slideAnim]);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (Platform.OS === "web") {
    return (
      <View className="flex flex-row bg-gray-50" style={{ height: '100%', width: '100%' }}>
        {/* Sidebar */}
        <View className="w-64 md:w-56 lg:w-64 bg-white shadow-lg border-r border-gray-200 hidden sm:flex">
          {/* Header */}
          <View className="p-6 md:p-4 lg:p-6 border-b border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-xl items-center justify-center mr-3">
                <Heart size={20} color="white" />
              </View>
              <View>
                <Text className="text-gray-800 text-xl md:text-lg lg:text-xl font-bold">MediQ Admin</Text>
                <Text className="text-gray-500 text-sm md:text-xs lg:text-sm">Dashboard Panel</Text>
              </View>
            </View>
          </View>


          {/* Navigation Menu */}
          <View className="flex-1 p-4 md:p-3 lg:p-4">
            <Text className="text-gray-400 text-xs font-medium mb-4 uppercase tracking-wide">
              Menu Utama
            </Text>

            {menus.map((menu, idx) => {
              const Icon = menu.icon;
              const isActive = pathname === menu.href;

              if (menu.name === "Leaderboard" && Platform.OS === "web") {
                return (
                  <a
                    key={idx}
                    href={menu.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-row  items-center justify-between p-3 rounded-xl mb-2 ${isActive ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex flex-row items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <Icon size={16} color="#6B7280" />
                      </div>
                      <Text className="font-medium text-gray-700">{menu.name}</Text>
                    </div>
                    <ChevronRight size={16} color="#6B7280" />
                  </a>
                );
              }
              return (
                <Link href={menu.href as Href} key={idx} asChild>
                  <TouchableOpacity
                    className={`flex-row items-center justify-between p-3 rounded-xl mb-2 ${isActive ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                        <Icon size={16} color={isActive ? "#2563EB" : "#6B7280"} />
                      </View>
                      <Text
                        className={`font-medium ${isActive ? "text-blue-600" : "text-gray-700"
                          }`}
                      >
                        {menu.name}
                      </Text>
                    </View>
                    <ChevronRight size={16} color={isActive ? "#2563EB" : "#6B7280"} />
                  </TouchableOpacity>
                </Link>
              );
            })}
          </View>

          {/* Bottom Info */}
          <View className="p-4 md:p-3 lg:p-4 border-t border-gray-100">
            <View className="flex-row items-center justify-between p-3 md:p-2 lg:p-3 bg-gray-50 rounded-xl">
              <View className="flex-row items-center">
                <View className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-green-100 rounded-full items-center justify-center mr-3 md:mr-2 lg:mr-3">
                  <Bell size={16} color="#10B981" />
                </View>
                <View>
                  <Text className="text-gray-700 text-sm md:text-xs lg:text-sm font-medium">Status Sistem</Text>
                  <Text className="text-green-600 text-xs">Online</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <View className="flex-1 bg-white">
          {/* Top Header */}
          <View className="bg-white border-b border-gray-200 p-6 md:p-4 lg:p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-800 text-2xl md:text-xl lg:text-2xl font-bold">Selamat Datang</Text>
                <Text className="text-gray-500 md:text-sm lg:text-base">Kelola sistem antrian MediQ dengan mudah</Text>
              </View>
              <View className="flex-row items-center space-x-4 md:space-x-2 lg:space-x-4">
                <View className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Bell size={20} color="#6B7280" />
                </View>
                <View className="w-10 h-10 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-full items-center justify-center">
                  <Text className="text-blue-600 font-bold md:text-sm lg:text-base">A</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-6 md:p-4 lg:p-6 overflow-y-auto">
            <Stack screenOptions={{ headerShown: false }} />
          </ScrollView>
        </View>
      </View>
    );
  }

  // Mobile layout
  // Layout Mobile (Native)
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white' }}
        edges={['top', 'bottom']}
      >
        {/* Bottom Navigation */}
        <View className="flex-row justify-around items-center bg-white border-t border-gray-200 py-3">
          {menus.map((menu, idx) => {
            const Icon = menu.icon;
            const isActive = pathname === menu.href;
            return (
              <Link href={menu.href as Href} key={idx} asChild>
                <TouchableOpacity className="items-center">
                  <Icon size={20} color={isActive ? "#2563EB" : "#6B7280"} />
                  <Text
                    className={`text-xs mt-1 ${isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                      }`}
                  >
                    {menu.name}
                  </Text>
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </View>
  );
}