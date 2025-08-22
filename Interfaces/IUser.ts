import { InstitutionProps } from "./IInstitusi";

export interface OcrData {
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
  institution: InstitutionProps;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  ktp: string;
  email: string;
  phone: string;
  status: string;
}

export interface SelectedUser {
  index: number;
  data: string[];
}


export interface UserFormData {
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
}