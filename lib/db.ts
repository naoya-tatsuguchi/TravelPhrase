import { openDB, type IDBPDatabase } from 'idb';
import type { Language, PhraseStore } from '@/types/phrase';
import { INITIAL_LANGUAGES } from './initialData';
import { loadUserStore, saveUserLanguages as saveUserLanguagesSupabase } from './db-supabase';

const DB_NAME    = 'phrase-app-db';
const DB_VERSION = 1;
const STORE_KEY  = 'phraseStore';
const STORE_NAME = 'data';

type AppDB = IDBPDatabase<{
  data: { key: string; value: PhraseStore };
}>;

let _db: AppDB | null = null;

async function getDB(): Promise<AppDB> {
  if (_db) return _db;
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  }) as AppDB;
  return _db;
}

/** ログイン済みは Supabase から、未ログインはサンプルデータ（保存しない） */
export async function loadStore(userId?: string | null): Promise<PhraseStore> {
  if (userId) {
    try {
      return await loadUserStore(userId);
    } catch (e) {
      console.error('[loadStore] Supabase error:', e);
      return { schemaVersion: 1, languages: INITIAL_LANGUAGES, lastUpdated: Date.now() };
    }
  }

  // 未ログイン時は常にサンプルデータを返す（IndexedDB は使わない）
  return {
    schemaVersion: 1,
    languages:     INITIAL_LANGUAGES,
    lastUpdated:   Date.now(),
  };
}

export async function saveStore(store: PhraseStore): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, { ...store, lastUpdated: Date.now() }, STORE_KEY);
}

/** ログイン済みは Supabase へ保存、未ログインは保存しない（閲覧専用） */
export async function saveLanguages(languages: Language[], userId?: string | null): Promise<void> {
  if (!userId) return; // 未ログイン時は保存しない

  try {
    await saveUserLanguagesSupabase(userId, languages);
  } catch (e) {
    console.error('[saveLanguages] Supabase error:', e);
    throw e;
  }
}
