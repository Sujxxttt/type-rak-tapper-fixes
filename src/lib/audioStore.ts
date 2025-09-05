// Simple IndexedDB wrapper for storing audio files persistently in the browser
// This enables uploaded music to persist across reloads and sidebar open/close.
// Note: We cannot write to the project filesystem at runtime, so we use IndexedDB.

export interface StoredTrack {
  id: number;
  name: string;
  type: string;
  createdAt: number;
  blob: Blob;
}

const DB_NAME = 'TypeRakAudioDB';
const STORE_NAME = 'tracks';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTrack(file: File): Promise<StoredTrack> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const data = {
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: file.type,
      createdAt: Date.now(),
      blob: file,
    } as Omit<StoredTrack, 'id'> as any;

    const req = store.add(data);
    req.onsuccess = () => {
      const id = req.result as number;
      resolve({ id, ...(data as any) });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteTrack(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function loadAllTracks(): Promise<StoredTrack[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as StoredTrack[]);
    req.onerror = () => reject(req.error);
  });
}
