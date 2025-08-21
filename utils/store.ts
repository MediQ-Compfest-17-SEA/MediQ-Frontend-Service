import { atomWithStorage } from 'jotai/utils';
import {atom} from 'jotai';

interface User {
  id: string;
  name: string;
  ktp: string;
  email: string;
  phone: string;
  status: string;
}

interface SelectedUser {
  index: number;
  data: string[];
}

export const filterAtom = atomWithStorage<string>('filter', 'all');
export const loadingAtom = atom<boolean>(true);
export const userDataAtom = atomWithStorage<string[][]>('userData', []);
export const selectedAtom = atomWithStorage<SelectedUser | null>('selected', null);
export const queueDataAtom = atomWithStorage<string[][]>('queue', []);
export const showModalAtom = atomWithStorage<boolean>('showModal', false);