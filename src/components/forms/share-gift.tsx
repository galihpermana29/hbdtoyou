'use client';

import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { colour } from '@/components/memoroll/ui/tokens';

/**
 * The last step of making a gift: it is live, here is how to get it to them
 * (owner, 2026-11-17: "more beautiful, easy to share and easy to understand",
 * with the gift as a QR code).
 *
 * In the order a person needs it:
 * 1. what they made, in a phone - a gift is opened on a phone, and the old
 *    16:9 crop showed a sliver of it;
 * 2. the link, readable and one tap to copy;
 * 3. Share - the phone's own share sheet, where WhatsApp and Instagram live;
 *    on a computer, quick links to WhatsApp and email instead;
 * 4. the QR code, to print on a card or put on a screen, downloadable.
 *
 * Used by the creator's last step and by the dashboard's editor after an
 * edit, so a gift is shared the same way wherever it was finished.
 */

const PREVIEW_WIDTH = 390;
const PREVIEW_HEIGHT = 844;

export default function ShareGift({
  path,
  title = 'Your gift is live',
}: {
  /** The gift's path on this site, e.g. `netflixv1/<id>`. */
  path: string;
  title?: string;
}) {
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const frameBox = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === 'function');
  }, []);

  // The gift is drawn at a phone's real size and scaled into the frame, so
  // it lays out as the recipient will see it rather than squeezed.
  useEffect(() => {
    const box = frameBox.current;
    if (!box) return;
    const fit = () => setScale(box.clientWidth / PREVIEW_WIDTH);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const url = origin ? `${origin}/${path.replace(/^\//, '')}` : '';
  const shown = url.replace(/^https?:\/\//, '');
  const note = 'I made something for you';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // A browser that refuses the clipboard: the link is still on screen,
      // selectable.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    try {
      await navigator.share({ title: 'A gift for you', text: note, url });
    } catch {
      // Closing the sheet is an answer, not a failure.
    }
  };

  /**
   * A card to print or send as a picture: the code at a size a phone reads
   * from across a table, with a line telling the recipient what to do.
   * 1200x1700, about A6 at 290 dpi.
   */
  const drawCard = useCallback(
    async (qr: HTMLCanvasElement): Promise<Blob | null> => {
      const W = 1200;
      const H = 1700;
      const card = document.createElement('canvas');
      card.width = W;
      card.height = H;
      const ctx = card.getContext('2d');
      if (!ctx) return null;
      const family = "'Plus Jakarta Sans', sans-serif";
      await Promise.all(
        [500, 700].map((weight) =>
          document.fonts
            ?.load(`${weight} 64px ${family}`)
            .catch(() => undefined)
        )
      );
      ctx.fillStyle = colour.paper;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = colour.flame;
      ctx.fillRect(0, 0, W, 24);
      ctx.textAlign = 'center';
      ctx.fillStyle = colour.ink;
      ctx.font = `700 84px ${family}`;
      ctx.fillText('A gift for you', W / 2, 230);
      ctx.fillStyle = colour.muted;
      ctx.font = `500 40px ${family}`;
      ctx.fillText('Scan with your phone camera to open it', W / 2, 310);
      const size = 820;
      const x = (W - size) / 2;
      const y = 400;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x - 40, y - 40, size + 80, size + 80, 48);
      ctx.fill();
      ctx.strokeStyle = colour.hairline;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.drawImage(qr, x, y, size, size);
      ctx.fillStyle = colour.ink;
      ctx.font = `500 34px ${family}`;
      const short = shown.length > 48 ? `${shown.slice(0, 47)}…` : shown;
      ctx.fillText(short, W / 2, y + size + 130);
      ctx.fillStyle = colour.muted;
      ctx.font = `500 30px ${family}`;
      ctx.fillText('made with memoify.live', W / 2, H - 80);
      return new Promise((resolve) => card.toBlob(resolve, 'image/png'));
    },
    [shown]
  );

  /**
   * The two pictures, made ahead of the tap (owner, 2026-11-17: the
   * downloads did nothing on an iPhone). Two things broke them there:
   * - a `download` link to a `data:` URL, not in the page, is ignored by
   *   iOS WebKit - every iPhone browser, Chrome included;
   * - the card was drawn after an `await`, and Safari drops what a tap
   *   allows once the code has waited.
   * So both files exist before the tap, and the tap only hands one over.
   */
  const files = useRef<{ qr?: File; card?: File }>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    files.current = {};
    setReady(false);
    // The mark in the middle of the code loads on its own; give it a moment
    // to be drawn before the code is read off the canvas.
    const wait = setTimeout(async () => {
      const qr = qrRef.current;
      if (!qr || cancelled) return;
      const id = path.split('/').pop() ?? 'gift';
      const qrBlob = await new Promise<Blob | null>((resolve) =>
        qr.toBlob(resolve, 'image/png')
      );
      const cardBlob = await drawCard(qr);
      if (cancelled) return;
      files.current = {
        qr: qrBlob
          ? new File([qrBlob], `memoify-gift-${id}.png`, { type: 'image/png' })
          : undefined,
        card: cardBlob
          ? new File([cardBlob], `memoify-gift-card-${id}.png`, {
              type: 'image/png',
            })
          : undefined,
      };
      setReady(true);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(wait);
    };
  }, [url, path, drawCard]);

  /**
   * On a phone, the share sheet - its "Save Image" puts the picture in
   * Photos, which is where a phone keeps pictures. On a computer, a real
   * download: a blob link that is in the page when it is clicked.
   */
  const handOver = async (kind: 'qr' | 'card') => {
    const file = files.current[kind];
    if (!file) return;
    const phone = window.matchMedia?.('(pointer: coarse)').matches;
    if (phone && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (error) {
        // Closing the sheet is an answer; anything else falls through to a
        // plain download.
        if ((error as Error)?.name === 'AbortError') return;
      }
    }
    const href = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = file.name;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(href), 4000);
  };

  const pill =
    'inline-flex h-[44px] items-center justify-center gap-[8px] rounded-full px-[18px] text-[14px] font-semibold tracking-[-0.011em] transition-transform active:scale-[0.97]';

  return (
    <div className="mx-auto grid w-full max-w-[920px] grid-cols-1 items-start gap-[32px] md:grid-cols-[300px_1fr] md:gap-[48px]">
      {/* 1. What they made, in a phone. */}
      <div className="order-2 mx-auto w-[200px] md:order-none md:w-[300px]">
        <div
          className="relative overflow-hidden rounded-[32px] border-[6px] bg-white shadow-[0_20px_50px_rgba(35,35,35,0.18)]"
          style={{ borderColor: colour.ink }}>
          <div
            ref={frameBox}
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}` }}>
            {url ? (
              <iframe
                src={url}
                title="Your gift"
                className="absolute left-0 top-0 origin-top-left border-0"
                style={{
                  width: PREVIEW_WIDTH,
                  height: PREVIEW_HEIGHT,
                  transform: `scale(${scale})`,
                }}
              />
            ) : null}
          </div>
        </div>
        <p
          className="mt-[10px] text-center text-[12px]"
          style={{ color: colour.muted }}>
          What they will see
        </p>
      </div>

      <div className="order-1 flex flex-col gap-[20px] md:order-none">
        <div className="flex flex-col gap-[6px]">
          <span
            className="w-fit rounded-full px-[10px] py-[2px] text-[12px] font-semibold"
            style={{ background: '#e7f6ec', color: '#1f7a45' }}>
            ● Published
          </span>
          <h2
            className="text-[24px] font-bold leading-[130%] tracking-[-0.02em] md:text-[28px]"
            style={{ color: colour.ink }}>
            {title}
          </h2>
          <p
            className="text-[14px] leading-[150%]"
            style={{ color: colour.muted }}>
            Send the link, or let them scan the code. It opens on any phone, no
            app or sign-in needed.
          </p>
        </div>

        {/* 2. The link, one tap to copy. */}
        <div
          className="flex items-center gap-[8px] rounded-[12px] border bg-white p-[6px] pl-[14px]"
          style={{ borderColor: 'rgba(0,0,0,0.2)' }}>
          <span
            className="min-w-0 flex-1 truncate text-[14px]"
            style={{ color: colour.ink }}
            title={url}>
            {shown}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className={`${pill} h-[36px] px-[14px]`}
            style={{
              background: copied
                ? '#1f7a45'
                : canShare
                  ? colour.ink
                  : colour.flame,
              color: '#ffffff',
            }}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* 3. Share: the phone's sheet, or quick links on a computer. */}
        <div className="flex flex-wrap gap-[10px]">
          {canShare ? (
            // A phone: its own share sheet holds WhatsApp, Instagram and the
            // rest, so it leads. A computer has none and copying is the main
            // action, already one tap away in the link field.
            <button
              type="button"
              onClick={share}
              className={`${pill} min-w-[160px] flex-1 md:flex-none`}
              style={{
                background: colour.flame,
                color: '#ffffff',
                boxShadow: 'inset 2px 3px 3.2px rgba(255,255,255,0.25)',
              }}>
              Share gift
            </button>
          ) : null}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${note} ${url}`)}`}
            target="_blank"
            rel="noreferrer"
            className={pill}
            style={{
              background: colour.paper,
              color: colour.ink,
              border: '1px solid rgba(33,33,33,0.2)',
            }}>
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent('A gift for you')}&body=${encodeURIComponent(`${note}: ${url}`)}`}
            className={pill}
            style={{
              background: colour.paper,
              color: colour.ink,
              border: '1px solid rgba(33,33,33,0.2)',
            }}>
            Email
          </a>
          <Link
            href={`/${path}`}
            target="_blank"
            className={pill}
            style={{
              background: colour.paper,
              color: colour.ink,
              border: '1px solid rgba(33,33,33,0.2)',
            }}>
            Open gift
          </Link>
        </div>

        {/* 4. The QR code, to print or put on a screen. */}
        <div
          className="flex items-center gap-[16px] rounded-[20px] border bg-white p-[16px]"
          style={{ borderColor: colour.hairline }}>
          <div className="shrink-0 rounded-[12px] bg-white p-[6px]">
            {url ? (
              <QRCodeCanvas
                ref={qrRef}
                value={url}
                size={1024}
                marginSize={2}
                level="H"
                fgColor={colour.ink}
                imageSettings={{
                  // Same-origin, so the canvas stays readable for download.
                  src: '/apple-touch-icon.png',
                  height: 220,
                  width: 220,
                  excavate: true,
                }}
                style={{ width: 112, height: 112 }}
                aria-label="QR code for your gift"
              />
            ) : (
              <div className="h-[112px] w-[112px]" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-[8px]">
            <p
              className="text-[14px] font-semibold"
              style={{ color: colour.ink }}>
              Scan to open
            </p>
            <p
              className="text-[12px] leading-[150%]"
              style={{ color: colour.muted }}>
              Download a ready-to-print card, tuck it in a present, or show the
              code on your screen.
            </p>
            <div className="flex flex-wrap gap-[8px]">
              <button
                type="button"
                onClick={() => handOver('card')}
                disabled={!ready}
                className={`${pill} h-[36px] w-fit px-[14px] ${ready ? '' : 'opacity-50'}`}
                style={{
                  background: colour.ink,
                  color: '#ffffff',
                }}>
                Download card
              </button>
              <button
                type="button"
                onClick={() => handOver('qr')}
                disabled={!ready}
                className={`${pill} h-[36px] w-fit px-[14px] ${ready ? '' : 'opacity-50'}`}
                style={{
                  background: colour.unchosen,
                  color: colour.ink,
                }}>
                QR only
              </button>
            </div>
          </div>
        </div>

        <p className="text-[12px]" style={{ color: colour.muted }}>
          Tag{' '}
          <a
            href="https://instagram.com/memoify.live"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline"
            style={{ color: colour.ink }}>
            @memoify.live
          </a>{' '}
          when you post it ·{' '}
          <Link
            href="/templates"
            className="font-semibold underline"
            style={{ color: colour.ink }}>
            Make another gift
          </Link>
        </p>
      </div>
    </div>
  );
}
