'use client';

import { useMemo } from 'react';
import type { Language, SearchResult } from '@/types/phrase';

export function useSearch(languages: Language[], query: string): SearchResult[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];
    for (const language of languages) {
      for (const category of language.categories) {
        for (const phrase of category.phrases) {
          const haystack = [
            phrase.jaText,
            phrase.targetText,
            phrase.katakana,
            phrase.notes ?? '',
          ].join(' ').toLowerCase();

          if (haystack.includes(q)) {
            results.push({ phrase, category, language });
          }
        }
      }
    }
    return results;
  }, [languages, query]);
}
