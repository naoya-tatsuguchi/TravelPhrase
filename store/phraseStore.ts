'use client';

import { create } from 'zustand';
import type { Language, Category, Phrase, LanguageInput, CategoryInput, PhraseInput } from '@/types/phrase';
import { saveLanguages } from '@/lib/db';
import { genId, now } from '@/lib/utils';

interface AppState {
  languages:        Language[];
  activeLanguageId: string | null;
  searchQuery:      string;
  isLoaded:         boolean;
  userId:           string | null;

  // bootstrap
  init: (languages: Language[]) => void;
  setUserId: (id: string | null) => void;

  // language
  setActiveLanguage: (id: string) => void;
  addLanguage:       (input: LanguageInput) => void;
  updateLanguage:    (id: string, input: Partial<LanguageInput>) => void;
  deleteLanguage:    (id: string) => void;

  // category
  addCategory:    (langId: string, input: CategoryInput) => void;
  updateCategory: (langId: string, catId: string, input: Partial<CategoryInput>) => void;
  deleteCategory: (langId: string, catId: string) => void;

  // phrase
  addPhrase:    (langId: string, catId: string, input: PhraseInput) => void;
  updatePhrase: (langId: string, catId: string, phraseId: string, input: Partial<PhraseInput>) => void;
  deletePhrase: (langId: string, catId: string, phraseId: string) => void;

  // search
  setSearchQuery: (q: string) => void;
}

function persist(languages: Language[], userId: string | null) {
  saveLanguages(languages, userId).catch(console.error);
}

export const useAppStore = create<AppState>((set, get) => ({
  languages:        [],
  activeLanguageId: null,
  searchQuery:      '',
  isLoaded:         false,
  userId:           null,

  init(languages) {
    set({ languages, activeLanguageId: languages[0]?.id ?? null, isLoaded: true });
  },

  setUserId(id) {
    set({ userId: id });
  },

  setActiveLanguage(id) {
    set({ activeLanguageId: id });
  },

  addLanguage(input) {
    const lang: Language = {
      ...input,
      id:         genId(),
      categories: [],
      createdAt:  now(),
      updatedAt:  now(),
    };
    const languages = [...get().languages, lang];
    set({ languages, activeLanguageId: lang.id });
    persist(languages, get().userId);
  },

  updateLanguage(id, input) {
    const languages = get().languages.map(l =>
      l.id === id ? { ...l, ...input, updatedAt: now() } : l
    );
    set({ languages });
    persist(languages, get().userId);
  },

  deleteLanguage(id) {
    const languages = get().languages.filter(l => l.id !== id);
    const activeLanguageId =
      get().activeLanguageId === id ? (languages[0]?.id ?? null) : get().activeLanguageId;
    set({ languages, activeLanguageId });
    persist(languages, get().userId);
  },

  addCategory(langId, input) {
    const cat: Category = {
      ...input,
      id:        genId(),
      phrases:   [],
      createdAt: now(),
      updatedAt: now(),
    };
    const languages = get().languages.map(l =>
      l.id === langId
        ? { ...l, categories: [...l.categories, cat], updatedAt: now() }
        : l
    );
    set({ languages });
    persist(languages, get().userId);
  },

  updateCategory(langId, catId, input) {
    const languages = get().languages.map(l =>
      l.id !== langId ? l : {
        ...l,
        categories: l.categories.map(c =>
          c.id === catId ? { ...c, ...input, updatedAt: now() } : c
        ),
        updatedAt: now(),
      }
    );
    set({ languages });
    persist(languages, get().userId);
  },

  deleteCategory(langId, catId) {
    const languages = get().languages.map(l =>
      l.id !== langId ? l : {
        ...l,
        categories: l.categories.filter(c => c.id !== catId),
        updatedAt:  now(),
      }
    );
    set({ languages });
    persist(languages, get().userId);
  },

  addPhrase(langId, catId, input) {
    const phrase: Phrase = {
      ...input,
      id:        genId(),
      createdAt: now(),
      updatedAt: now(),
    };
    const languages = get().languages.map(l =>
      l.id !== langId ? l : {
        ...l,
        categories: l.categories.map(c =>
          c.id !== catId ? c : {
            ...c,
            phrases:   [...c.phrases, phrase],
            updatedAt: now(),
          }
        ),
        updatedAt: now(),
      }
    );
    set({ languages });
    persist(languages, get().userId);
  },

  updatePhrase(langId, catId, phraseId, input) {
    const languages = get().languages.map(l =>
      l.id !== langId ? l : {
        ...l,
        categories: l.categories.map(c =>
          c.id !== catId ? c : {
            ...c,
            phrases: c.phrases.map(p =>
              p.id === phraseId ? { ...p, ...input, updatedAt: now() } : p
            ),
            updatedAt: now(),
          }
        ),
        updatedAt: now(),
      }
    );
    set({ languages });
    persist(languages, get().userId);
  },

  deletePhrase(langId, catId, phraseId) {
    const languages = get().languages.map(l =>
      l.id !== langId ? l : {
        ...l,
        categories: l.categories.map(c =>
          c.id !== catId ? c : {
            ...c,
            phrases:   c.phrases.filter(p => p.id !== phraseId),
            updatedAt: now(),
          }
        ),
        updatedAt: now(),
      }
    );
    set({ languages });
    persist(languages, get().userId);
  },

  setSearchQuery(q) {
    set({ searchQuery: q });
  },
}));
