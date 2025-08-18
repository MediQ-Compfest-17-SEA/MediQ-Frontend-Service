import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Lock,
  Stethoscope,
  CheckCircle,
  MapPin,
  CreditCard
} from 'lucide-react-native';

import { Form } from '@/components/form/Form';
import { FormField } from '@/components/form/FormField';
import { FormLabel } from '@/components/form/FormLabel';
import { VStack } from '@/components/ui/vstack/index.web';
import { TextInput } from 'react-native';
import { FormMessage } from '@/components/form/FormMessage';
import { useRouter } from 'expo-router';


interface OcrData {
  nik: string;
  nama: string;
  tempat_lahir: string;
  tgl_lahir: string;
  jenis_kelamin: string;
  agama: string;
  status_perkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  alamat: {
    name: string;
    rt_rw: string;
    kel_desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
  };
  email: string;
  password: string;
  jenisLayanan: string;

}

const confirmationSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  tempat_lahir: z.string().min(1, 'Tempat lahir harus diisi'),
  tgl_lahir: z.string().min(1, 'Tanggal lahir harus diisi'),
  jenis_kelamin: z.string().min(1, 'Jenis kelamin harus diisi'),
  agama: z.string().min(1, 'Agama harus diisi'),
  status_perkawinan: z.string().min(1, 'Status perkawinan harus diisi'),
  pekerjaan: z.string().min(1, 'Pekerjaan harus diisi'),
  kewarganegaraan: z.string().min(1, 'Kewarganegaraan harus diisi'),
  alamat: z.object({
    name: z.string().min(1, 'Alamat harus diisi'),
    rt_rw: z.string().min(1, 'RT/RW harus diisi'),
    kel_desa: z.string().min(1, 'Kelurahan/Desa harus diisi'),
    kecamatan: z.string().min(1, 'Kecamatan harus diisi'),
    kabupaten: z.string().min(1, 'Kabupaten harus diisi'),
    provinsi: z.string().min(1, 'Provinsi harus diisi'),
  }),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  jenisLayanan: z.string().min(1, 'Pilih jenis layanan'),
});

export default function ConfirmationScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ocrData = {
    nik: "1234567890123456",
    nama: "RIJAL MUHYIDIN",
    tempat_lahir: "PALEMBANG",
    tgl_lahir: "10-10-1999",
    jenis_kelamin: "LAKI-LAKI",
    agama: "ISLAM",
    status_perkawinan: "BELUM KAWIN",
    pekerjaan: "PELAJAR/MAHASISWA",
    kewarganegaraan: "WNI",
    alamat: {
      name: "DUSUN 1 OGAN 5",
      rt_rw: "001/002",
      kel_desa: "SUNGAI ARE",
      kecamatan: "ALANG-ALANG LEBAR",
      kabupaten: "OGAN ILIR",
      provinsi: "SUMATERA SELATAN"
    }
  };

  const methods = useForm({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      nik: ocrData.nik,
      nama: ocrData.nama,
      tempat_lahir: ocrData.tempat_lahir,
      tgl_lahir: ocrData.tgl_lahir,
      jenis_kelamin: ocrData.jenis_kelamin,
      agama: ocrData.agama,
      status_perkawinan: ocrData.status_perkawinan,
      pekerjaan: ocrData.pekerjaan,
      kewarganegaraan: ocrData.kewarganegaraan,
      alamat: {
        name: ocrData.alamat.name,
        rt_rw: ocrData.alamat.rt_rw,
        kel_desa: ocrData.alamat.kel_desa,
        kecamatan: ocrData.alamat.kecamatan,
        kabupaten: ocrData.alamat.kabupaten,
        provinsi: ocrData.alamat.provinsi,
      },
      email: '',
      password: '',
      jenisLayanan: '',
    },
  });

  const { handleSubmit, watch } = methods;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSubmit = async (data: OcrData) => {
    setIsSubmitting(true);
    try {
      // Restructure data untuk API
      const payload = {
        nik: data.nik,
        nama: data.nama,
        tempat_lahir: data.tempat_lahir,
        tgl_lahir: data.tgl_lahir,
        jenis_kelamin: data.jenis_kelamin,
        agama: data.agama,
        status_perkawinan: data.status_perkawinan,
        pekerjaan: data.pekerjaan,
        kewarganegaraan: data.kewarganegaraan,
        alamat: {
          name: data.alamat.name,
          rt_rw: data.alamat.rt_rw,
          kel_desa: data.alamat.kel_desa,
          kecamatan: data.alamat.kecamatan,
          kabupaten: data.alamat.kabupaten,
          provinsi: data.alamat.provinsi,
        },
        email: data.email,
        password: data.password,
        jenisLayanan: data.jenisLayanan,
      };

      // Hit API untuk submit form
      console.log('Submitting payload:', payload);

    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Gagal menyimpan data. Silakan coba lagi.');
    }
  };
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  // Nanti jenis layanan akan diambil dari API berdasarkan institusi
  const jenisLayananOptions = [
    { value: 'poli-umum', label: 'Poli Umum' },
    { value: 'poli-gigi', label: 'Poli Gigi' },
    { value: 'poli-anak', label: 'Poli Anak' },
    { value: 'poli-mata', label: 'Poli Mata' },
    { value: 'apotek', label: 'Apotek' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={goBack}
            className="w-10 h-10 items-center justify-center"
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <Text className="text-gray-800 text-lg font-bold">
            Konfirmasi Data Pasien
          </Text>

          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="px-6 pt-6"
        >
          {/* OCR Result Header */}
          <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <CheckCircle size={20} color="#10B981" />
              <Text className="text-green-700 font-semibold ml-2">
                Data KTP Berhasil Dideteksi
              </Text>
            </View>
            <Text className="text-green-600 text-sm">
              Periksa dan koreksi data jika diperlukan, lalu lengkapi data tambahan
            </Text>
          </View>

          <Form methods={methods}>
            {/* Data Identitas */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <CreditCard size={20} color="#3B82F6" />
                <Text className="text-gray-800 font-bold text-lg ml-2">
                  Data Identitas
                </Text>
                <View className="ml-auto bg-blue-100 px-2 py-1 rounded-md">
                  <Text className="text-blue-600 text-xs font-medium">
                    Dapat diedit
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>NIK</FormLabel>
                  <FormField
                    name="nik"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="16 digit NIK"
                        keyboardType="numeric"
                        maxLength={16}
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="nik" />
                </View>

                <View>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormField
                    name="nama"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Masukkan nama lengkap"
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />

                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <FormLabel>Tempat Lahir</FormLabel>
                      <FormField
                        name="tempat_lahir"
                        render={({ value, onChange, onBlur }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Tempat lahir"
                            className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                          />
                        )}
                      />
                      <FormMessage name="tempat_lahir" />
                    </View>

                    <View className="flex-1">
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormField
                        name="tgl_lahir"
                        render={({ value, onChange, onBlur }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="DD-MM-YYYY"
                            className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                          />
                        )}
                      />
                      <FormMessage name="tgl_lahir" />
                    </View>
                  </View>

                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <FormField
                        name="jenis_kelamin"
                        render={({ value, onChange, onBlur }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Jenis kelamin"
                            className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                          />
                        )}
                      />
                      <FormMessage name="jenis_kelamin" />
                    </View>

                    <View className="flex-1">
                      <FormLabel>Agama</FormLabel>
                      <FormField
                        name="agama"
                        render={({ value, onChange, onBlur }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="Agama"
                            className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                          />
                        )}
                      />
                      <FormMessage name="agama" />
                    </View>
                  </View>

                  <View>
                    <FormLabel>Status Perkawinan</FormLabel>
                    <FormField
                      name="status_perkawinan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Status perkawinan"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="status_perkawinan" />
                  </View>

                  <View>
                    <FormLabel>Pekerjaan</FormLabel>
                    <FormField
                      name="pekerjaan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Pekerjaan"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="pekerjaan" />
                  </View>

                  <View>
                    <FormLabel>Kewarganegaraan</FormLabel>
                    <FormField
                      name="kewarganegaraan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kewarganegaraan"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="kewarganegaraan" />
                  </View>
                </View>
              </VStack>
            </View>

            {/* Data Alamat */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <MapPin size={20} color="#10B981" />
                <Text className="text-gray-800 font-bold text-lg ml-2">
                  Alamat Lengkap
                </Text>
                <View className="ml-auto bg-green-100 px-2 py-1 rounded-md">
                  <Text className="text-green-600 text-xs font-medium">
                    Dapat diedit
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>Alamat</FormLabel>
                  <FormField
                    name="alamat_name"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Alamat lengkap"
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="alamat_name" />
                </View>

                <View>
                  <FormLabel>RT/RW</FormLabel>
                  <FormField
                    name="alamat_rt_rw"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="001/002"
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="alamat_rt_rw" />
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <FormLabel>Kelurahan/Desa</FormLabel>
                    <FormField
                      name="alamat_kel_desa"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kelurahan/Desa"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat_kel_desa" />
                  </View>

                  <View className="flex-1">
                    <FormLabel>Kecamatan</FormLabel>
                    <FormField
                      name="alamat_kecamatan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kecamatan"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat_kecamatan" />
                  </View>
                </View>

                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <FormLabel>Kabupaten</FormLabel>
                    <FormField
                      name="alamat_kabupaten"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kabupaten"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat_kabupaten" />
                  </View>

                  <View className="flex-1">
                    <FormLabel>Provinsi</FormLabel>
                    <FormField
                      name="alamat_provinsi"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Provinsi"
                          className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                        />
                      )}
                    />
                    <FormMessage name="alamat_provinsi" />
                  </View>
                </View>
              </VStack>
            </View>

            {/* Data Login */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Lock size={20} color="#8B5CF6" />
                <Text className="text-gray-800 font-bold text-lg ml-2">
                  Data Login
                </Text>
                <View className="ml-auto bg-purple-100 px-2 py-1 rounded-md">
                  <Text className="text-purple-600 text-xs font-medium">
                    Wajib diisi
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>Email</FormLabel>
                  <FormField
                    name="email"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="contoh@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="email" />
                </View>

                <View>
                  <FormLabel>Password</FormLabel>
                  <FormField
                    name="password"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Minimal 6 karakter"
                        secureTextEntry
                        className="mt-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                      />
                    )}
                  />
                  <FormMessage name="password" />
                </View>
              </VStack>
            </View>

            {/* Pilih Layanan */}
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <Stethoscope size={20} color="#EF4444" />
                <Text className="text-gray-800 font-bold text-lg ml-2">
                  Pilih Layanan
                </Text>
                <View className="ml-auto bg-red-100 px-2 py-1 rounded-md">
                  <Text className="text-red-600 text-xs font-medium">
                    Pilih satu
                  </Text>
                </View>
              </View>

              <FormField
                name="jenisLayanan"
                render={({ value, onChange }) => (
                  <VStack space="sm">
                    {jenisLayananOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        className={`p-4 rounded-xl border-2 ${value === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                          }`}
                      >
                        <View className="flex-row items-center">
                          <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${value === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                            }`}>
                            {value === option.value && (
                              <View className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </View>
                          <Text className={`font-medium ${value === option.value ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                            {option.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </VStack>
                )}
              />
              <FormMessage name="jenisLayanan" />
            </View>
          </Form>
        </Animated.View>
      </ScrollView>

      {/* Bottom Submit Button */}
      <View className="bg-white px-6 py-4 shadow-lg">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`rounded-full py-4 px-6 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
            }`}
        >
          <View className="flex-row items-center justify-center">
            {isSubmitting ? (
              <>
                <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                <Text className="text-white font-bold text-base">
                  Mendaftar Antrean...
                </Text>
              </>
            ) : (
              <>
                <CheckCircle size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Daftar Antrean
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}