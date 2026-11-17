'use client';

import { ArrowLeft, Check, Clock, QrCode, Smartphone } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import type { IListPackageResponse } from '@/action/interfaces';
import { ctaGhost, ctaPrimary, press } from '@/components/home/ui';
import { idr, planGives } from '@/lib/pricing';

/**
 * The checkout's screens other than the order itself: signed out, the QR
 * being paid, paid, and not paid. The order and all the calls are in
 * checkout.tsx.
 */

export const card =
  'rounded-[28px] border border-[#e8ded3] bg-[#fffdfa] p-6 md:p-8';

/** Nobody is signed in: say so, and offer the way in. */
export function SignedOut() {
  return (
    <div className={`${card} mx-auto max-w-[520px] text-center`}>
      <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-[#1b1b1b]">
        Sign in to check out
      </h1>
      <p className="mx-auto mt-3 max-w-[380px] text-[16px] leading-[1.6] text-[#4a4642]">
        Your credits are added to your account, so we need to know which one.
      </p>
      <div className="mt-7 flex flex-col items-stretch gap-3">
        <button
          type="button"
          onClick={() =>
            signIn('google', {
              callbackUrl: window.location.pathname + window.location.search,
            })
          }
          className={ctaPrimary}>
          Sign in with Google
        </button>
        <Link href="/#pricing" className={ctaGhost}>
          Compare the plans
        </Link>
      </div>
    </div>
  );
}

function format(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

/** How long a QR is good for, as the old countdown had it. */
const QR_SECONDS = 10 * 60;

/**
 * The QR, what it is for, how to pay it, and how long is left. The page
 * keeps asking the backend whether it has been paid (checkout.tsx); this
 * says that it is waiting.
 */
export function QrView({
  qr,
  amount,
  plan,
  startedAt,
  onBack,
  onExpired,
}: {
  qr: string;
  amount: number;
  /** When this QR was made: one shown again has less time left on it. */
  startedAt: number;
  plan: IListPackageResponse | null;
  onBack: () => void;
  onExpired: () => void;
}) {
  const remaining = useCallback(
    () => QR_SECONDS - Math.floor((Date.now() - startedAt) / 1000),
    [startedAt]
  );
  const [left, setLeft] = useState(remaining);
  useEffect(() => {
    // Read from the clock each second, so a tab left in the background
    // does not fall behind.
    const timer = setInterval(() => setLeft(remaining()), 1000);
    return () => clearInterval(timer);
  }, [remaining]);
  useEffect(() => {
    if (left <= 0) onExpired();
  }, [left, onExpired]);

  return (
    <div className={`${card} mx-auto max-w-[860px]`}>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
        <div className="w-full max-w-[300px] shrink-0 rounded-[20px] border border-[#e8ded3] bg-white p-4">
          <img
            src={qr}
            alt="QRIS code to scan with your banking or e-wallet app"
            width={300}
            height={300}
            className="block aspect-square w-full"
          />
        </div>

        <div className="w-full">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-[#e34013]">
            <span
              aria-hidden
              className="checkout-wait size-2 rounded-full bg-[#ff3e09]"
              style={{ animation: 'checkout-wait 1.6s ease-in-out infinite' }}
            />
            Waiting for your payment
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-[#1b1b1b] md:text-[32px]">
            Scan to pay IDR {idr(amount)}
          </h1>
          {plan ? (
            <p className="mt-2 text-[15px] leading-[1.55] text-[#4a4642]">
              {plan.name}
              {planGives(plan) ? `: ${planGives(plan)}` : ''}
            </p>
          ) : null}

          <ol className="mt-6 flex flex-col gap-3 text-[15px] leading-[1.5] text-[#35302b]">
            {[
              [Smartphone, 'Open your banking or e-wallet app.'],
              [QrCode, 'Choose Scan / QRIS and scan this code.'],
              [Check, 'Confirm the amount. This page updates by itself.'],
            ].map(([Icon, text], index) => {
              const Glyph = Icon as typeof Check;
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fbf4ec]">
                    <Glyph aria-hidden className="size-4 text-[#e34013]" />
                  </span>
                  <span className="pt-[3px]">{text as string}</span>
                </li>
              );
            })}
          </ol>

          <p
            className="mt-6 flex items-center gap-2 text-[14px] font-medium text-[#6b655f]"
            aria-live="off">
            <Clock aria-hidden className="size-4" />
            This code expires in{' '}
            <span className="font-mono font-bold tabular-nums text-[#1b1b1b]">
              {format(Math.max(0, left))}
            </span>
          </p>

          <button
            type="button"
            onClick={onBack}
            className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(33,33,33,0.2)] bg-[#fffdfa] px-5 text-[15px] font-semibold text-[#1b1b1b] ${press}`}>
            <ArrowLeft aria-hidden className="size-4" />
            Pay another way
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Paid. Says what was added, from the plan's own numbers, then goes on to
 * where the buyer was headed.
 *
 * The seal lands once (an entrance: strong ease-out, from 0.82, never from
 * nothing) and the tick is drawn into it just after.
 */
export function PaidView({
  plan,
  backToGift,
  onGo,
}: {
  plan: IListPackageResponse | null;
  /** The paywall sent them here from a gift they were making. */
  backToGift: boolean;
  onGo: () => void;
}) {
  const [left, setLeft] = useState(4);
  useEffect(() => {
    const timer = setInterval(() => setLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (left <= 0) onGo();
  }, [left, onGo]);

  const gives = plan ? planGives(plan) : '';
  return (
    <div className={`${card} mx-auto max-w-[520px] text-center`} role="status">
      <span
        aria-hidden
        className="checkout-seal mx-auto flex size-[72px] items-center justify-center rounded-full bg-[#ff3e09]"
        style={{
          animation: 'checkout-seal 420ms cubic-bezier(0.23, 1, 0.32, 1) both',
        }}>
        <svg viewBox="0 0 24 24" className="size-9" fill="none">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="30"
            className="checkout-tick"
            style={{
              animation:
                'checkout-tick 420ms cubic-bezier(0.77, 0, 0.175, 1) 260ms both',
            }}
          />
        </svg>
      </span>
      <h1 className="mt-6 text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-[#1b1b1b] md:text-[32px]">
        Payment received
      </h1>
      <p className="mx-auto mt-3 max-w-[400px] text-[16px] leading-[1.6] text-[#4a4642]">
        {plan && gives
          ? `${plan.name} is on your account: ${gives}.`
          : 'Your plan is on your account.'}
      </p>
      <button
        type="button"
        onClick={onGo}
        className={`mt-7 w-full ${ctaPrimary}`}>
        {backToGift ? 'Back to my gift' : 'Go to my dashboard'}
      </button>
      <p className="mt-3 text-[13px] font-medium text-[#8a847d]">
        {backToGift ? 'Taking you back' : 'Taking you there'} in{' '}
        {Math.max(0, left)}…
      </p>
    </div>
  );
}

/** The backend says this payment did not go through. */
export function NotPaidView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={`${card} mx-auto max-w-[520px] text-center`} role="alert">
      <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-[#1b1b1b]">
        That payment did not go through
      </h1>
      <p className="mx-auto mt-3 max-w-[380px] text-[16px] leading-[1.6] text-[#4a4642]">
        Nothing was added to your account. If money left your wallet, write to
        memoify@memoify.live and we will sort it out.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={`mt-7 w-full ${ctaPrimary}`}>
        Try again
      </button>
    </div>
  );
}
