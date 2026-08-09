'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { MOCK_WEDDING } from '../../mock';
import {
  BodyText,
  DemoToast,
  FieldLabel,
  PillButton,
  useDemoToast,
} from '../../ui';
import { fadeUp, pressTap, staggerContainer } from '../../variants';
import { StepProps } from '../config';

/**
 * What the browser's print dialog gets: just the table card, upright, at a
 * card's size in the middle of the sheet.
 */
const PRINT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  .mr-print-card, .mr-print-card * { visibility: visible !important; }
  .mr-print-card {
    position: absolute !important;
    left: 0;
    right: 0;
    top: 24mm;
    width: 90mm !important;
    margin: 0 auto !important;
    transform: none !important;
    box-shadow: none !important;
    border: 1px dashed #bbb;
  }
}
`;

/**
 * Step 6 · sharing: the QR and link a couple would put on the tables. The QR
 * is generated client-side (qrcode.react) and points at the guest demo, so
 * scanning it from this screen genuinely opens the other half of the demo.
 * This is the "Get My Disposable Camera" destination the wedding flow never
 * had.
 */
export default function ShareStep({ config }: StepProps) {
  const reduce = useReducedMotion();
  const { toast, showToast } = useDemoToast();
  // The printed link should carry whatever host the demo is standing on;
  // until the browser says, the production host stands in.
  const [guestUrl, setGuestUrl] = useState(
    'https://memoify.live/memoroll/demo'
  );

  useEffect(() => {
    setGuestUrl(`${window.location.origin}/memoroll/demo`);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      showToast('Link copied - hand it to your guests');
    } catch {
      showToast(guestUrl);
    }
  };

  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? undefined : 'hidden'}
      animate={reduce ? undefined : 'show'}
      className="flex flex-col gap-6">
      <motion.div variants={reduce ? undefined : fadeUp}>
        <BodyText className="!text-left text-[#212121]/75">
          Print this on the tables. One scan hands each guest their disposable
          camera - no app, no account gymnastics.
        </BodyText>
      </motion.div>

      <style>{PRINT_STYLE}</style>

      {/* The table card, as it would sit against the centerpiece. */}
      <motion.div
        variants={reduce ? undefined : fadeUp}
        className="mr-print-card mx-auto w-[82%] rotate-[-2deg] bg-white p-5 pb-6 text-center shadow-lg">
        <p
          className="text-[20px] leading-[1.7] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          psst - steal our moments
        </p>
        <p
          className="mt-1 text-[12px] text-[#212121]/70"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          {config.eventName || `Wedding of ${MOCK_WEDDING.coupleNames}`}
        </p>
        <div className="mx-auto mt-4 w-fit rounded-[10px] border border-[#212121]/10 p-3">
          <QRCodeSVG value={guestUrl} size={132} fgColor="#212121" />
        </div>
        <p
          className="mt-4 text-[15px] text-[#212121]"
          style={{ fontFamily: 'var(--font-mr-hand)' }}>
          scan it - {config.shotsPerGuest} shots are yours
        </p>
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <FieldLabel>Or the plain link</FieldLabel>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="min-w-0 flex-1 truncate rounded-[10px] border border-[#212121]/15 bg-white px-4 py-3.5 text-[14px] text-[#212121]/80"
            style={{ fontFamily: 'var(--font-mr-body)' }}>
            {guestUrl}
          </span>
          <motion.button
            type="button"
            whileTap={reduce ? undefined : pressTap}
            onClick={copyLink}
            className="shrink-0 rounded-full bg-[#212121] px-4 py-3 text-[13px] text-white"
            style={{ fontFamily: 'var(--font-mr-ui)' }}>
            Copy
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={reduce ? undefined : fadeUp}>
        <PillButton variant="white" onClick={() => window.print()}>
          Print table cards
        </PillButton>
      </motion.div>

      <DemoToast message={toast} />
    </motion.div>
  );
}
