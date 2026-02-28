export interface Phrase {
  id: string;
  jaText: string;
  targetText: string;
  katakana: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  phrases: Phrase[];
  createdAt: number;
  updatedAt: number;
}

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  bcp47: string;
  flag: string;
  categories: Category[];
  createdAt: number;
  updatedAt: number;
}

export interface PhraseStore {
  schemaVersion: number;
  languages: Language[];
  lastUpdated: number;
}

export type PhraseInput   = Omit<Phrase,    'id' | 'createdAt' | 'updatedAt'>;
export type CategoryInput = Omit<Category,  'id' | 'phrases'   | 'createdAt' | 'updatedAt'>;
export type LanguageInput = Omit<Language,  'id' | 'categories'| 'createdAt' | 'updatedAt'>;

export interface TranslationResult {
  targetText: string;
  katakana: string;
  notes: string;
}

export interface SearchResult {
  phrase: Phrase;
  category: Category;
  language: Language;
}
