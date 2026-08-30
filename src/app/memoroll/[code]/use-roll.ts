'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { IMemorollGalleryPhoto } from '@/action/interfaces';
import { submitMemorollPhoto } from '@/action/memoroll-api';
import { newUploadImageWithAPI } from '@/lib/upload';

/**
 * The guest's Roll, on its way to the event.
 *
 * A Shot leaves the phone at capture: baked JPEG into IndexedDB first, then
 * straight into a background upload - the pixels to storage, the address to
 * the event - because the upload window closes at the Reveal and a guest who
 * develops after it must not find their Shots were never sent. IndexedDB is
 * the retry queue, not the truth: the event's own answer is what the gallery
 * renders, and a record here is deleted the moment the event acknowledges the
 * Shot (server all in, 2026-08-29).
 *
 * What remains local is therefore exactly the not-yet-uploaded tail: Shots
 * the network has not taken yet, retried quietly every little while for as
 * long as the page is open. A guest whose photos never land keeps them here,
 * visible in their own Roll, and the collective gallery simply never receives
 * them - the disposable camera's own bargain.
 */

const DB_NAME = 'memoroll-rolls';
const DB_VERSION = 1;
const STORE = 'shots';
/** How long a failed upload waits before the queue tries it again. */
const RETRY_MS = 15_000;

export interface PendingShot {
  id: string;
  /** Object URL for the baked JPEG blob; owned and revoked by this hook. */
  url: string;
  takenAt: number;
  film: string;
}

interface StoredShot {
  id: string;
  /** Which event's Roll this Shot belongs to. */
  code: string;
  /**
   * Whose Roll it is. A shared browser is two guests, and a queue keyed by
   * the event alone would hand the second one the first one's unsent Shots -
   * to be uploaded under the wrong name. Records from before this field
   * carry none and hydrate for nobody, which for test-era data is the right
   * answer.
   */
  userId: string;
  blob: Blob;
  takenAt: number;
  film: string;
}

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

function idbDelete(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function useRoll(
  code: string,
  /** Whose Roll this is; null before sign-in, when there is no Roll to hold. */
  userId: string | null,
  {
    canUpload,
    displayName,
    onRegistered,
  }: {
    /** Whether the event is taking Shots right now - the `ongoing` phase. */
    canUpload: boolean;
    /** The handle that signs this guest's prints, sent with every
     *  registration so the event stores it as their `uploader_name`. */
    displayName: string;
    /** The event took one: here is its own record of it. */
    onRegistered: (photo: IMemorollGalleryPhoto) => void;
  }
) {
  const [pending, setPending] = useState<PendingShot[]>([]);
  const dbRef = useRef<IDBDatabase | null>(null);
  const urlsRef = useRef<Set<string>>(new Set());
  const blobsRef = useRef<Map<string, Blob>>(new Map());
  /** Whether the queue is mid-flight, so two triggers never race one Shot. */
  const draining = useRef(false);
  const canUploadRef = useRef(canUpload);
  canUploadRef.current = canUpload;
  const displayNameRef = useRef(displayName);
  displayNameRef.current = displayName;
  const onRegisteredRef = useRef(onRegistered);
  onRegisteredRef.current = onRegistered;

  const trackUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  }, []);

  const dropShot = useCallback((id: string) => {
    blobsRef.current.delete(id);
    setPending((previous) => {
      const gone = previous.find((shot) => shot.id === id);
      if (gone) {
        URL.revokeObjectURL(gone.url);
        urlsRef.current.delete(gone.url);
      }
      return previous.filter((shot) => shot.id !== id);
    });
    const db = dbRef.current;
    if (db) {
      idbDelete(db, id).catch(() => {
        // A record that will not delete is retried as an upload next open;
        // the registration is idempotent enough to survive a duplicate.
      });
    }
  }, []);

  /**
   * Push the queue, oldest first, one Shot at a time. Every failure leaves
   * the Shot where it is for the next push - the timer's, or the next
   * capture's.
   */
  const drain = useCallback(async () => {
    if (draining.current || !canUploadRef.current) return;
    draining.current = true;
    try {
      // Snapshot: captures during the drain join the next one.
      const queue = Array.from(blobsRef.current.entries());
      for (const [id, blob] of queue) {
        if (!canUploadRef.current) return;

        const body = new FormData();
        body.append(
          'file',
          new File([blob], `${id}.jpg`, { type: 'image/jpeg' })
        );
        const uploaded = await newUploadImageWithAPI(body);
        const photoUrl = uploaded.success ? uploaded.data?.data : null;
        if (typeof photoUrl !== 'string' || !photoUrl) continue;

        const registered = await submitMemorollPhoto(
          code,
          photoUrl,
          displayNameRef.current.trim() || undefined
        );
        if (!registered.success || !registered.data) continue;

        onRegisteredRef.current(registered.data);
        dropShot(id);
      }
    } finally {
      draining.current = false;
    }
  }, [code, dropShot]);

  // Hydrate this person's tail for this event from the last visit, then keep
  // pushing it. No person, no Roll: a signed-out mount holds nothing, and a
  // change of account re-runs this against the new one's records with the
  // old one's object URLs revoked on the way out.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const db = await openDb();
        if (cancelled) {
          db.close();
          return;
        }
        dbRef.current = db;
        const stored = (await idbGetAll(db)).filter(
          (shot) => shot.code === code && shot.userId === userId
        );
        if (cancelled) return;
        stored.sort((a, b) => a.takenAt - b.takenAt);
        stored.forEach((shot) => blobsRef.current.set(shot.id, shot.blob));
        setPending(
          stored.map((shot) => ({
            id: shot.id,
            url: trackUrl(shot.blob),
            takenAt: shot.takenAt,
            film: shot.film,
          }))
        );
        void drain();
      } catch {
        // No IndexedDB (blocked storage): the in-memory queue still works
        // for as long as the page is open.
      }
    })();
    const urls = urlsRef.current;
    const blobs = blobsRef.current;
    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
      // The in-memory queue goes with the person it belonged to: a blob left
      // behind here would be drained - and uploaded - as whoever comes next.
      blobs.clear();
      setPending([]);
      dbRef.current?.close();
      dbRef.current = null;
    };
  }, [code, userId, drain, trackUrl]);

  // The quiet retry: venue Wi-Fi fails silently, so the queue does too.
  useEffect(() => {
    if (!canUpload) return;
    const timer = setInterval(() => {
      if (blobsRef.current.size > 0) void drain();
    }, RETRY_MS);
    return () => clearInterval(timer);
  }, [canUpload, drain]);

  const addShot = useCallback(
    (blob: Blob, film: string) => {
      // The camera is behind the join, so this cannot fire without a person;
      // the guard is for the contract, not a path.
      if (!userId) return;
      const takenAt = Date.now();
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? `shot-${crypto.randomUUID()}`
          : `shot-${takenAt}-${Math.random().toString(36).slice(2)}`;

      blobsRef.current.set(id, blob);
      const db = dbRef.current;
      if (db) {
        idbPut(db, { id, code, userId, blob, takenAt, film }).catch(() => {
          // Quota or privacy mode: the in-memory queue still works.
        });
      }
      setPending((previous) => [
        ...previous,
        { id, url: trackUrl(blob), takenAt, film },
      ]);
      void drain();
    },
    [code, userId, drain, trackUrl]
  );

  return {
    /** The not-yet-uploaded tail of the guest's Roll, oldest first. */
    pending,
    addShot,
    /** Ask the queue to push now - the "uploading your shots" hold uses it. */
    drain,
  };
}
