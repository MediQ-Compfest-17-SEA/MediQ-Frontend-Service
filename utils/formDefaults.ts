import { OcrData } from '@/Interfaces/IUser';

// Utility untuk bikin defaultValues dari OcrData
export const buildFormDefaults = (ocrData?: OcrData) => ({
  nik: ocrData?.nik || '',
  nama: ocrData?.nama || '',
  tempat_lahir: ocrData?.tempat_lahir || '',
  tgl_lahir: ocrData?.tgl_lahir || '',
  jenis_kelamin: ocrData?.jenis_kelamin || '',
  agama: ocrData?.agama || '',
  status_perkawinan: ocrData?.status_perkawinan || '',
  pekerjaan: ocrData?.pekerjaan || '',
  kewarganegaraan: ocrData?.kewarganegaraan || '',
  alamat: {
    name: ocrData?.alamat?.name || '',
    rt_rw: ocrData?.alamat?.rt_rw || '',
    kel_desa: ocrData?.alamat?.kel_desa || '',
    kecamatan: ocrData?.alamat?.kecamatan || '',
    kabupaten: ocrData?.alamat?.kabupaten || '',
    provinsi: ocrData?.alamat?.provinsi || '',
  },
  email: ocrData?.email || '',
  password: '',
  notes: ocrData?.notes || '',
  institution: {
    id: ocrData?.institution?.id || '',
    name: ocrData?.institution?.name || '',
    code: ocrData?.institution?.code || '',
    address: ocrData?.institution?.address || '',
    phone: ocrData?.institution?.phone || '',
    email: ocrData?.institution?.email || '',
    type: ocrData?.institution?.type || '',
  }
});
