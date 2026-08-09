'use client';

import { useCallback, useEffect, useState } from 'react';

export const SHOT_LIMIT = 10;

const STORAGE_KEY = 'memoroll-demo:shots';

export interface Shot {
  id: string;
  /** Downscaled JPEG data URL so ten shots stay well inside the quota. */
  dataUrl: string;
  /** Epoch ms when the shutter fired. */
  takenAt: number;
}

/**
 * The guest's ten shots, persisted in localStorage so the roll survives a
 * reload. Local state only: nothing here talks to a backend.
 */
export function useShots() {
  const [shots, setShots] = useState<Shot[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setShots(parsed.slice(0, SHOT_LIMIT));
        }
      }
    } catch {
      // A corrupt or blocked store just means a fresh roll.
    }
  }, []);

  const addShot = useCallback((dataUrl: string) => {
    setShots((prev) => {
      if (prev.length >= SHOT_LIMIT) return prev;
      const next = [
        ...prev,
        {
          id: `shot-${prev.length}-${Date.now()}`,
          dataUrl,
          takenAt: Date.now(),
        },
      ];
      writeStore(next);
      return next;
    });
  }, []);

  const clearShots = useCallback(() => {
    setShots([]);
    writeStore([]);
  }, []);

  return {
    shots,
    addShot,
    clearShots,
    remaining: Math.max(0, SHOT_LIMIT - shots.length),
  };
}

function writeStore(next: Shot[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or privacy mode: the in-memory roll still works for the demo.
  }
}
