import { openDB, type IDBPDatabase } from 'idb';
import type { Language, PhraseStore } from '@/types/phrase';
import { INITIAL_LANGUAGES } from './initialData';

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

export async function loadStore(): Promise<PhraseStore> {
  const db   = await getDB();
  const data = await db.get(STORE_NAME, STORE_KEY);
  if (data) return data;

  // First launch — seed initial data
  const fresh: PhraseStore = {
    schemaVersion: 1,
    languages:     INITIAL_LANGUAGES,
    lastUpdated:   Date.now(),
  };
  await db.put(STORE_NAME, fresh, STORE_KEY);
  return fresh;
}

export async function saveStore(store: PhraseStore): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, { ...store, lastUpdated: Date.now() }, STORE_KEY);
}

export async function saveLanguages(languages: Language[]): Promise<void> {
  const db   = await getDB();
  const data = await db.get(STORE_NAME, STORE_KEY);
  const updated: PhraseStore = {
    ...(data ?? { schemaVersion: 1 }),
    languages,
    lastUpdated: Date.now(),
  };
  await db.put(STORE_NAME, updated, STORE_KEY);
}
