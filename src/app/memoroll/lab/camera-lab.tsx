'use client';

import { bakeMemoRollFilm, warmMemoRollGrain } from '@/lib/memoroll-film';
import { useCallback, useEffect, useRef, useState } from 'react';

type Film = 'none' | 'gold' | 'green' | 'clean' | 'teal';

const FILMS: { id: Film; name: string }[] = [
  { id: 'none', name: 'RAW' },
  { id: 'gold', name: 'Gold' },
  { id: 'green', name: 'Green' },
  { id: 'clean', name: 'Clean' },
  { id: 'teal', name: 'Teal' },
];

/** The three keepers being compared. The first is what production bakes. */
const VARIANTS = [
  { id: 'now', name: 'Sekarang', w: 960, h: 1280, q: 0.78 },
  { id: 'mid', name: 'Jalan tengah', w: 1440, h: 1920, q: 0.7 },
  { id: 'big', name: 'Saran', w: 1440, h: 1920, q: 0.78 },
] as const;

interface Result {
  id: string;
  name: string;
  w: number;
  h: number;
  q: number;
  url: string;
  kb: number;
  bakeMs: number;
  encodeMs: number;
  /** Stream pixels per output pixel, on the tighter axis. Under 1 = upscaled. */
  ratio: number;
}

interface StreamInfo {
  width: number;
  height: number;
  settings: string;
  stillCapture: boolean;
}

/** The camera's cover crop, at any frame size (camera-screen.tsx stageFrom). */
function stage(
  source: CanvasImageSource,
  sw: number,
  sh: number,
  w: number,
  h: number
) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const scale = Math.max(w / sw, h / sh);
  ctx.drawImage(
    source,
    (w - sw * scale) / 2,
    (h - sh * scale) / 2,
    sw * scale,
    sh * scale
  );
  return { canvas, scale };
}

/** The date stamp and watermark the camera burns in, scaled with the frame. */
function stamp(canvas: HTMLCanvasElement, film: Film) {
  const ctx = canvas.getContext('2d')!;
  const k = canvas.width / 960;
  const h = canvas.height;
  const now = new Date();
  const date = `${now.getMonth() + 1} ${now.getDate()} ‘${String(now.getFullYear()).slice(2)}`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  if (film !== 'none') {
    ctx.font = `600 ${34 * k}px sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 6 * k;
    ctx.fillStyle = 'rgba(241, 126, 3, 0.35)';
    ctx.fillText(date, 33 * k, h - 119 * k);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f17e03';
    ctx.fillText(date, 32 * k, h - 120 * k);
  }
  ctx.font = `500 ${20 * k}px sans-serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 4 * k;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('memoify.live', 32 * k, h - 84 * k);
  ctx.shadowBlur = 0;
}

function verdict(ratio: number) {
  if (ratio >= 1) return { text: 'dikecilin, tajam', tone: 'text-green-400' };
  if (ratio >= 0.74)
    return { text: 'dibesarin dikit, agak lembut', tone: 'text-amber-400' };
  return { text: 'dibesarin banyak, buram', tone: 'text-red-400' };
}

export default function CameraLab() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [info, setInfo] = useState<StreamInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [film, setFilm] = useState<Film>('gold');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [zoom, setZoom] = useState({ x: 0.5, y: 0.5 });
  const [screen, setScreen] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    setScreen(
      `${window.innerWidth}x${window.innerHeight} titik, rasio piksel ${window.devicePixelRatio}`
    );
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser ini tidak memberi akses kamera.');
      return;
    }
    navigator.mediaDevices
      // The guest camera's own request, word for word.
      .getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1440 },
          aspectRatio: { ideal: 4 / 3 },
        },
        audio: false,
      })
      .then((granted) => {
        if (cancelled) {
          granted.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = granted;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = granted;
        video.onloadedmetadata = () => {
          const s = granted.getVideoTracks()[0]?.getSettings() ?? {};
          setInfo({
            width: video.videoWidth,
            height: video.videoHeight,
            settings: `${s.width ?? '?'}x${s.height ?? '?'} @ ${Math.round(s.frameRate ?? 0)} fps`,
            stillCapture: 'ImageCapture' in window,
          });
        };
        video.play().catch(() => undefined);
      })
      .catch((e: Error) => setError(`Kamera tidak bisa dibuka: ${e.name}`));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const shoot = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || busy) return;
    setBusy(true);
    // One frame, held still, so all three keepers are the same moment.
    const frame = document.createElement('canvas');
    frame.width = video.videoWidth;
    frame.height = video.videoHeight;
    frame.getContext('2d')!.drawImage(video, 0, 0);
    await new Promise((r) => setTimeout(r, 30));

    const next: Result[] = [];
    for (const v of VARIANTS) {
      const { canvas: staged, scale } = stage(
        frame,
        frame.width,
        frame.height,
        v.w,
        v.h
      );
      // Grain is made ahead of the shot in the real camera, so it is not
      // part of what a guest waits for.
      warmMemoRollGrain(v.w, v.h);
      const t0 = performance.now();
      const { canvas } = bakeMemoRollFilm(staged, v.w, v.h, film);
      stamp(canvas, film);
      const bakeMs = performance.now() - t0;
      const t1 = performance.now();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', v.q)
      );
      const encodeMs = performance.now() - t1;
      if (!blob) continue;
      next.push({
        id: v.id,
        name: v.name,
        w: v.w,
        h: v.h,
        q: v.q,
        url: URL.createObjectURL(blob),
        kb: Math.round(blob.size / 1024),
        bakeMs: Math.round(bakeMs),
        encodeMs: Math.round(encodeMs),
        ratio: 1 / scale,
      });
      await new Promise((r) => setTimeout(r, 0));
    }
    setResults((previous) => {
      previous.forEach((r) => URL.revokeObjectURL(r.url));
      return next;
    });
    setBusy(false);
  }, [busy, film]);

  const base = results[0]?.kb ?? 0;

  return (
    <main className="min-h-screen bg-neutral-950 px-4 pb-16 pt-5 text-neutral-100">
      <h1 className="text-xl font-bold">MemoRoll camera lab</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Halaman uji. Foto diproses di HP ini saja, tidak ada yang di-upload.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-950 p-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div
        className="relative mt-4 overflow-hidden rounded-lg bg-black"
        style={{ aspectRatio: '3 / 4' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <section className="mt-3 rounded-lg bg-neutral-900 p-3 text-sm leading-6">
        <p className="font-semibold">Yang dikasih kamera HP ini</p>
        {info ? (
          <>
            <p>
              Stream:{' '}
              <span className="font-mono text-orange-400">
                {info.width}x{info.height}
              </span>{' '}
              ({((info.width * info.height) / 1e6).toFixed(2)} MP)
            </p>
            <p className="text-neutral-400">Track: {info.settings}</p>
            <p className="text-neutral-400">Layar: {screen}</p>
            <p className="text-neutral-400">
              Foto asli dari sensor (ImageCapture):{' '}
              {info.stillCapture ? 'ada' : 'tidak ada'}
            </p>
            {[960, 1440].map((w) => {
              const h = (w * 4) / 3;
              const ratio = 1 / Math.max(w / info.width, h / info.height);
              const v = verdict(ratio);
              return (
                <p key={w}>
                  Ke {w}x{h}: <span className={v.tone}>{v.text}</span>{' '}
                  <span className="text-neutral-500">
                    ({ratio.toFixed(2)} piksel stream per piksel hasil)
                  </span>
                </p>
              );
            })}
          </>
        ) : (
          <p className="text-neutral-400">Menunggu kamera...</p>
        )}
      </section>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {FILMS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilm(f.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${film === f.id ? 'bg-orange-500 text-black' : 'bg-neutral-800 text-neutral-200'}`}>
            {f.name}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={shoot}
        disabled={!info || busy}
        className="mt-3 w-full rounded-lg bg-white py-4 text-base font-bold text-black disabled:opacity-40">
        {busy ? 'Memproses 3 versi...' : 'Jepret dan bandingkan'}
      </button>

      {results.length > 0 ? (
        <>
          <section className="mt-5 space-y-2">
            {results.map((r) => {
              const v = verdict(r.ratio);
              return (
                <div
                  key={r.id}
                  className="flex gap-3 rounded-lg bg-neutral-900 p-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0">
                    <img
                      src={r.url}
                      alt=""
                      className="h-28 w-[84px] rounded object-cover"
                    />
                  </a>
                  <div className="min-w-0 text-sm leading-6">
                    <p className="font-semibold">
                      {r.name}{' '}
                      <span className="font-normal text-neutral-400">
                        {r.w}x{r.h}, q{r.q}
                      </span>
                    </p>
                    <p>
                      <span className="font-mono text-orange-400">
                        {r.kb} KB
                      </span>
                      {base && r.kb !== base ? (
                        <span className="text-neutral-400">
                          {' '}
                          ({(r.kb / base).toFixed(1)}x)
                        </span>
                      ) : null}
                    </p>
                    <p className="text-neutral-400">
                      proses {r.bakeMs} ms, simpan {r.encodeMs} ms
                    </p>
                    <p className={v.tone}>{v.text}</p>
                    <a
                      href={r.url}
                      download={`memoroll-lab-${r.id}-${film}.jpg`}
                      className="text-orange-400 underline">
                      Simpan file
                    </a>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="mt-5">
            <p className="text-sm font-semibold">
              Detail yang sama, ukuran yang sama
            </p>
            <p className="text-xs text-neutral-400">
              Ketuk foto kecil di bawah untuk pindah titik yang dibandingkan.
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {results.map((r) => (
                <div key={r.id}>
                  <div
                    className="aspect-square overflow-hidden rounded bg-black"
                    style={{
                      backgroundImage: `url(${r.url})`,
                      // 5x the tile: every keeper is shown at the same
                      // size, so only its real detail differs.
                      backgroundSize: '500% auto',
                      backgroundPosition: `${zoom.x * 100}% ${zoom.y * 100}%`,
                    }}
                  />
                  <p className="mt-1 text-center text-xs text-neutral-400">
                    {r.name}
                  </p>
                </div>
              ))}
            </div>
            <img
              src={results[results.length - 1].url}
              alt="Ketuk untuk memilih titik"
              onClick={(e) => {
                const box = e.currentTarget.getBoundingClientRect();
                setZoom({
                  x: Math.min(
                    1,
                    Math.max(0, (e.clientX - box.left) / box.width)
                  ),
                  y: Math.min(
                    1,
                    Math.max(0, (e.clientY - box.top) / box.height)
                  ),
                });
              }}
              className="mx-auto mt-3 w-2/3 rounded"
            />
          </section>
        </>
      ) : null}
    </main>
  );
}
