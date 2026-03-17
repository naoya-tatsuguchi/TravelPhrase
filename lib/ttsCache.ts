import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'phrase-tts-db';
const DB_VERSION = 1;
const STORE_NAME = 'audio';

type AudioRecord = {
  key: string;
  mime: string;
  data: ArrayBuffer;
  createdAt: number;
};

type TtsDB = IDBPDatabase<{
  audio: { key: string; value: AudioRecord };
}>;

let _db: TtsDB | null = null;

async function getDB(): Promise<TtsDB> {
  if (_db) return _db;
  _db = (await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  })) as TtsDB;
  return _db;
}

export async function getCachedAudio(key: string): Promise<AudioRecord | null> {
  const db = await getDB();
  const v = (await db.get(STORE_NAME, key)) as AudioRecord | undefined;
  return v ?? null;
}

export async function setCachedAudio(params: { key: string; mime: string; data: ArrayBuffer }): Promise<void> {
  const db = await getDB();
  const record: AudioRecord = { key: params.key, mime: params.mime, data: params.data, createdAt: Date.now() };
  await db.put(STORE_NAME, record, params.key);
}

