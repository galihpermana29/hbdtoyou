'use client';

import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { MOCK_WEDDING } from '../mock';

/**
 * Everything a couple configures on their MemoRoll, one field per gate in the
 * designer's flowchart. Local state only: this is the shape a backend would
 * eventually hold, but the demo never sends it anywhere.
 */
export interface MemorollConfig {
  /** The event: the "event time?" gate. */
  eventName: string;
  eventDate: string; // yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  /** The reveal: the "reveal time?" gate. */
  revealPreset: 'at-end' | 'next-morning' | 'custom';
  /** Only read while the preset is 'custom'; the others derive from the event. */
  revealDate: string;
  revealTime: string;
  /** The place: the "in area?" gate. */
  venueName: string;
  geofenceOn: boolean;
  radiusM: number;
  /** The film: the flowchart's ten shots, made a choice. */
  shotsPerGuest: number;
  /** The look. */
  filmFilterOn: boolean;
}

/** What each step screen receives: the config and a way to change it. */
export interface StepProps {
  config: MemorollConfig;
  patch: (partial: Partial<MemorollConfig>) => void;
}

export const DEFAULT_CONFIG: MemorollConfig = {
  eventName: MOCK_WEDDING.title,
  eventDate: '2026-05-03',
  startTime: '16:00',
  endTime: '22:00',
  revealPreset: 'next-morning',
  revealDate: '2026-05-04',
  revealTime: '09:00',
  venueName: MOCK_WEDDING.venue,
  geofenceOn: true,
  radiusM: 250,
  shotsPerGuest: 10,
  filmFilterOn: true,
};

/** The day after the event, for the "next morning" reveal preset. */
export function nextMorningOf(eventDate: string): string {
  const day = dayjs(eventDate);
  return day.isValid() ? day.add(1, 'day').format('YYYY-MM-DD') : eventDate;
}

/**
 * When the roll actually drops. Derived at read time so a preset keeps its
 * promise when the event date changes after it was chosen; only 'custom'
 * reads the stored date and time.
 */
export function effectiveReveal(config: MemorollConfig): {
  date: string;
  time: string;
} {
  if (config.revealPreset === 'at-end') {
    return { date: config.eventDate, time: config.endTime };
  }
  if (config.revealPreset === 'next-morning') {
    return { date: nextMorningOf(config.eventDate), time: '09:00' };
  }
  return { date: config.revealDate, time: config.revealTime };
}

const STORAGE_KEY = 'memoroll-demo:create';

interface StoredCreatorState {
  config: MemorollConfig;
  hiddenIds: string[];
  published: boolean;
}

/**
 * The creator's whole demo state, persisted in localStorage the way the
 * guest's roll is: the config the wizard fills, which shots moderation has
 * hidden, and whether the MemoRoll has been published into its live view.
 */
export function useCreatorState() {
  const [config, setConfig] = useState<MemorollConfig>(DEFAULT_CONFIG);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredCreatorState>;
        if (parsed.config) {
          setConfig({ ...DEFAULT_CONFIG, ...parsed.config });
        }
        if (Array.isArray(parsed.hiddenIds)) {
          setHiddenIds(parsed.hiddenIds.filter((id) => typeof id === 'string'));
        }
        setPublished(Boolean(parsed.published));
      }
    } catch {
      // A corrupt or blocked store just means a fresh setup.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ config, hiddenIds, published })
      );
    } catch {
      // Quota or privacy mode: the in-memory config still works for the demo.
    }
  }, [config, hiddenIds, published, hydrated]);

  const patchConfig = useCallback((partial: Partial<MemorollConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleHidden = useCallback((id: string) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  }, []);

  const unhideAll = useCallback(() => setHiddenIds([]), []);

  const resetAll = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setHiddenIds([]);
    setPublished(false);
  }, []);

  return {
    config,
    patchConfig,
    hiddenIds,
    toggleHidden,
    unhideAll,
    published,
    setPublished,
    resetAll,
    hydrated,
  };
}
