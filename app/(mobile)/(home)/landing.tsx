import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar,
  Animated,
  ScrollView
} from 'react-native';
import { 
  Camera, 
  Scan, 
  Clock, 
  Shield, 
  ChevronRight,
  Heart,
  Smartphone
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const router = useRouter();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  return (
    <View className="flex-1  bg-gradient-to-br from-blue-50 to-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView 
        className="flex-1 px-4 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Section */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="px-6 pt-20 pb-8 items-center "
        >
          <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-6 shadow-lg">
            <Heart size={48} color="white" />
          </View>
          <Text className="text-primary-500 text-3xl font-bold text-center">
            MediQ
          </Text>
          <Text className="text-gray-600 text-center mt-3 text-lg px-4">
            Sistem Antrean Pasien Digital dengan OCR Scan KTP
          </Text>
        </Animated.View>

        {/* Main Feature Card */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="px-6 mb-8"
        >
          <View className="bg-white rounded-3xl p-8 shadow-xl">
            <View className="items-center">
              <View className="w-20 h-20 bg-blue-500 items-center rounded-full justify-center mb-6 ">
                <Scan size={40} color="white" />
              </View>
              <Text className="text-black text-2xl font-bold text-center mb-3">
                Scan KTP Otomatis
              </Text>
              <Text className="text-black text-center text-base leading-6 mb-8">
                Daftar antrean dengan mudah dan cepat. Cukup scan KTP Anda, data akan terisi otomatis menggunakan teknologi OCR
              </Text>
              
              <TouchableOpacity
                onPress={() => router.push('/(mobile)/(home)/scan-ktp')}
                className="bg-white rounded-full px-10 py-5 shadow-lg active:scale-95 w-full"
              >
                <View className="flex-row items-center justify-center">
                  <Camera size={24} color="#3B82F6" />
                  <Text className="text-blue-500 font-bold text-lg ml-3">
                    Mulai Scan KTP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="px-6 mb-8"
        >
          <Text className="text-gray-800 font-bold text-xl mb-6">
            Fitur Unggulan
          </Text>
          
          <View className="space-y-4">
            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Scan size={28} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">
                    OCR Scan Akurat
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Ekstraksi data KTP otomatis dengan tingkat akurasi tinggi
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Clock size={28} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">
                    Antrean Real-time
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Pantau posisi antrean Anda secara langsung dan real-time
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Smartphone size={28} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">
                    Notifikasi Pintar
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Terima notifikasi otomatis saat giliran Anda mendekat
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <View className="flex-row items-center">
                <View className="w-14 h-14 bg-red-100 rounded-full items-center justify-center mr-4">
                  <Shield size={28} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">
                    Keamanan Terjamin
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Data pribadi Anda aman dengan enkripsi end-to-end
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* How it Works */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="px-6 mb-8"
        >
          <Text className="text-gray-800 font-bold text-xl mb-6">
            Cara Penggunaan
          </Text>
          
          <View className="bg-gray-50 rounded-2xl p-6">
            <View className="space-y-6">
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-white font-bold">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    Scan KTP Anda
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Ambil foto KTP dengan kamera ponsel
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-white font-bold">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    Konfirmasi Data
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Periksa dan lengkapi data yang terdeteksi
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-purple-500 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-white font-bold">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    Pilih Layanan
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Tentukan jenis layanan dan dapatkan nomor antrean
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-white font-bold">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    Pantau Antrean
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    Tunggu panggilan dengan nyaman di rumah
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Bottom CTA */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="px-6"
        >
          <View className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <Text className="text-center text-gray-600 text-base mb-4">
              Siap memulai pendaftaran digital?
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push('/(mobile)/(home)/scan-ktp')}
              className="bg-blue-500 rounded-full py-4 px-6 active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Camera size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Scan KTP Sekarang
                </Text>
                <ChevronRight size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}