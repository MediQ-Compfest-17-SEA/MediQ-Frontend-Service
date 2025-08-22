import { atomWithStorage } from 'jotai/utils';
import {atom} from 'jotai';
import { OcrData, SelectedUser } from '@/Interfaces/IUser';
import { QueueItem } from '@/Interfaces/IQueue';



export const filterAtom = atomWithStorage<string>('filter', 'all');
export const loadingAtom = atom<boolean>(true);
export const userDataAtom = atomWithStorage<string[][]>('userData', []);
export const selectedAtom = atomWithStorage<SelectedUser | null>('selected', null);
export const queueDataAtom = atomWithStorage<string[][]>('queue', []);
export const showModalAtom = atom<boolean>(false);

export const userQueueAtom = atomWithStorage<QueueItem[]>('userQueue', []);

export const showDeleteDialogAtom = atom(false);
export const deleteIndexAtom = atom<number | null>(null);

export const showActionDialogAtom = atom(false);
export const actionIndexAtom = atom<number | null>(null);

export const ocrDataAtom = atomWithStorage<OcrData | null>('ocrData', null);
