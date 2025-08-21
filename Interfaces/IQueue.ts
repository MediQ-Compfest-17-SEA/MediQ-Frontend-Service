export interface QueueItem {
  id: number;
  number: string;
  name: string;
  status: 'onProcess' | 'waiting' | 'completed';
  estimatedTime: string;
}
