
export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleApiResponse {
  reference: string;
  verses: Verse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface Favorito {
  id: string; // bookSigla:cap:verse:translation
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  date: string;
}

export interface BookOverview {
  title: string;
  desc: string;
  context: string;
  theme: string;
  key: string;
  christ: string;
  videoId: string | null;
}

export interface BibleMapEntry {
  name: string;
  theme: string;
}

export interface VideoEntry {
  id: string;
  title: string;
  channel: string;
}

export interface WorshipEntry {
  title: string;
  artist: string;
  id: string;
}

export type ToolType = 'texto' | 'video' | 'devocional' | 'comentario' | 'pesquisa' | 'pregacao' | 'louvor' | 'mapa';

export interface ReadingQuery {
  sigla: string;
  cap: number;
}

export interface BiblicalEra {
  id: string;
  title: string;
  description: string;
  startDay: string;
  endDay: string;
  color: string;
  icon: string;
  year: string;
  yearBC: number;
  dispensation?: string;
  bgColor?: string;
}

export interface Empire {
  id: string;
  name: string;
  ruler: string;
  startYearBC: number;
  endYearBC: number;
}

export interface King {
  id: string;
  name: string;
  reignYears: string;
  startYearBC: number;
  endYearBC: number;
  kingdom: 'North' | 'South' | 'United';
}

export interface Prophet {
  id: string;
  name: string;
  location: 'North' | 'South' | 'Both';
  born?: string;
  died?: string;
  period: string; // Period/Reign of specific kings
  years?: string; // Years BC
  startYearBC: number;
  endYearBC: number;
  summary?: string;
}

export interface KingsDatabase {
  united: King[];
  north: King[]; // Israel
  south: King[]; // Judah
}

export interface ProphetsDatabase {
  prophets: Prophet[];
}
