export interface QueueItem {
  id: string;
  number: string;
  nik: string;
  name: string;
  tempat_lahir?: string;
  tgl_lahir?: string;
  jenis_kelamin?: string;
  alamat?: string;
  agama?: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'onProcess' | 'waiting' | 'completed';
  estimatedTime: string;
}
