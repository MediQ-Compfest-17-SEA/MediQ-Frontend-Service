import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { 
  X, 
  Camera, 
  Flashlight, 
  FlashlightOff, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react-native';
import { router, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();
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

  const takePicture = async () => {
    if (isScanning || !cameraRef.current) return;
    setIsScanning(true);
    
  };



  // Ukuran area scan KTP (rasio 85.6 x 53.98 mm)
  const scanAreaWidth = width * 0.85;
  const scanAreaHeight = scanAreaWidth * 0.63; 

  return (
    <View className="flex-1  bg-black">
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }}
        flash="auto"
        className="flex-1"
        onCameraReady={() => console.log('Camera is ready')}
        onMountError={(error) => {
          console.error('Camera mount error:', error);
          Alert.alert('Error', 'Gagal mengakses kamera');
        }
      }
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
        <View className="flex-1 items-center justify-center">
          <View className="flex-row">            
            {/* Scan area */}
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

              {/* Dotted border */}
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

        {/* Bottom controls */}
        <View className="absolute bottom-0 left-0 right-0 pb-10">
          <View className="flex-row items-center justify-center px-6">
            {/* Rotate camera button */}
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>

            {/* Capture button */}
            <View className="flex-1 items-center mx-8">
              <TouchableOpacity
                onPress={takePicture}
                disabled={isScanning}
                className={`w-20 h-20 rounded-full border-4 border-white items-center justify-center ${
                  isScanning ? 'bg-blue-500' : 'bg-white/20'
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
                  Memproses...
                </Text>
              )}
            </View>

            {/* Gallery/Manual input button */}
            <TouchableOpacity
              onPress={() => console.log('Open gallery or manual input')}
              className="w-14 h-14 bg-white/20 rounded-full items-center justify-center"
            >
              <Text className="text-white text-xs font-bold">
                Manual
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success overlay jika sudah scan */}
        {scannedData && (
          <View className="absolute inset-0 bg-black/80 items-center justify-center">
            <View className="bg-white rounded-3xl p-8 mx-6 items-center">
              <TouchableOpacity
                onPress={() => router.push('/(mobile)/(home)/confirmation')}
                className="bg-blue-500 rounded-full px-8 py-4 mt-6 w-full"
              >
                <Text className="text-white font-bold text-center">
                  Lanjutkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </CameraView>
    </View>
  );
}