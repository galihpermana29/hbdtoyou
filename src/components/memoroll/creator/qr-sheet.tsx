'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Cta from '../ui/cta';
import { ChevronLeftIcon } from '../ui/icons';
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
}: {
  eventName: string;
  /** Where the code points: the roll's own address. */
  url: string;
  onClose: () => void;
  onShareLink: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0.12 } : { duration: 0.22 }}
      />

      <motion.div
        role="dialog"
        aria-label="Share QR Code"
        className="relative flex flex-col items-center px-[16px] pb-[58px] pt-[20px]"
        style={{
          background: colour.paper,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        initial={reduce ? { opacity: 0 } : { y: '100%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={
          reduce
            ? { duration: 0.12 }
            : { duration: 0.34, ease: [0.32, 0.72, 0, 1] }
        }>
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
              style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
              Share QR Code
            </h2>
            <p
              className={type.body}
              style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
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
              <QRCodeSVG value={url} size={132} fgColor={colour.ink} bgColor={colour.paper} />
            </div>
            <p
              className="text-[14px] font-bold leading-[150%] tracking-[-0.011em]"
              style={{ color: colour.ink, fontFamily: 'var(--font-mr-body)' }}>
              {eventName}
            </p>
          </div>

          <Cta tone="outline" onClick={onShareLink} className="h-[44px] w-full">
            Share Link
          </Cta>
        </div>
      </motion.div>
    </div>
  );
}
