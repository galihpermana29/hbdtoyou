'use client';

/**
 * A person's rolls as a grid of cards, each wearing its own guest cover -
 * the same card language the wedding listing speaks (2026-08-30).
 *
 * The face is the real guest page at `/memoroll/{code}` in an inert, scaled
 * iframe. Every roll this app creates is published-or-nothing, so unlike the
 * wedding grid there is no draft face to fall back to - but an unpublished
 * event (an unpublish, an older backend) still falls back to its cover
 * photograph, and past that to a monogram. The memoroll gallery preview
 * counts nothing, so these faces cost no statistics.
 */

import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

import type { IMemorollEventResponse } from '@/action/interfaces';

/** How wide the guest page is drawn; the scale every face is computed from. */
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

const secondary =
  'flex-1 rounded-[8px] border border-[#D0D5DD] px-[8px] py-[8px] text-center text-[13px] font-[600] leading-[18px] text-[#344054] hover:bg-[#F9FAFB]';
const primary =
  'block w-full rounded-[8px] border border-[#E34013] bg-[#E34013] px-[14px] py-[10px] text-center text-[14px] font-[600] leading-[20px] text-white hover:opacity-90';
const note = 'text-[13px] font-[400] leading-[18px] text-[#667085]';

/** The event's opening moment, said the way the dashboard says dates. */
function opensOn(iso: string): string {
  const at = new Date(Date.parse(iso));
  return isNaN(at.getTime())
    ? ''
    : at.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
}

/** The letters a coverless face wears: the event's initials. */
function monogramOf(name: string): string {
  const letters = name
    .split(/[^A-Za-zÀ-ɏ]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase());
  return letters.slice(0, 2).join('') || '?';
}

/** The card's face: the live cover, the cover photograph, or a monogram. */
function RollFace({ event }: { event: IMemorollEventResponse }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const box = frame.current;
    if (!box) return;
    const measure = () => setScale(box.clientWidth / DESIGN_WIDTH);
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(box);
    return () => watcher.disconnect();
  }, []);

  const live = event.status === 'published';
  const cover = event.cover_photo_urls?.[0];

  return (
    <div
      ref={frame}
      className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2F4F7]">
      {live && scale > 0 ? (
        <iframe
          src={`/memoroll/${event.code}`}
          title={`Preview of ${event.host_name}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          scrolling="no"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      ) : cover ? (
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[48px] font-[600] tracking-[0.1em] text-[#D0D5DD]">
            {monogramOf(event.host_name)}
          </span>
        </div>
      )}

      {live ? (
        <a
          href={`/memoroll/${event.code}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${event.host_name}`}
          className="absolute inset-0"
        />
      ) : null}

      <span
        className={`absolute left-[12px] top-[12px] rounded-[16px] px-[10px] py-[2px] text-[12px] font-[600] leading-[18px] shadow-sm ${
          live ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-white text-[#344054]'
        }`}>
        {live ? 'Published' : 'Draft'}
      </span>
    </div>
  );
}

export default function MemorollListing({
  events,
}: {
  events: IMemorollEventResponse[];
}) {
  /** Which card's Copy link just landed, so its button can say so briefly. */
  const [copied, setCopied] = useState<string | null>(null);

  /**
   * Which card's QR is being minted. Setting it mounts one hidden
   * high-resolution QR canvas; the effect below saves it as a PNG and
   * unmounts it. Rendered on demand rather than one canvas per card,
   * because a 1024px canvas is only worth holding while somebody wants it -
   * and 1024px because this QR's whole job is being printed for the tables.
   */
  const [qrFor, setQrFor] = useState<IMemorollEventResponse | null>(null);
  const qrCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrFor || !qrCanvas.current) return;
    const anchor = document.createElement('a');
    anchor.href = qrCanvas.current.toDataURL('image/png');
    anchor.download = `memoroll-qr-${qrFor.code}.png`;
    anchor.click();
    setQrFor(null);
  }, [qrFor]);

  const copyLink = (event: IMemorollEventResponse) => {
    const url = `${window.location.origin}/memoroll/${event.code}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(event.id);
        setTimeout(
          () => setCopied((current) => (current === event.id ? null : current)),
          2000
        );
      })
      .catch(() => {
        // A context that refuses the clipboard still shows the link below.
      });
  };

  return (
    <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-col overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white shadow-sm transition-shadow hover:shadow-md">
          <RollFace event={event} />

          <div className="flex flex-1 flex-col gap-[12px] p-[16px]">
            <div>
              <h2 className="text-[16px] font-[600] leading-[24px] text-[#182230]">
                {event.host_name || 'Not named'}
              </h2>
              <p className={note}>
                Opens {opensOn(event.starts_at)} · {event.shot_limit} shots each
              </p>
            </div>

            <p className={`${note} truncate`}>
              Guests scan into{' '}
              <span className="font-[600] text-[#E34013]">
                /memoroll/{event.code}
              </span>
            </p>

            <div className="mt-auto flex flex-col gap-[8px]">
              {/* Row one: handing the roll to guests, two ways. */}
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => copyLink(event)}
                  className={secondary}>
                  {copied === event.id ? 'Copied!' : 'Copy link'}
                </button>
                <a
                  href={`/memoroll/${event.code}`}
                  target="_blank"
                  rel="noreferrer"
                  className={secondary}>
                  Open roll
                </a>
              </div>

              {/* Row two: the owner's way in. */}
              <Link href={`/dashboard/memoroll/${event.id}`} className={primary}>
                Manage roll
              </Link>

              {/* Row three: the QR itself, as a file for the tables. */}
              <button
                type="button"
                onClick={() => setQrFor(event)}
                className="block w-full rounded-[8px] border border-[#D0D5DD] px-[14px] py-[10px] text-center text-[14px] font-[600] leading-[20px] text-[#344054] hover:bg-[#F9FAFB]">
                Download guest QR
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* The QR being minted, held offscreen just long enough to save. The
          value is the same origin-composed address Copy link hands over. */}
      {qrFor ? (
        <div aria-hidden className="fixed -left-[2000px] top-0">
          <QRCodeCanvas
            ref={qrCanvas}
            value={`${window.location.origin}/memoroll/${qrFor.code}`}
            size={1024}
            marginSize={4}
            fgColor="#212121"
            bgColor="#ffffff"
          />
        </div>
      ) : null}
    </div>
  );
}
