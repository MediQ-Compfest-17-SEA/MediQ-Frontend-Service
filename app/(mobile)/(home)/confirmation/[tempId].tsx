import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  TextInput
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
  CreditCard,
  Building2,
  StickyNote
} from 'lucide-react-native';

import { Form } from '@/components/form/Form';
import { FormField } from '@/components/form/FormField';
import { FormLabel } from '@/components/form/FormLabel';
import { VStack } from '@/components/ui/vstack';
import { FormMessage } from '@/components/form/FormMessage';
import { useRouter } from 'expo-router';
import { OcrData } from '@/Interfaces/IUser';
import { useSearchParams } from 'expo-router/build/hooks';
import { useAtom } from 'jotai';
import { loadingAtom, ocrDataAtom } from '@/utils/store';
import axiosClient from '@/lib/axios';
import { buildFormDefaults } from '@/utils/formDefaults';
import { storage } from '@/utils/storage';
import socket from '@/lib/socket';

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
  notes: z.string().optional(),
  institution: z.object({
    name: z.string().min(2, 'Nama institusi minimal 2 karakter'),
    code: z.string().min(1, 'Kode institusi harus diisi'),
    address: z.string().min(5, 'Alamat institusi minimal 5 karakter'),
    phone: z.string().min(10, 'Nomor telepon institusi minimal 10 karakter'),
    email: z.string().email('Format email tidak valid'),
    type: z.string().min(1, 'Tipe institusi harus diisi'),
  }),
});

export default function ConfirmationScreen() {
  const tempId = useSearchParams().get('tempId');
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [ocrData, setOcrData] = useAtom(ocrDataAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  // Memoize default values untuk mencegah re-creation
  const defaultValues = useMemo(() => {
    return buildFormDefaults(ocrData ?? undefined);
  }, [ocrData]);

  const methods = useForm<OcrData>({
    resolver: zodResolver(confirmationSchema),
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, reset, setValue, watch } = methods;

  // Watch semua values untuk debugging
  const watchedValues = watch();

  // Fetch OCR data
  useEffect(() => {
    if (!tempId || formInitialized) return;

    setLoading(true);
    setDataLoaded(false);

    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/ocr/temp/${tempId}`);
        const result = response.data.data.result;
        console.log('OCR Response:', result);

        if (result) {
          setOcrData(result);

          // Set form values satu per satu untuk memastikan tidak ada yang hilang
          const formDefaults = buildFormDefaults(result);

          // Reset form dengan values baru
          reset(formDefaults);

          // Set individual values sebagai backup
          Object.keys(formDefaults).forEach(key => {
            if (key === 'alamat') {
              Object.keys(formDefaults.alamat).forEach(alamatKey => {
                setValue(`alamat.${alamatKey}` as any, formDefaults.alamat[alamatKey as keyof typeof formDefaults.alamat]);
              });
            } else if (key === 'institution') {
              Object.keys(formDefaults.institution).forEach(institutionKey => {
                setValue(`institution.${institutionKey}` as any, formDefaults.institution[institutionKey as keyof typeof formDefaults.institution]);
              });
            } else {
              setValue(key as any, formDefaults[key as keyof typeof formDefaults]);
            }
          });

          setDataLoaded(true);
          setFormInitialized(true);
          console.log('Form values set successfully:', formDefaults);
        }
      } catch (err) {
        Alert.alert('Error', 'Gagal mengambil data OCR: ' + err);
        console.error('Error Page Confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tempId, formInitialized]);

  // Debug log untuk melihat current form values
  useEffect(() => {
    console.log('Current form values:', watchedValues);
  }, [watchedValues]);

  // Animasi masuk - hanya jalankan setelah data loaded
  useEffect(() => {
    if (dataLoaded || !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    }
  }, [dataLoaded, loading, fadeAnim, slideAnim]);

  const onSubmit = async (data: OcrData) => {
    setLoading(true);
    try {
      console.log('Submitting data:', data);
      // Confirm temp and create user + enqueue in backend (body may accept institutionId only; include from form if available)
      const body: any = {};
      if ((data as any)?.institution?.id || (data as any)?.institution?.code) {
        body.institutionId = (data as any).institution?.id || (data as any).institution?.code;
      }
      const response = await axiosClient.post(`/ocr/confirm-temp/${tempId}`, body);
      const payload = response?.data?.data ?? response?.data ?? {};
      console.log('Response from server:', response.data);

      // Persist tokens if provided by backend (various shapes supported)
      const tokens = payload.tokens || payload.data?.tokens || payload.tokensJson || null;
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      if (tokens) {
        try {
          const t = typeof tokens === 'string' ? JSON.parse(tokens) : tokens;
          accessToken = t?.accessToken || t?.access_token || null;
          refreshToken = t?.refreshToken || t?.refresh_token || null;
        } catch {
          // ignore parse error
        }
      }
      if (accessToken) {
        await storage.setItem('token', accessToken);
        // hydrate socket with token for authenticated channels
        socket.setToken(accessToken);
      }
      if (refreshToken) {
        await storage.setItem('refreshToken', refreshToken);
      }

      // Derive userId and institutionId for navigation, fallback to form/inferred
      const userId =
        payload.userId ||
        payload.data?.userId ||
        String(tempId || '');

      const institutionId =
        payload.institutionId ||
        payload.data?.institutionId ||
        (data as any)?.institution?.id ||
        (data as any)?.institution?.code ||
        'default-inst';

      Alert.alert('Sukses', 'Data pasien berhasil disimpan!');
      router.push(`/(mobile)/(home)/waiting-list/${institutionId}/${userId}`);
      return payload;
    } catch (err) {
      Alert.alert('Error', 'Gagal menyimpan data.');
      console.log('Error Page Confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => router.back();

  if (loading && !dataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 16, color: '#374151' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={goBack}
            style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <Text style={{ color: '#1F2937', fontSize: 18, fontWeight: 'bold' }}>
            Konfirmasi Data Pasien
          </Text>

          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled" // Tambahkan ini untuk menghindari keyboard dismiss
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 24,
            paddingTop: 24
          }}
        >
          {/* OCR Result Header */}
          <View style={{
            backgroundColor: '#ECFDF5',
            borderWidth: 1,
            borderColor: '#BBF7D0',
            borderRadius: 16,
            padding: 16,
            marginBottom: 24
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={{ color: '#065F46', fontWeight: '600', marginLeft: 8 }}>
                Data KTP Berhasil Dideteksi
              </Text>
            </View>
            <Text style={{ color: '#047857', fontSize: 14 }}>
              Periksa dan koreksi data jika diperlukan, lalu lengkapi data tambahan
            </Text>
          </View>

          <Form methods={methods}>
            {/* Data Identitas */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <CreditCard size={20} color="#3B82F6" />
                <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                  Data Identitas
                </Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#1D4ED8', fontSize: 12, fontWeight: '500' }}>
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="16 digit NIK"
                        keyboardType="numeric"
                        maxLength={16}
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Masukkan nama lengkap"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="nama" />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormField
                      name="tempat_lahir"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Tempat lahir"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="tempat_lahir" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormField
                      name="tgl_lahir"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="DD-MM-YYYY"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="tgl_lahir" />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <FormField
                      name="jenis_kelamin"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Jenis kelamin"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="jenis_kelamin" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <FormLabel>Agama</FormLabel>
                    <FormField
                      name="agama"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Agama"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Status perkawinan"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Pekerjaan"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Kewarganegaraan"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="kewarganegaraan" />
                </View>
              </VStack>
            </View>

            {/* Data Alamat */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <MapPin size={20} color="#10B981" />
                <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                  Alamat Lengkap
                </Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#047857', fontSize: 12, fontWeight: '500' }}>
                    Dapat diedit
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>Alamat</FormLabel>
                  <FormField
                    name="alamat.name"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Alamat lengkap"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="alamat.name" />
                </View>

                <View>
                  <FormLabel>RT/RW</FormLabel>
                  <FormField
                    name="alamat.rt_rw"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="001/002"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="alamat.rt_rw" />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormLabel>Kelurahan/Desa</FormLabel>
                    <FormField
                      name="alamat.kel_desa"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kelurahan/Desa"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="alamat.kel_desa" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <FormLabel>Kecamatan</FormLabel>
                    <FormField
                      name="alamat.kecamatan"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kecamatan"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="alamat.kecamatan" />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <FormLabel>Kabupaten</FormLabel>
                    <FormField
                      name="alamat.kabupaten"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Kabupaten"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="alamat.kabupaten" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <FormLabel>Provinsi</FormLabel>
                    <FormField
                      name="alamat.provinsi"
                      render={({ value, onChange, onBlur }) => (
                        <TextInput
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Provinsi"
                          style={{
                            marginTop: 8,
                            backgroundColor: '#F9FAFB',
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            color: '#1F2937'
                          }}
                        />
                      )}
                    />
                    <FormMessage name="alamat.provinsi" />
                  </View>
                </View>
              </VStack>
            </View>

            {/* Data Login */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Lock size={20} color="#8B5CF6" />
                <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                  Data Login
                </Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#EDE9FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#7C3AED', fontSize: 12, fontWeight: '500' }}>
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="contoh@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
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
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Minimal 6 karakter"
                        secureTextEntry
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="password" />
                </View>
              </VStack>
            </View>

            {/* Data Institusi */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Building2 size={20} color="#F59E0B" />
                <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                  Data Institusi
                </Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#D97706', fontSize: 12, fontWeight: '500' }}>
                    Wajib diisi
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>Nama Institusi</FormLabel>
                  <FormField
                    name="institution.name"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Nama institusi"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.name" />
                </View>

                <View>
                  <FormLabel>Kode Institusi</FormLabel>
                  <FormField
                    name="institution.code"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Kode institusi"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.code" />
                </View>

                <View>
                  <FormLabel>Alamat Institusi</FormLabel>
                  <FormField
                    name="institution.address"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Alamat institusi"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.address" />
                </View>

                <View>
                  <FormLabel>Tipe Institusi</FormLabel>
                  <FormField
                    name="institution.type"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Tipe (misal: poli klinik, poli gigi)"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.type" />
                </View>

                <View>
                  <FormLabel>Telepon Institusi</FormLabel>
                  <FormField
                    name="institution.phone"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="No telepon"
                        keyboardType="phone-pad"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.phone" />
                </View>

                <View>
                  <FormLabel>Email Institusi</FormLabel>
                  <FormField
                    name="institution.email"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Email institusi"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937'
                        }}
                      />
                    )}
                  />
                  <FormMessage name="institution.email" />
                </View>
              </VStack>
            </View>

            {/* Field Notes */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <StickyNote size={20} color="#6366F1" />
                <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>
                  Catatan
                </Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#5B21B6', fontSize: 12, fontWeight: '500' }}>
                    Opsional
                  </Text>
                </View>
              </View>

              <VStack space="md">
                <View>
                  <FormLabel>Notes</FormLabel>
                  <FormField
                    name="notes"
                    render={({ value, onChange, onBlur }) => (
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Tulis catatan tambahan..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={{
                          marginTop: 8,
                          backgroundColor: '#F9FAFB',
                          borderWidth: 1,
                          borderColor: '#E5E7EB',
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          color: '#1F2937',
                          height: 96
                        }}
                      />
                    )}
                  />
                  <FormMessage name="notes" />
                </View>
              </VStack>
            </View>
          </Form>
        </Animated.View>
      </ScrollView>

      {/* Bottom Submit Button */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5
      }}>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit, (errors) => {
            console.log("Form validation errors:", errors);
            Alert.alert("Form Error", "Ada field yang belum diisi dengan benar");
          })}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
            borderRadius: 24,
            paddingVertical: 16,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? (
              <>
                <View style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: 'white',
                  borderTopColor: 'transparent',
                  borderRadius: 10,
                  marginRight: 12
                }} />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Mendaftar Antrean...
                </Text>
              </>
            ) : (
              <>
                <CheckCircle size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
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