'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './claw-of-us-preview.module.css';

const COPY = {
  eyebrow: 'A little game for you',
  title: 'Claw of Us',
  instructions: 'Move the claw, then grab a memory.',
  progress: 'memories collected',
  drop: 'Grab',
  continue: 'Keep playing',
  miss: 'So close! Line up with a memory and try again.',
  revealLabel: 'You found a memory',
  payoffLabel: 'Jackpot unlocked',
  replay: 'Play again',
};

const MEMORIES = [
  {
    id: 'sunset',
    x: 18,
    image: '/arcadeclawv1/sunset-date.svg',
    alt: 'Two people watching a pink sunset by the sea',
    caption: 'The sunset that made us forget the time.',
  },
  {
    id: 'coffee',
    x: 38,
    image: '/arcadeclawv1/coffee-date.svg',
    alt: 'Two coffee cups beside a vase of flowers',
    caption: 'Our tiny table, our very big conversations.',
  },
  {
    id: 'roadtrip',
    x: 60,
    image: '/arcadeclawv1/road-trip.svg',
    alt: 'A little car driving through green hills',
    caption: 'Wrong turns, loud songs, perfect company.',
  },
  {
    id: 'picnic',
    x: 78,
    image: '/arcadeclawv1/picnic-day.svg',
    alt: 'A picnic blanket under a leafy tree',
    caption: 'A slow afternoon I would replay forever.',
  },
  {
    id: 'stargazing',
    x: 88,
    image: '/arcadeclawv1/stargazing.svg',
    alt: 'Two people sitting under a starry night sky',
    caption: 'The night the sky felt like it was just ours.',
  },
] as const;

type Memory = (typeof MEMORIES)[number];
type Phase = 'idle' | 'dropping' | 'grabbing' | 'lifting' | 'returning';

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

// #region agent log
const dbg = (location: string, message: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('/api/debug-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, message, data, timestamp: Date.now(), hypothesisId }),
  }).catch(() => {});
};
// #endregion

export default function ClawOfUsPreview() {
  const [clawX, setClawX] = useState(50);
  const [phase, setPhase] = useState<Phase>('idle');
  const [wonIds, setWonIds] = useState<string[]>([]);
  const [heldMemory, setHeldMemory] = useState<Memory | null>(null);
  const [revealedMemory, setRevealedMemory] = useState<Memory | null>(null);
  const [showPayoff, setShowPayoff] = useState(false);
  const [status, setStatus] = useState(COPY.instructions);
  const mountedRef = useRef(true);
  const moveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Restore true after Strict Mode remount (cleanup sets false; setup must flip it back).
    const mountedBefore = mountedRef.current;
    mountedRef.current = true;
    // #region agent log
    dbg('claw-of-us-preview.tsx:effect-setup', 'mount effect setup', { mountedBefore, mountedAfter: mountedRef.current, runId: 'post-fix' }, 'A');
    // #endregion
    return () => {
      // #region agent log
      dbg('claw-of-us-preview.tsx:effect-cleanup', 'mount effect cleanup sets mounted=false', { mountedBefore: mountedRef.current }, 'A');
      // #endregion
      mountedRef.current = false;
      if (moveTimerRef.current) window.clearInterval(moveTimerRef.current);
    };
  }, []);

  const moveClaw = (direction: -1 | 1) => {
    if (phase !== 'idle' || revealedMemory) return;
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
    // #region agent log
    dbg('claw-of-us-preview.tsx:dropClaw-entry', 'dropClaw called', { phase, revealed: !!revealedMemory, mounted: mountedRef.current, clawX, runId: 'post-fix' }, 'B');
    // #endregion
    if (phase !== 'idle' || revealedMemory) return;

    const available = MEMORIES.filter((memory) => !wonIds.includes(memory.id));
    const nearest = available.reduce<Memory | null>((closest, memory) => {
      if (!closest) return memory;
      return Math.abs(memory.x - clawX) < Math.abs(closest.x - clawX)
        ? memory
        : closest;
    }, null);
    const caught = nearest && Math.abs(nearest.x - clawX) <= 13 ? nearest : null;

    setStatus('Claw going down…');
    setPhase('dropping');
    // #region agent log
    dbg('claw-of-us-preview.tsx:dropClaw-pre-wait', 'set dropping, awaiting 700ms', { caughtId: caught?.id ?? null, mounted: mountedRef.current, runId: 'post-fix' }, 'C');
    // #endregion
    await wait(700);
    // #region agent log
    dbg('claw-of-us-preview.tsx:dropClaw-post-wait', 'after first wait mounted check', { mounted: mountedRef.current, willEarlyReturn: !mountedRef.current, caughtId: caught?.id ?? null, runId: 'post-fix' }, 'B');
    // #endregion
    if (!mountedRef.current) return;

    if (!caught) {
      // #region agent log
      dbg('claw-of-us-preview.tsx:dropClaw-miss', 'miss branch entered', { mounted: mountedRef.current, runId: 'post-fix' }, 'D');
      // #endregion
      setStatus(COPY.miss);
      setPhase('lifting');
      await wait(700);
      if (!mountedRef.current) return;
      setPhase('idle');
      return;
    }

    // #region agent log
    dbg('claw-of-us-preview.tsx:dropClaw-hit', 'hit branch entered', { caughtId: caught.id, mounted: mountedRef.current, runId: 'post-fix' }, 'C');
    // #endregion
    setHeldMemory(caught);
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
    setRevealedMemory(caught);
    setStatus(COPY.instructions);
    // #region agent log
    dbg('claw-of-us-preview.tsx:dropClaw-done', 'dropClaw completed reveal', { caughtId: caught.id, wonCount: nextWonIds.length, runId: 'post-fix' }, 'C');
    // #endregion
  };

  const continuePlaying = () => {
    const isFinalGrab = wonIds.length === 3;
    setRevealedMemory(null);
    if (isFinalGrab) setShowPayoff(true);
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
          <p className={styles.eyebrow}>{COPY.eyebrow}</p>
          <h1>{COPY.title}</h1>
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
                aria-hidden="true">
                <div className={styles.railConnector} />
                <div className={styles.cable} />
                <div className={styles.clawHead} />
                <div
                  className={`${styles.clawPincer} ${
                    clawIsClosed ? styles.clawClosed : ''
                  }`}>
                  <span />
                  <span />
                </div>
                {heldMemory ? (
                  <div className={styles.heldPrize}>
                    <Image
                      src={heldMemory.image}
                      alt=""
                      fill
                      sizes="56px"
                    />
                  </div>
                ) : null}
              </div>

              <div className={styles.prizeShelf}>
                {MEMORIES.map((memory, index) => {
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
                      }}>
                      <div className={styles.prizeImage}>
                        <Image
                          src={memory.image}
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
                disabled={phase !== 'idle'}>
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
                disabled={phase !== 'idle'}>
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
              aria-label="Drop claw to grab a memory">
              <span>{COPY.drop}</span>
            </button>
          </div>
        </div>
      </section>

      {revealedMemory ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={styles.memoryCard}>
            <p className={styles.cardLabel}>{COPY.revealLabel}</p>
            <div className={styles.revealPhoto}>
              <Image
                src={revealedMemory.image}
                alt={revealedMemory.alt}
                fill
                sizes="(max-width: 480px) 78vw, 330px"
              />
            </div>
            <p className={styles.caption}>{revealedMemory.caption}</p>
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
            <h2>Happy birthday, my favorite person!</h2>
            <p>
              If I could keep every little moment with you, I would. Until then,
              here are three reminders that life is brighter, funnier, and much
              more beautiful with you in it.
            </p>
            <p className={styles.signature}>Always on your team, Alex</p>
            <button type="button" onClick={replay}>
              {COPY.replay}
            </button>
          </article>
        </div>
      ) : null}
    </main>
  );
}
