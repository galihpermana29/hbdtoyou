'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import Cta from '../ui/cta';
import { ChevronLeftIcon } from '../ui/icons';
import { REDUCED, SHEET_IN, SHEET_OUT } from '../ui/motion';
import { useSheetDrag } from '../ui/sheet-drag';
import { colour, type } from '../ui/tokens';

/**
 * The QR a guest scans, in the sheet the design hands it over in (creator-12).
 *
 * This is the whole distribution model: the roll is not sent to anybody, it is
 * put on the tables, and whoever points a phone at it is in. The line under the
 * heading is the design saying so - no app, no account with us, no list of who
 * was invited.
 *
 * The code is generated rather than drawn, because a picture of a QR is a QR
 * that goes to somebody else's roll.
 */
export default function QrSheet({
  eventName,
  url,
  onClose,
  onShareLink,
  onOpenDashboard,
  downloadName,
}: {
  eventName: string;
  /** Where the code points: the roll's own address. */
  url: string;
  onClose: () => void;
  onShareLink: () => void;
  /**
   * The owner's way onward once the QR exists: their console for this roll.
   * Asked for by the owner (2026-08-30); the demo passes nothing and the
   * sheet stays exactly the drawn one.
   */
  onOpenDashboard?: () => void;
  /**
   * The file name the QR saves under, which turns on the Download QR button:
   * a creator prints this for the tables, so it is a 1024px PNG rather than
   * a screenshot of a 132px code. Owner's ask (2026-11-12); the demo passes
   * nothing and the sheet stays exactly the drawn one.
   */
  downloadName?: string;
}) {
  const reduce = useReducedMotion();
  const { backdropOpacity, dragProps } = useSheetDrag(onClose);
  const printable = useRef<HTMLCanvasElement>(null);

  const downloadQr = () => {
    const canvas = printable.current;
    if (!canvas || !downloadName) return;
    const anchor = document.createElement('a');
    anchor.href = canvas.toDataURL('image/png');
    anchor.download = downloadName;
    anchor.click();
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {/* Outer: the scrim arriving and leaving with the sheet. Inner: the
          scrim itself, dimming as a finger drags the sheet down. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: reduce ? REDUCED : SHEET_IN }}
        exit={{ opacity: 0, transition: reduce ? REDUCED : SHEET_OUT }}>
        <motion.button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
          style={{ background: 'rgba(0, 0, 0, 0.5)', opacity: backdropOpacity }}
        />
      </motion.div>

      {/* Outer: the sheet arriving and leaving (Vaul's iOS sheet timing, and
          out the way it came in). Inner: the finger. */}
      <motion.div
        className="relative"
        initial={reduce ? { opacity: 0 } : { transform: 'translateY(100%)' }}
        animate={
          reduce
            ? { opacity: 1, transition: REDUCED }
            : { transform: 'translateY(0%)', transition: SHEET_IN }
        }
        exit={
          reduce
            ? { opacity: 0, transition: REDUCED }
            : { transform: 'translateY(100%)', transition: SHEET_OUT }
        }>
        <motion.div
          role="dialog"
          aria-label="Share QR Code"
          className="relative flex flex-col items-center px-[16px] pb-[58px] pt-[20px]"
          {...dragProps}
          style={{
            ...dragProps.style,
            background: colour.paper,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          {/* The design puts a second pill at the far right of this row at no
            opacity, which is a spacer holding the row symmetrical rather than a
            control. A flex row needs no such thing. */}
          <div className="flex w-full">
            <button
              type="button"
              aria-label="Back"
              onClick={onClose}
              className="flex h-[44px] w-[48px] items-center justify-center rounded-full"
              style={{
                background: colour.flame,
                color: '#fafafa',
                boxShadow:
                  'inset 4px 4px 40.9px 12px rgba(0,0,0,0.1), inset 0 -3.6px 5.2px 1px rgba(0,0,0,0.17)',
              }}>
              <ChevronLeftIcon className="h-[24px] w-[24px]" />
            </button>
          </div>

          <div className="mt-[20px] flex w-full flex-col items-center gap-[32px]">
            <div className="flex w-full flex-col items-center gap-[4px] text-center">
              <h2
                className={type.heading}
                style={{
                  color: colour.ink,
                  fontFamily: 'var(--font-mr-body)',
                }}>
                Share QR Code
              </h2>
              <p
                className={type.body}
                style={{
                  color: colour.ink,
                  fontFamily: 'var(--font-mr-body)',
                }}>
                Anyone can join this Memoroll by scanning the QR Code. No app
                download required!
              </p>
            </div>

            <div className="flex flex-col items-center gap-[12px]">
              <div
                className="p-[12px]"
                style={{
                  border: '1px solid rgba(33, 33, 33, 0.2)',
                  borderRadius: 10,
                }}>
                <QRCodeSVG
                  value={url}
                  size={132}
                  fgColor={colour.ink}
                  bgColor={colour.paper}
                />
              </div>
              <p
                className="text-[14px] font-bold leading-[150%] tracking-[-0.011em]"
                style={{
                  color: colour.ink,
                  fontFamily: 'var(--font-mr-body)',
                }}>
                {eventName}
              </p>
            </div>

            <Cta
              tone="outline"
              onClick={onShareLink}
              className="h-[44px] w-full">
              Share Link
            </Cta>

            {downloadName ? (
              <>
                <Cta
                  tone="outline"
                  onClick={downloadQr}
                  className="-mt-[20px] h-[44px] w-full">
                  Download QR
                </Cta>
                {/* The print-size code, kept offscreen: only its pixels are
                  wanted, and only when the button asks for them. */}
                <div aria-hidden className="fixed -left-[2000px] top-0">
                  <QRCodeCanvas
                    ref={printable}
                    value={url}
                    size={1024}
                    marginSize={4}
                    fgColor="#212121"
                    bgColor="#ffffff"
                  />
                </div>
              </>
            ) : null}

            {onOpenDashboard ? (
              <Cta onClick={onOpenDashboard} className="h-[44px] w-full">
                Open dashboard
              </Cta>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
