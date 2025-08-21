import {atom} from 'jotai'


export const filterAtom = atom('all')

export const queueDataAtom = atom<string[][]>([]);