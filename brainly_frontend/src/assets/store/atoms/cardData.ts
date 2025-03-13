import { atom } from 'recoil';

export const cardDataAtom = atom({
  key: 'cardDataAtom',
  default: []
});

export const cardDataAtomPersist = atom({
  key: 'cardDataAtomPersist',
  default: []
});
