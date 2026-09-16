'use client';

import Image from 'next/image';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import styles from './board-of-us.module.css';

// #region agent log
const dbg = (
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown> = {}
) => {
  fetch('/api/debug-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
      runId: 'pre-fix',
    }),
  }).catch(() => {});
};
// #endregion

export interface BoardOfUsMemory {
  imageUrl: string;
  label: string;
  caption: string;
  alt: string;
}

export interface BoardOfUsData {
  title: string;
  recipientName: string;
  token: {
    nickname: string;
    color: string;
  };
  memories: BoardOfUsMemory[];
  chanceTexts: string[];
  finishMessage: string;
}

type Square =
  | { type: 'go' | 'chance' | 'hug' | 'wish' | 'timeout' | 'finish' }
  | { type: 'memory'; memoryIndex: number };

type Reveal =
  | { type: 'memory'; memory: BoardOfUsMemory }
  | { type: 'chance'; text: string }
  | { type: 'hug' | 'wish' | 'timeout' };

const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const FINISH_INDEX = 15;
const BOARD_SQUARES: Square[] = [
  { type: 'go' },
  { type: 'memory', memoryIndex: 0 },
  { type: 'chance' },
  { type: 'memory', memoryIndex: 1 },
  { type: 'hug' },
  { type: 'memory', memoryIndex: 2 },
  { type: 'chance' },
  { type: 'memory', memoryIndex: 3 },
  { type: 'wish' },
  { type: 'memory', memoryIndex: 4 },
  { type: 'chance' },
  { type: 'memory', memoryIndex: 5 },
  { type: 'timeout' },
  { type: 'memory', memoryIndex: 6 },
  { type: 'memory', memoryIndex: 7 },
  { type: 'finish' },
];

const BOARD_POSITIONS = [
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [4, 5],
  [3, 5],
  [2, 5],
  [1, 5],
  [1, 4],
  [1, 3],
  [1, 2],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
] as const;

const SPECIAL_COPY = {
  chance: {
    eyebrow: 'A little dare',
    title: 'Chance of Us',
    icon: '?',
  },
  hug: {
    eyebrow: 'Best kind of detour',
    title: 'Hug checkpoint',
    icon: '♥',
    body: 'Pause the game for one very necessary, extra-squeezy hug.',
  },
  wish: {
    eyebrow: 'Go, go, go!',
    title: 'Collect a wish',
    icon: '✦',
    body: 'Make one birthday wish. I promise to cheer for it all year.',
  },
  timeout: {
    eyebrow: 'Cute timeout',
    title: 'Cozy corner',
    icon: '☁',
    body: 'No jail here. Take a ten-second cuddle timeout, then keep going.',
  },
};

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export default function BoardOfUs({ data }: { data: BoardOfUsData }) {
  const [currentSquare, setCurrentSquare] = useState(0);
  const [die, setDie] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [showFinish, setShowFinish] = useState(false);
  const [status, setStatus] = useState('Tap the die to begin our little lap.');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // #region agent log
  useEffect(() => {
    if (!reveal && !showFinish) return;

    const describeEl = (el: Element | null) => {
      if (!el || !(el instanceof HTMLElement)) return null;
      const a = el.closest('a');
      return {
        tag: el.tagName,
        id: el.id || null,
        className: String(el.className || '').slice(0, 160),
        text: (el.innerText || '').slice(0, 80),
        href: a?.getAttribute('href') || null,
        role: el.getAttribute('role'),
        antModal: !!el.closest('.ant-modal-wrap, .ant-modal-root, .ant-modal'),
      };
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const atPoint = document.elementFromPoint(event.clientX, event.clientY);
      const overlay = document.querySelector(`.${styles.overlay}`);
      const modalBtn = overlay?.querySelector('button');
      const careerLink = document.querySelector('a[href="/career"]');
      const adsWrap = document.querySelector('.ant-modal-wrap');
      dbg('A/B/C/E', 'board-of-us.tsx:pointerdown', 'pointer while reveal/finish open', {
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        scrollY: window.scrollY,
        innerH: window.innerHeight,
        innerW: window.innerWidth,
        revealType: reveal?.type ?? null,
        showFinish,
        target: describeEl(target),
        atPoint: describeEl(atPoint),
        targetIsModalBtn: !!(target && modalBtn && modalBtn.contains(target)),
        atPointIsModalBtn: !!(atPoint && modalBtn && modalBtn.contains(atPoint)),
        targetIsCareer: !!(target && (target as Element).closest?.('a[href="/career"]')),
        atPointIsCareer: !!(atPoint && (atPoint as Element).closest?.('a[href="/career"]')),
        overlayRect: overlay?.getBoundingClientRect?.()
          ? ((r) => ({ top: r.top, left: r.left, bottom: r.bottom, right: r.right, w: r.width, h: r.height }))(
              overlay.getBoundingClientRect()
            )
          : null,
        modalBtnRect: modalBtn?.getBoundingClientRect?.()
          ? ((r) => ({ top: r.top, left: r.left, bottom: r.bottom, right: r.right, w: r.width, h: r.height }))(
              modalBtn.getBoundingClientRect()
            )
          : null,
        careerRect: careerLink?.getBoundingClientRect?.()
          ? ((r) => ({ top: r.top, left: r.left, bottom: r.bottom, right: r.right, w: r.width, h: r.height }))(
              careerLink.getBoundingClientRect()
            )
          : null,
        adsVisible: !!(adsWrap && getComputedStyle(adsWrap).display !== 'none'),
        adsZ: adsWrap ? getComputedStyle(adsWrap).zIndex : null,
        overlayZ: overlay ? getComputedStyle(overlay).zIndex : null,
        pointerEventsOverlay: overlay ? getComputedStyle(overlay).pointerEvents : null,
      });
    };

    const onClickCapture = (event: MouseEvent) => {
      const target = event.target as Element | null;
      dbg('A/B/C', 'board-of-us.tsx:click-capture', 'click capture while reveal open', {
        clientX: event.clientX,
        clientY: event.clientY,
        target: describeEl(target),
        defaultPrevented: event.defaultPrevented,
      });
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('click', onClickCapture, true);
    dbg('D', 'board-of-us.tsx:reveal-open', 'reveal/finish overlay mounted', {
      revealType: reveal?.type ?? null,
      showFinish,
      pathname: window.location.pathname,
      scrollY: window.scrollY,
    });

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', onClickCapture, true);
    };
  }, [reveal, showFinish]);
  // #endregion

  const revealLanding = (squareIndex: number, roll: number) => {
    const square = BOARD_SQUARES[squareIndex];

    if (square.type === 'finish') {
      setStatus(`You made it, ${data.recipientName}!`);
      setShowFinish(true);
      return;
    }

    if (square.type === 'memory') {
      setStatus(`Memory unlocked: ${data.memories[square.memoryIndex].label}`);
      setReveal({
        type: 'memory',
        memory: data.memories[square.memoryIndex],
      });
      return;
    }

    if (square.type === 'chance') {
      setStatus('Chance card unlocked!');
      setReveal({
        type: 'chance',
        text: data.chanceTexts[(squareIndex + roll) % data.chanceTexts.length],
      });
      return;
    }

    if (square.type === 'hug' || square.type === 'wish' || square.type === 'timeout') {
      setStatus(SPECIAL_COPY[square.type].title);
      setReveal({ type: square.type });
      return;
    }

    setStatus('A fresh wish collected. Keep going!');
  };

  const rollDie = async () => {
    if (isRolling || reveal || showFinish) return;

    setIsRolling(true);
    setStatus(`${data.token.nickname} is rolling…`);

    for (let spin = 0; spin < 7; spin += 1) {
      setDie(Math.floor(Math.random() * 6) + 1);
      await wait(65);
      if (!mountedRef.current) return;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    const destination = Math.min(currentSquare + roll, FINISH_INDEX);
    setDie(roll);
    setStatus(`You rolled ${roll}. Here we go!`);

    for (let next = currentSquare + 1; next <= destination; next += 1) {
      await wait(170);
      if (!mountedRef.current) return;
      setCurrentSquare(next);
    }

    await wait(220);
    if (!mountedRef.current) return;
    setIsRolling(false);
    revealLanding(destination, roll);
  };

  const replay = () => {
    setCurrentSquare(0);
    setDie(1);
    setShowFinish(false);
    setReveal(null);
    setStatus('Tap the die to take another lap.');
  };

  const getSquareLabel = (square: Square) => {
    if (square.type === 'memory') {
      return data.memories[square.memoryIndex].label;
    }
    if (square.type === 'go') return 'Start with a wish';
    if (square.type === 'chance') return 'Chance';
    if (square.type === 'hug') return 'Hug stop';
    if (square.type === 'wish') return 'Wish stop';
    if (square.type === 'timeout') return 'Cozy timeout';
    return 'Birthday finish';
  };

  const specialReveal =
    reveal && reveal.type !== 'memory'
      ? SPECIAL_COPY[reveal.type]
      : null;
  const specialBody =
    reveal?.type === 'chance'
      ? reveal.text
      : reveal?.type === 'hug'
        ? SPECIAL_COPY.hug.body
        : reveal?.type === 'wish'
          ? SPECIAL_COPY.wish.body
          : reveal?.type === 'timeout'
            ? SPECIAL_COPY.timeout.body
            : '';

  return (
    <main
      className={styles.page}
      style={{ '--token-color': data.token.color } as CSSProperties}
    >
      <div className={styles.doodleLayer} aria-hidden="true">
        <span>♥</span>
        <span>✦</span>
        <span>☺</span>
        <span>★</span>
      </div>

      <section className={styles.game} aria-label="Board of Us memory game">
        <header className={styles.header}>
          <p>A tiny birthday game for {data.recipientName}</p>
          <h1>{data.title}</h1>
          <div className={styles.routeLine}>
            <span>{currentSquare}</span>
            <div>
              <i style={{ width: `${(currentSquare / FINISH_INDEX) * 100}%` }} />
            </div>
            <span>{FINISH_INDEX}</span>
          </div>
        </header>

        <div className={styles.boardShell}>
          <div className={styles.board}>
            {BOARD_SQUARES.map((square, index) => {
              const [row, column] = BOARD_POSITIONS[index];
              const isMemory = square.type === 'memory';
              const memory = isMemory
                ? data.memories[square.memoryIndex]
                : null;

              return (
                <div
                  key={`${square.type}-${index}`}
                  className={`${styles.square} ${styles[square.type]} ${
                    currentSquare === index ? styles.current : ''
                  }`}
                  style={{ gridRow: row, gridColumn: column }}
                  aria-label={`${index}: ${getSquareLabel(square)}`}
                >
                  {memory ? (
                    <>
                      <div className={styles.thumbnail}>
                        <Image
                          src={memory.imageUrl}
                          alt=""
                          fill
                          sizes="80px"
                          priority={index < 4}
                        />
                      </div>
                      <b>{memory.label}</b>
                    </>
                  ) : (
                    <>
                      <span className={styles.squareIcon} aria-hidden="true">
                        {square.type === 'go' && '↗'}
                        {square.type === 'chance' && '?'}
                        {square.type === 'hug' && '♥'}
                        {square.type === 'wish' && '✦'}
                        {square.type === 'timeout' && '☁'}
                        {square.type === 'finish' && '★'}
                      </span>
                      <b>{getSquareLabel(square)}</b>
                    </>
                  )}

                  {currentSquare === index ? (
                    <span
                      className={styles.token}
                      aria-label={`${data.token.nickname} token`}
                    >
                      {data.token.nickname.slice(0, 1)}
                    </span>
                  ) : null}
                </div>
              );
            })}

            <div className={styles.boardCenter}>
              <p>Made of</p>
              <strong>our favorite<br />little moments</strong>
              <span>one short lap • all heart</span>
            </div>
          </div>
        </div>

        <p className={styles.status} aria-live="polite">
          {status}
        </p>

        <div className={styles.controls}>
          <div className={styles.tokenLabel}>
            <span>{data.token.nickname.slice(0, 1)}</span>
            <div>
              <small>Your token</small>
              <strong>{data.token.nickname}</strong>
            </div>
          </div>
          <button
            className={styles.dieButton}
            type="button"
            onClick={rollDie}
            disabled={isRolling}
            aria-label={isRolling ? 'Die is rolling' : 'Roll the die'}
          >
            <span aria-hidden="true">{DIE_FACES[die - 1]}</span>
            <b>{isRolling ? 'Rolling…' : 'Roll'}</b>
          </button>
        </div>
      </section>

      {reveal?.type === 'memory' ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={styles.memoryCard}>
            <p className={styles.cardEyebrow}>You landed on a memory</p>
            <div className={styles.memoryPhoto}>
              <Image
                src={reveal.memory.imageUrl}
                alt={reveal.memory.alt}
                fill
                sizes="(max-width: 480px) 84vw, 360px"
              />
            </div>
            <h2>{reveal.memory.label}</h2>
            <p>{reveal.memory.caption}</p>
            <button
              type="button"
              onClick={() => {
                // #region agent log
                dbg('A', 'board-of-us.tsx:keep-moving', 'Keep moving onClick fired', {
                  revealType: reveal?.type,
                  pathname: window.location.pathname,
                });
                // #endregion
                setReveal(null);
              }}
              autoFocus
            >
              Keep moving <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      ) : null}

      {specialReveal ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={`${styles.specialCard} ${styles[reveal!.type]}`}>
            <p className={styles.cardEyebrow}>{specialReveal.eyebrow}</p>
            <span className={styles.bigIcon} aria-hidden="true">
              {specialReveal.icon}
            </span>
            <h2>{specialReveal.title}</h2>
            <p>{specialBody}</p>
            <button
              type="button"
              onClick={() => {
                // #region agent log
                dbg('A', 'board-of-us.tsx:back-to-board', 'Back to the board onClick fired', {
                  revealType: reveal?.type,
                  pathname: window.location.pathname,
                });
                // #endregion
                setReveal(null);
              }}
              autoFocus
            >
              Back to the board <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
      ) : null}

      {showFinish ? (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <article className={styles.finishCard}>
            <div className={styles.confetti} aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <p className={styles.cardEyebrow}>Finish line unlocked</p>
            <span className={styles.finishBadge} aria-hidden="true">★</span>
            <h2>Happy Birthday, {data.recipientName}!</h2>
            <p>{data.finishMessage}</p>
            <button type="button" onClick={replay} autoFocus>
              Play another lap
            </button>
          </article>
        </div>
      ) : null}
    </main>
  );
}
