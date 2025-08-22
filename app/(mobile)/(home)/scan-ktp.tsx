import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
  Image
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import {
  X,
  Camera,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import axiosClient from '@/lib/axios';


const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);

  // Animasi untuk scanner overlay
  const scanAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startScanAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startScanAnimation();
  }, []);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <View className="bg-white/10 rounded-3xl p-8 items-center">
          <AlertCircle size={64} color="white" />
          <Text className="text-white text-xl font-bold mt-4 text-center">
            Izin Kamera Diperlukan
          </Text>
          <Text className="text-white/80 text-center mt-3 leading-6">
            Aplikasi membutuhkan akses kamera untuk melakukan scan KTP
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-blue-500 rounded-full px-8 py-4 mt-6"
          >
            <Text className="text-white font-bold">
              Berikan Izin Kamera
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const uploadImage = async (uri: string) => {
    if (!uri || isProcessing) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      const fileName = uri.split("/").pop() || "image.jpg";
      const fileType = fileName.split(".").pop();

      formData.append("image", {
        uri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

      // Let axios/browser set multipart boundary automatically; axiosClient adds X-API-KEY
      const response = await axiosClient.post('/ocr/upload', formData);
      console.log("OCR result:", response.data);

      // Reset states

      setCapturedImage(null);
      setShowPreview(false);

      const tempId = response.data.tempId
      // Small delay before navigation to ensure state is updated
      setTimeout(() => {
        router.push(`/(mobile)/(home)/confirmation/${tempId}`);
      }, 100);

      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload image";
      alert(msg);
      console.log("Upload error:", err?.response?.data || err?.message || err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Ambil dari gallery
  const pickImageGallery = async () => {
    if (isProcessing || showPreview) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        console.log("Gallery image:", asset.uri);
        setCapturedImage(asset.uri);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Gagal mengambil foto dari gallery");
    }
  };

  // Ambil dari kamera
  const takePicture = async () => {
    if (!cameraRef.current || isScanning || showPreview) return;

    try {
      setIsScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photo?.uri) {
        console.log("Camera photo:", photo.uri);
        setCapturedImage(photo.uri);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Gagal mengambil foto");
    } finally {
      setIsScanning(false);
    }
  };

  // Handler untuk menggunakan foto yang sudah diambil
  const handleUsePhoto = () => {
    if (!capturedImage || isProcessing) return;
    uploadImage(capturedImage);
  };

  // Handler untuk mengambil ulang foto
  const handleRetakePhoto = () => {
    if (isProcessing) return;
    setCapturedImage(null);
    setShowPreview(false);
  };

  // Ukuran area scan KTP (rasio 85.6 x 53.98 mm)
  const scanAreaWidth = width * 0.85;
  const scanAreaHeight = scanAreaWidth * 0.63;

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* Camera View - hanya tampil kalau tidak preview */}
      {!showPreview && (
        <CameraView
          ref={cameraRef}
          facing={facing}
          flash={flash}
          style={{ flex: 1 }}
          className="flex-1"
          onCameraReady={() => console.log('Camera is ready')}
          onMountError={(error) => {
            console.error('Camera mount error:', error);
            Alert.alert('Error', 'Gagal mengakses kamera');
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
            >
              <X size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white font-bold text-lg">
              Scan KTP
            </Text>

            <TouchableOpacity
              onPress={toggleFlash}
              className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
            >
              {flash === 'on' ? (
                <Flashlight size={24} color="white" />
              ) : (
                <FlashlightOff size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Scan Area */}
          <View className="flex-1 items-center justify-center">
            <View className="flex-row">
              <View
                style={{
                  width: scanAreaWidth,
                  height: scanAreaHeight
                }}
                className="relative"
              >
                {/* Corner brackets */}
                {/* Top Left */}
                <View className="absolute top-0 left-0 w-8 h-8">
                  <View className="absolute top-0 left-0 w-8 h-1 bg-white" />
                  <View className="absolute top-0 left-0 w-1 h-8 bg-white" />
                </View>

                {/* Top Right */}
                <View className="absolute top-0 right-0 w-8 h-8">
                  <View className="absolute top-0 right-0 w-8 h-1 bg-white" />
                  <View className="absolute top-0 right-0 w-1 h-8 bg-white" />
                </View>

                {/* Bottom Left */}
                <View className="absolute bottom-0 left-0 w-8 h-8">
                  <View className="absolute bottom-0 left-0 w-8 h-1 bg-white" />
                  <View className="absolute bottom-0 left-0 w-1 h-8 bg-white" />
                </View>

                {/* Bottom Right */}
                <View className="absolute bottom-0 right-0 w-8 h-8">
                  <View className="absolute bottom-0 right-0 w-8 h-1 bg-white" />
                  <View className="absolute bottom-0 right-0 w-1 h-8 bg-white" />
                </View>

                {/* Scanning line animation */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: '#3B82F6',
                    shadowColor: '#3B82F6',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    transform: [{
                      translateY: scanAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, scanAreaHeight - 2],
                      }),
                    }],
                  }}
                />
                <View className="absolute inset-0 border-2 border-dashed border-white/50" />
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View className="absolute bottom-44 left-0 right-0 px-6">
            <Text className="text-white text-center text-base font-medium mb-2">
              Posisikan KTP dalam frame
            </Text>
            <Text className="text-white/70 text-center text-sm">
              Pastikan semua bagian KTP terlihat jelas dan tidak buram
            </Text>
          </View>

          {/* Bottom Controls */}
          <View className="absolute bottom-0 left-0 right-0 pb-10">
            <View className="flex-row items-center justify-center px-6">
              {/* Rotate camera button */}
              <TouchableOpacity
                onPress={toggleCameraFacing}
                disabled={isScanning}
                className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
              >
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>

              {/* Capture button */}
              <View className="flex-1 items-center mx-8">
                <TouchableOpacity
                  onPress={takePicture}
                  disabled={isScanning}
                  className={`w-20 h-20 rounded-full border-4 border-white items-center justify-center ${isScanning ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                >
                  {isScanning ? (
                    <View className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={32} color="white" />
                  )}
                </TouchableOpacity>

                {isScanning && (
                  <Text className="text-white text-sm mt-2">
                    Mengambil foto...
                  </Text>
                )}
              </View>

              {/* Gallery button */}
              <TouchableOpacity
                onPress={pickImageGallery}
                disabled={isScanning}
                className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
              >
                <Text className="text-white text-xs font-bold">
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}

      {/* Preview Modal */}
      {showPreview && capturedImage && (
        <View className="flex-1 bg-black">
          <StatusBar barStyle="light-content" backgroundColor="black" />

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-12 pb-4">
            <TouchableOpacity
              onPress={handleRetakePhoto}
              disabled={isProcessing}
              className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
            >
              <X size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white font-bold text-lg">
              Preview Foto
            </Text>

            <View className="w-12 h-12" />
          </View>

          {/* Image Preview */}
          <View className="flex-1 items-center justify-center px-6">
            <View
              style={{
                width: scanAreaWidth,
                height: scanAreaHeight
              }}
              className="bg-white rounded-lg overflow-hidden"
            >
              <Image
                source={{ uri: capturedImage }}
                style={{
                  width: '100%',
                  height: '100%'
                }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Instructions */}
          <View className="px-6 pb-6">
            <Text className="text-white text-center text-base font-medium mb-2">
              Apakah foto sudah jelas?
            </Text>
            <Text className="text-white/70 text-center text-sm mb-8">
              Pastikan semua teks pada KTP dapat terbaca dengan jelas
            </Text>

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={handleRetakePhoto}
                disabled={isProcessing}
                className="flex-1 bg-white/20 rounded-full py-4 flex-row items-center justify-center"
              >
                <RefreshCw size={20} color="white" />
                <Text className="text-white font-bold ml-2">
                  Ulangi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUsePhoto}
                disabled={isProcessing}
                className={`flex-1 rounded-full py-4 flex-row items-center justify-center ${isProcessing ? 'bg-blue-600' : 'bg-blue-500'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <Text className="text-white font-bold ml-2">
                      Memproses...
                    </Text>
                  </>
                ) : (
                  <>
                    <Check size={20} color="white" />
                    <Text className="text-white font-bold ml-2">
                      Gunakan Foto
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}