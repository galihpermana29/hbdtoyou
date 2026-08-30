'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const SHOT_LIMIT = 10;

const DB_NAME = 'memoroll-demo';
const DB_VERSION = 1;
const STORE = 'shots';
/** Where hbd-15j-era rolls kept base64 shots; migrated once, then removed. */
const LEGACY_STORAGE_KEY = 'memoroll-demo:shots';

export interface Shot {
  id: string;
  /** Object URL for the baked JPEG blob; owned and revoked by this hook. */
  url: string;
  /** Epoch ms when the shutter fired. */
  takenAt: number;
  /**
   * The film the shot developed through, already baked into the pixels
   * (ADR 0006) - kept as a label only. Legacy shots hydrate with whatever
   * label they were stored under.
   */
  film: string;
}

interface StoredShot {
  id: string;
  blob: Blob;
  takenAt: number;
  film: string;
}

/* --------------- tiny IndexedDB helpers, promise-shaped --------------- */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll(db: IDBDatabase): Promise<StoredShot[]> {
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as StoredShot[]);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db: IDBDatabase, shot: StoredShot): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(shot);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbClear(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * One-time migration: hbd-15j stored up to ten base64 JPEG data URLs in
 * localStorage; 960x1280 keepers would blow that quota, so blobs now live
 * in IndexedDB. Existing shots are converted losslessly, then the legacy
 * key is removed. A migration that fails leaves the legacy data in place.
 */
async function migrateLegacyShots(db: IDBDatabase): Promise<void> {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  const parsed = JSON.parse(raw) as Array<{
    id?: string;
    dataUrl?: string;
    takenAt?: number;
    film?: string;
  }>;
  if (!Array.isArray(parsed)) {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return;
  }
  const existing = new Set((await idbGetAll(db)).map((s) => s.id));
  const legacyShots = parsed.slice(0, SHOT_LIMIT);
  for (let index = 0; index < legacyShots.length; index++) {
    const legacy = legacyShots[index];
    if (!legacy?.dataUrl) continue;
    const id = legacy.id ?? `legacy-${index}`;
    if (existing.has(id)) continue;
    const blob = await (await fetch(legacy.dataUrl)).blob();
    await idbPut(db, {
      id,
      blob,
      takenAt: legacy.takenAt ?? 0,
      film: legacy.film ?? 'none',
    });
  }
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/**
 * The guest's ten shots: baked JPEG blobs in IndexedDB so the roll survives
 * a reload without touching localStorage quotas, surfaced as object URLs
 * that this hook creates on hydration and revokes on cleanup. Local state
 * only: nothing here talks to a backend.
 */
export function useShots() {
  const [shots, setShots] = useState<Shot[]>([]);
  const dbRef = useRef<IDBDatabase | null>(null);
  const urlsRef = useRef<Set<string>>(new Set());
  // The authoritative count for the limit guard, held in a ref so addShot
  // can check-and-increment synchronously and keep its IndexedDB write
  // OUTSIDE the state updater (updaters run twice under StrictMode, and a
  // side effect inside one wrote duplicate records).
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = shots.length;
  }, [shots]);

  const trackUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = await openDb();
        if (cancelled) {
          db.close();
          return;
        }
        dbRef.current = db;
        await migrateLegacyShots(db).catch(() => {
          // A failed migration keeps the legacy data for the next attempt.
        });
        const stored = await idbGetAll(db);
        if (cancelled) return;
        stored.sort((a, b) => a.takenAt - b.takenAt);
        setShots(
          stored.slice(0, SHOT_LIMIT).map((s) => ({
            id: s.id,
            url: trackUrl(s.blob),
            takenAt: s.takenAt,
            film: s.film,
          }))
        );
      } catch {
        // No IndexedDB (ancient browser, blocked storage): the in-memory
        // roll still works for the session.
      }
    })();
    const urls = urlsRef.current;
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, [trackUrl]);

  const addShot = useCallback(
    (blob: Blob, film: string) => {
      if (countRef.current >= SHOT_LIMIT) return;
      countRef.current += 1;
      const takenAt = Date.now();
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? `shot-${crypto.randomUUID()}`
          : `shot-${takenAt}-${countRef.current}`;
      const db = dbRef.current;
      if (db) {
        idbPut(db, { id, blob, takenAt, film }).catch(() => {
          // Quota or privacy mode: the in-memory roll still works.
        });
      }
      const url = trackUrl(blob);
      setShots((prev) =>
        prev.length >= SHOT_LIMIT ? prev : [...prev, { id, url, takenAt, film }]
      );
    },
    [trackUrl]
  );

  const clearShots = useCallback(() => {
    setShots((prev) => {
      prev.forEach((s) => {
        URL.revokeObjectURL(s.url);
        urlsRef.current.delete(s.url);
      });
      return [];
    });
    const db = dbRef.current;
    if (db) {
      idbClear(db).catch(() => {
        // Same stance as addShot: storage failure never breaks the demo.
      });
    }
  }, []);

  return {
    shots,
    addShot,
    clearShots,
    remaining: Math.max(0, SHOT_LIMIT - shots.length),
  };
}
