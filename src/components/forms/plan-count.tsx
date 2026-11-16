'use client';

import { message, notification } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useMemoifyProfile } from '@/app/session-provider';
import {
  limitsFor,
  nextFreeAt,
  PLAN_LIMITS,
  planRefusal,
  tierOf,
  type Kind,
  type PlanLimits,
  type Tier,
  waitLabel,
} from '@/lib/plan-limits';

/**
 * The plan a form is filled on, for `kind` (gift: credits, scrapbook:
 * tokens). Every gift and scrapbook form starts here instead of deciding
 * "free" for itself - see src/lib/plan-limits.ts.
 */
export function usePlan(kind: Kind = 'gift') {
  const profile = useMemoifyProfile();
  const tier = tierOf(profile, kind);
  return {
    profile,
    tier,
    isFree: tier === 'free',
    limits: limitsFor(profile, kind),
  };
}

/**
 * "3 / 5 songs · up to 20 with Premium" under a capped field: the limit is
 * seen before it is hit, and on the free plan it is also the gentlest
 * reminder of what Premium adds.
 */
export function PlanCount({
  used,
  limit,
  tier,
  noun,
}: {
  used: number;
  limit: keyof PlanLimits;
  tier: Tier;
  noun: string;
}) {
  const max = PLAN_LIMITS[tier][limit];
  const more = PLAN_LIMITS.premium[limit];
  return (
    <p className="text-[13px] text-gray-600 max-w-[400px] my-[6px]">
      <span className="font-semibold text-gray-800">
        {Math.min(used, max)} / {max}
      </span>{' '}
      {noun}
      {tier === 'free' && more > max ? (
        <>
          {' '}
          · up to {more} with{' '}
          <Link
            href="/payment?type=premium"
            className="font-semibold !text-[#E34013] underline">
            Premium
          </Link>
        </>
      ) : null}
    </p>
  );
}

/** Whether another row fits; says why not when it does not. */
export function roomForMore(
  used: number,
  limits: PlanLimits,
  tier: Tier,
  noun: string
) {
  if (used < limits.repeatItems) return true;
  message.info(
    tier === 'free'
      ? `The free plan holds ${limits.repeatItems} ${noun}. Premium holds ${PLAN_LIMITS.premium.repeatItems}.`
      : `${limits.repeatItems} ${noun} is the most one gift can hold.`
  );
  return false;
}

/** "Free plan: 5 photos · Premium: 20" - a field's caps, stated up front,
 *  with numbers that cannot drift from the ones enforced. */
export function PlanNote({
  limit,
  noun,
}: {
  limit: keyof PlanLimits;
  noun: string;
}) {
  return (
    <p className="text-[13px] text-gray-600 max-w-[400px]">
      Free plan: {PLAN_LIMITS.free[limit]} {noun} ·{' '}
      <span className="font-bold">Premium</span>: {PLAN_LIMITS.premium[limit]}
    </p>
  );
}

/**
 * Say why a create failed. The backend's plan refusals - today's free gift
 * already made, no credit or token left - get words a person can act on and
 * a way to Premium; anything else falls back to the form's own message.
 */
export function reportCreateFailure(
  code: string | undefined,
  profile: Parameters<typeof planRefusal>[1],
  kind: Kind = 'gift',
  fallback = 'Something went wrong!'
) {
  const refusal = planRefusal(code, profile, kind);
  if (!refusal) {
    message.error(code ? `${fallback} ${code}` : fallback);
    return;
  }
  notification.warning({
    message: refusal.title,
    description: (
      <span>
        {refusal.description}{' '}
        <Link
          href="/payment?type=premium"
          className="font-semibold !text-[#E34013] underline">
          See Premium
        </Link>
      </span>
    ),
    duration: 10,
  });
}

/**
 * Where a free account stands today: its free gift (or scrapbook) still
 * waiting, or when the next one is ready. Shown before the work starts, so
 * the 24-hour limit is never first met as a refusal at the end.
 */
export function FreeAllowance({
  kind = 'gift',
  className = 'rounded-[12px]',
}: {
  kind?: Kind;
  className?: string;
}) {
  const { profile, isFree } = usePlan(kind);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(tick);
  }, []);
  if (!profile || !isFree) return null;
  const next = nextFreeAt(profile, kind, now);
  const premium = (
    <Link
      href="/payment?type=premium"
      className="font-semibold !text-[#E34013] underline">
      Go Premium
    </Link>
  );
  return (
    <div
      className={`${className} border border-dashed border-[#E34013] bg-[#FEF3F0] px-4 py-3 text-[13px] text-[#7B4034]`}>
      {next ? (
        <>
          You have made today&apos;s free {kind}. The next one is ready in{' '}
          <span className="font-semibold">{waitLabel(next, now)}</span>. Drafts
          count too. {premium} to make more now, on any template.
        </>
      ) : (
        <>
          Free plan: <span className="font-semibold">1 free {kind} a day</span>{' '}
          on free templates - a draft counts as one. Premium templates need{' '}
          {kind === 'gift' ? 'a credit' : 'a token'}. {premium} for more.
        </>
      )}
    </div>
  );
}
