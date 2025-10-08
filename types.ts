export enum Language {
  BODO = 'Bodo',
  ENGLISH = 'English',
}

export interface Phrase {
  english: string;
  bodo: string;
  pronunciation: string;
}

export interface User {
  name: string;
  points: number;
}
