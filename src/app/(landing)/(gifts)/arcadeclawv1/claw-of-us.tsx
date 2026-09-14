'use client';

import Image from 'next/image';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import styles from './claw-of-us.module.css';

const COPY = {
  eyebrow: 'A little game for',
  instructions: 'Move the claw, then grab a memory.',
  progress: 'memories collected',
  drop: 'Grab',
  continue: 'Keep playing',
  miss: 'So close! Line up with a memory and try again.',
  revealLabel: 'You found a memory',
  payoffLabel: 'Jackpot unlocked',
  payoffTitle: 'You got them all',
  replay: 'Play again',
};

export interface ArcadeClawMemory {
  imageUrl: string;
  caption?: string;
  alt?: string;
}

export interface ArcadeClawData {
  title: string;
  recipientName: string;
  memories: ArcadeClawMemory[];
  finalMessage: string;
}

interface PositionedMemory extends ArcadeClawMemory {
  id: string;
  x: number;
}

type Phase = 'idle' | 'dropping' | 'grabbing' | 'lifting' | 'returning';
type SoundName = 'slide' | 'drop' | 'grab' | 'payoff';

const SOUND_FILES: Record<SoundName, string> = {
  slide: '/arcadeclawv1/sounds/slide.wav',
  drop: '/arcadeclawv1/sounds/drop.wav',
  grab: '/arcadeclawv1/sounds/grab.wav',
  payoff: '/arcadeclawv1/sounds/payoff.wav',
};

const SOUND_VOLUMES: Record<SoundName, number> = {
  slide: 0.12,
  drop: 0.16,
  grab: 0.18,
  payoff: 0.2,
};

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export default function ClawOfUs({ data }: { data: ArcadeClawData }) {
  const memories = useMemo<PositionedMemory[]>(() => {
    const safeMemories = data.memories.slice(0, 6);
    const spacing =
      safeMemories.length > 1 ? 72 / (safeMemories.length - 1) : 0;

    return safeMemories.map((memory, index) => ({
      ...memory,
      id: `memory-${index}`,
      x: safeMemories.length === 1 ? 50 : 14 + spacing * index,
    }));
  }, [data.memories]);
  const [clawX, setClawX] = useState(50);
  const [phase, setPhase] = useState<Phase>('idle');
  const [wonIds, setWonIds] = useState<string[]>([]);
  const [heldMemory, setHeldMemory] = useState<PositionedMemory | null>(null);
  const [revealedMemory, setRevealedMemory] = useState<PositionedMemory | null>(
    null
  );
  const [revealRatio, setRevealRatio] = useState<number | null>(null);
  const [showPayoff, setShowPayoff] = useState(false);
  const [status, setStatus] = useState(COPY.instructions);
  const mountedRef = useRef(true);
  const moveTimerRef = useRef<number | null>(null);
  const audioRef = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});

  useEffect(() => {
    const audioElements = audioRef.current;
    // Restore true after Strict Mode remount (cleanup sets false; setup must flip it back).
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (moveTimerRef.current) window.clearInterval(moveTimerRef.current);
      Object.values(audioElements).forEach((audio) => audio?.pause());
    };
  }, []);

  const playSound = (name: SoundName) => {
    let audio = audioRef.current[name];
    if (!audio) {
      audio = new Audio(SOUND_FILES[name]);
      audio.preload = 'auto';
      audio.volume = SOUND_VOLUMES[name];
      audioRef.current[name] = audio;
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browsers may reject audio before a user gesture; gameplay still continues.
    });
  };

  const moveClaw = (direction: -1 | 1) => {
    if (phase !== 'idle' || revealedMemory) return;
    playSound('slide');
    setClawX((current) => Math.max(10, Math.min(90, current + direction * 7)));
  };

  const startMoving = (direction: -1 | 1) => {
    moveClaw(direction);
    if (moveTimerRef.current) window.clearInterval(moveTimerRef.current);
    moveTimerRef.current = window.setInterval(() => moveClaw(direction), 110);
  };

  const stopMoving = () => {
    if (!moveTimerRef.current) return;
    window.clearInterval(moveTimerRef.current);
    moveTimerRef.current = null;
  };

  const dropClaw = async () => {
    if (phase !== 'idle' || revealedMemory) return;

    const available = memories.filter((memory) => !wonIds.includes(memory.id));
    const nearest = available.reduce<PositionedMemory | null>(
      (closest, memory) => {
        if (!closest) return memory;
        return Math.abs(memory.x - clawX) < Math.abs(closest.x - clawX)
          ? memory
          : closest;
      },
      null
    );
    const caught =
      nearest && Math.abs(nearest.x - clawX) <= 13 ? nearest : null;

    playSound('drop');
    setStatus('Claw going down…');
    setPhase('dropping');
    await wait(700);
    if (!mountedRef.current) return;

    if (!caught) {
      setStatus(COPY.miss);
      setPhase('lifting');
      await wait(700);
      if (!mountedRef.current) return;
      setPhase('idle');
      return;
    }

    setHeldMemory(caught);
    playSound('grab');
    setStatus('Got one!');
    setPhase('grabbing');
    await wait(350);
    if (!mountedRef.current) return;
    setPhase('lifting');
    await wait(700);
    if (!mountedRef.current) return;
    setPhase('returning');
    setClawX(50);
    await wait(650);
    if (!mountedRef.current) return;

    const nextWonIds = [...wonIds, caught.id];
    setWonIds(nextWonIds);
    setHeldMemory(null);
    setPhase('idle');
    setRevealRatio(null);
    setRevealedMemory(caught);
    setStatus(COPY.instructions);
  };

  const continuePlaying = () => {
    const isFinalGrab = wonIds.length === 3;
    setRevealedMemory(null);
    if (isFinalGrab) {
      playSound('payoff');
      setShowPayoff(true);
    }
  };

  const replay = () => {
    setWonIds([]);
    setClawX(50);
    setStatus(COPY.instructions);
    setShowPayoff(false);
  };

  const clawIsLow = phase === 'dropping' || phase === 'grabbing';
  const clawIsClosed = phase !== 'idle' && phase !== 'dropping';

  return (
    <main className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <section className={styles.game} aria-label="Claw of Us memory game">
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {COPY.eyebrow} {data.recipientName}
          </p>
          <h1>{data.title}</h1>
          <div className={styles.progressWrap}>
            <div className={styles.progressDots} aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={index < wonIds.length ? styles.dotWon : ''}
                />
              ))}
            </div>
            <p aria-live="polite">
              {wonIds.length}/3 {COPY.progress}
            </p>
          </div>
        </header>

        <div className={styles.machine}>
          <div className={styles.marquee} aria-hidden="true">
            <span>MEMORY</span>
            <i>★</i>
            <span>GRAB</span>
          </div>
          <div className={styles.cabinet}>
            <div className={styles.glass}>
              <div className={styles.glassShine} aria-hidden="true" />
              <div
                className={`${styles.clawRig} ${clawIsLow ? styles.clawLow : ''}`}
                style={{ left: `${clawX}%` }}
                aria-hidden="true"
              >
                <div className={styles.railConnector} />
                <div className={styles.cable} />
                <div className={styles.clawHead} />
                <div
                  className={`${styles.clawPincer} ${
                    clawIsClosed ? styles.clawClosed : ''
                  }`}
                >
                  <span />
                  <span />
                </div>
                {heldMemory ? (
                  <div className={styles.heldPrize}>
                    <Image src={heldMemory.imageUrl} alt="" fill sizes="56px" />
                  </div>
                ) : null}
              </div>

              <div className={styles.prizeShelf}>
                {memories.map((memory, index) => {
                  const isWon = wonIds.includes(memory.id);
                  return (
                    <div
                      key={memory.id}
                      className={`${styles.prize} ${
                        isWon ? styles.prizeWon : ''
                      }`}
                      style={{
                        left: `${memory.x}%`,
                        transform: `translateX(-50%) rotate(${
                          index % 2 === 0 ? -5 : 5
                        }deg)`,
                      }}
                    >
                      <div className={styles.prizeImage}>
                        <Image
                          src={memory.imageUrl}
                          alt=""
                          fill
                          sizes="64px"
                          priority={index < 3}
                        />
                      </div>
                      <span>♥</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.plushClouds} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.chute} aria-hidden="true">
              <span>PRIZE</span>
              <div />
            </div>
          </div>
        </div>

        <p className={styles.status} aria-live="polite">
          {status}
        </p>

        <div className={styles.controls}>
          <div className={styles.joystickZone}>
            <p>Move</p>
            <div className={styles.joystick}>
              <button
                type="button"
                aria-label="Move claw left"
                onPointerDown={() => startMoving(-1)}
                onPointerUp={stopMoving}
                onPointerLeave={stopMoving}
                onPointerCancel={stopMoving}
                disabled={phase !== 'idle'}
              >
                ‹
              </button>
              <span aria-hidden="true" />
              <button
                type="button"
                aria-label="Move claw right"
                onPointerDown={() => startMoving(1)}
                onPointerUp={stopMoving}
                onPointerLeave={stopMoving}
                onPointerCancel={stopMoving}
                disabled={phase !== 'idle'}
              >
                ›
              </button>
            </div>
          </div>
          <div className={styles.grabZone}>
            <p>Action</p>
            <button
              type="button"
              onClick={dropClaw}
              disabled={phase !== 'idle'}
              aria-label="Drop claw to grab a memory"
            >
              <span>{COPY.drop}</span>
            </button>
          </div>
        </div>
      </section>

      {revealedMemory ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={styles.memoryCard}>
            <p className={styles.cardLabel}>{COPY.revealLabel}</p>
            <div
              className={styles.revealPhoto}
              style={
                revealRatio
                  ? ({ '--reveal-ratio': revealRatio } as CSSProperties)
                  : undefined
              }
            >
              <Image
                src={revealedMemory.imageUrl}
                alt={
                  revealedMemory.alt ||
                  `A shared memory for ${data.recipientName}`
                }
                fill
                sizes="(max-width: 480px) 86vw, 394px"
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    setRevealRatio(naturalWidth / naturalHeight);
                  }
                }}
              />
            </div>
            <p className={styles.caption}>
              {revealedMemory.caption || 'A memory worth keeping.'}
            </p>
            <button type="button" onClick={continuePlaying} autoFocus>
              {wonIds.length === 3 ? 'Open your surprise' : COPY.continue}
              <span aria-hidden="true"> →</span>
            </button>
          </article>
        </div>
      ) : null}

      {showPayoff ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={styles.payoff}>
            <div className={styles.confetti} aria-hidden="true">
              {Array.from({ length: 16 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <p className={styles.cardLabel}>{COPY.payoffLabel}</p>
            <div className={styles.payoffIcon} aria-hidden="true">
              ♥
            </div>
            <h2>
              {COPY.payoffTitle}, {data.recipientName}!
            </h2>
            <p>{data.finalMessage}</p>
            <p className={styles.signature}>Made just for you ♥</p>
            <button type="button" onClick={replay}>
              {COPY.replay}
            </button>
          </article>
        </div>
      ) : null}
    </main>
  );
}
