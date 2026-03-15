import { createClient } from '@/lib/supabase/client';
import type { PhraseStore } from '@/types/phrase';
import { INITIAL_LANGUAGES } from './initialData';

export async function loadUserStore(userId: string): Promise<PhraseStore> {
  const supabase = createClient();
  if (!supabase) throw new Error('Supabase が設定されていません');

  const { data, error } = await supabase
    .from('user_phrase_data')
    .select('data')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (data?.data) {
    const parsed = data.data as PhraseStore;
    return {
      schemaVersion: parsed.schemaVersion ?? 1,
      languages: parsed.languages ?? [],
      lastUpdated: parsed.lastUpdated ?? Date.now(),
    };
  }

  const fresh: PhraseStore = {
    schemaVersion: 1,
    languages: INITIAL_LANGUAGES,
    lastUpdated: Date.now(),
  };
  await supabase.from('user_phrase_data').upsert({
    user_id: userId,
    data: fresh,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  return fresh;
}

export async function saveUserLanguages(userId: string, languages: PhraseStore['languages']): Promise<void> {
  const supabase = createClient();
  if (!supabase) throw new Error('Supabase が設定されていません');

  const { data: existing } = await supabase
    .from('user_phrase_data')
    .select('data')
    .eq('user_id', userId)
    .single();

  const store: PhraseStore = {
    schemaVersion: (existing?.data as PhraseStore)?.schemaVersion ?? 1,
    languages,
    lastUpdated: Date.now(),
  };

  await supabase.from('user_phrase_data').upsert({
    user_id: userId,
    data: store,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}
