'use client';

import Image from 'next/image';
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BoardOfUsData,
  BoardOfUsMemory,
} from './board-of-us-data';
import styles from './board-of-us.module.css';

type Square =
  | { type: 'go' | 'chance' | 'hug' | 'wish' | 'timeout' | 'finish' }
  | { type: 'memory'; memoryIndex: number };

type Reveal =
  | { type: 'memory'; memory: BoardOfUsMemory }
  | { type: 'chance'; text: string }
  | { type: 'hug' | 'wish' | 'timeout' };

const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const FINISH_INDEX = 15;
const BASE_BOARD_SQUARES: Square[] = [
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
const EXTRA_MEMORY_POSITIONS = [10, 6, 12, 8];
const SOUND_FILES = {
  roll: '/boardofusv1/audio/dice-roll.wav',
  tap: '/boardofusv1/audio/board-tap.wav',
  bgm: '/boardofusv1/audio/our-little-lap.wav',
} as const;
const SOUND_VOLUMES = { roll: 0.28, tap: 0.18, bgm: 0.09 };
const MUTE_STORAGE_KEY = 'memoify-boardofus-muted';

function buildBoardSquares(memoryCount: number): Square[] {
  const squares = BASE_BOARD_SQUARES.map((square) => ({ ...square }));

  EXTRA_MEMORY_POSITIONS.slice(0, Math.max(0, memoryCount - 8)).forEach(
    (position, index) => {
      squares[position] = { type: 'memory', memoryIndex: index + 8 };
    }
  );

  return squares;
}

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
  const boardSquares = useMemo(
    () => buildBoardSquares(data.memories.length),
    [data.memories.length]
  );
  const [currentSquare, setCurrentSquare] = useState(0);
  const [visitedSquares, setVisitedSquares] = useState<number[]>([0]);
  const [loveTokens, setLoveTokens] = useState(0);
  const [die, setDie] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [showFinish, setShowFinish] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('Tap the die to begin our little lap.');
  const mountedRef = useRef(true);
  const audioRef = useRef<
    Partial<Record<keyof typeof SOUND_FILES, HTMLAudioElement>>
  >({});

  useEffect(() => {
    const audioElements = audioRef.current;
    mountedRef.current = true;
    setIsMuted(window.localStorage.getItem(MUTE_STORAGE_KEY) === 'true');

    return () => {
      mountedRef.current = false;
      Object.values(audioElements).forEach((audio) => audio?.pause());
    };
  }, []);

  const getAudio = (name: keyof typeof SOUND_FILES) => {
    let audio = audioRef.current[name];
    if (!audio) {
      audio = new Audio(SOUND_FILES[name]);
      audio.preload = 'auto';
      audio.volume = SOUND_VOLUMES[name];
      if (name === 'bgm') audio.loop = true;
      audioRef.current[name] = audio;
    }
    return audio;
  };

  const playSound = (name: 'roll' | 'tap') => {
    if (isMuted) return;
    const audio = getAudio(name);
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Audio support must never block the gift.
    });
  };

  const startMusic = () => {
    if (isMuted) return;
    const music = getAudio('bgm');
    void music.play().catch(() => {
      // Mobile browsers unlock audio after a user gesture; Roll retries it.
    });
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    window.localStorage.setItem(MUTE_STORAGE_KEY, String(nextMuted));

    if (nextMuted) {
      Object.values(audioRef.current).forEach((audio) => audio?.pause());
      return;
    }

    const music = getAudio('bgm');
    void music.play().catch(() => {
      // The next Roll gesture will retry if the browser blocks this attempt.
    });
  };

  const revealLanding = (squareIndex: number, roll: number) => {
    const square = boardSquares[squareIndex];
    const isFirstVisit = !visitedSquares.includes(squareIndex);

    setVisitedSquares((visited) =>
      visited.includes(squareIndex) ? visited : [...visited, squareIndex]
    );
    playSound('tap');

    if (square.type === 'finish') {
      setStatus(`You made it, ${data.recipientName}!`);
      setShowFinish(true);
      return;
    }

    if (square.type === 'memory') {
      if (isFirstVisit) setLoveTokens((count) => count + 1);
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

    if (
      square.type === 'hug' ||
      square.type === 'wish' ||
      square.type === 'timeout'
    ) {
      if (square.type === 'wish' && isFirstVisit) {
        setLoveTokens((count) => count + 1);
      }
      setStatus(SPECIAL_COPY[square.type].title);
      setReveal({ type: square.type });
      return;
    }

    setStatus('A fresh wish collected. Keep going!');
  };

  const rollDie = async () => {
    if (isRolling || reveal || showFinish) return;

    playSound('roll');
    startMusic();
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
    setVisitedSquares([0]);
    setLoveTokens(0);
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
  const finishTitle =
    data.occasion === 'anniversary'
      ? `Happy Anniversary, ${data.recipientName}!`
      : data.occasion === 'both'
        ? `Here's to us, ${data.recipientName}!`
        : `Happy Birthday, ${data.recipientName}!`;

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
        <button
          className={styles.soundButton}
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Turn sound on' : 'Mute sound'}
          aria-pressed={isMuted}
        >
          <span aria-hidden="true">{isMuted ? '♪̸' : '♪'}</span>
          {isMuted ? 'Sound off' : 'Sound on'}
        </button>
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
          <p className={styles.tokenIntro}>
            Move {data.token.nickname} • memory stops earn love tokens
          </p>
        </header>

        <div className={styles.boardShell}>
          <div className={styles.board}>
            {boardSquares.map((square, index) => {
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
                  } ${
                    visitedSquares.includes(index) && currentSquare !== index
                      ? styles.visited
                      : ''
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
              <p>Made with</p>
              <strong>Memoify</strong>
              <span>every memory earns a ♥</span>
            </div>
          </div>
        </div>

        <p className={styles.status} aria-live="polite">
          {status}
        </p>

        <div className={styles.controls}>
          <div className={styles.tokenLabel}>
            <span aria-hidden="true">♥</span>
            <div>
              <small>Love tokens</small>
              <strong>{loveTokens} collected</strong>
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
                alt={
                  reveal.memory.alt ||
                  `${reveal.memory.label} memory for ${data.recipientName}`
                }
                fill
                sizes="(max-width: 480px) 84vw, 360px"
              />
            </div>
            <h2>{reveal.memory.label}</h2>
            <p>{reveal.memory.caption}</p>
            <button type="button" onClick={() => setReveal(null)} autoFocus>
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
            <button type="button" onClick={() => setReveal(null)} autoFocus>
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
            <h2>{finishTitle}</h2>
            <div className={styles.tokenPayoff}>
              <span aria-hidden="true">♥</span>
              <strong>
                {loveTokens} love {loveTokens === 1 ? 'token' : 'tokens'} collected
              </strong>
            </div>
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
