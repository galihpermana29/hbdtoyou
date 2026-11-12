'use client';

import { colour } from './tokens';

/**
 * Who this phone is shooting as (owner, 2026-11-12).
 *
 * A guest link opened in a browser that is already signed in to memoify.live
 * - the creator testing their own roll, a shared phone - went straight in as
 * that account, with nothing on screen saying which account it was and no
 * way out before the gallery. This line says it, and "Not you?" signs out the
 * way the gallery's logout does, so the next sign-in is the right person's.
 */
export default function SignedInAs({
  email,
  onSwitch,
  className = '',
}: {
  email: string;
  onSwitch: () => void;
  className?: string;
}) {
  return (
    <p
      className={`max-w-full text-center text-[12px] leading-[150%] ${className}`}
      style={{ color: colour.muted, fontFamily: 'var(--font-mr-body)' }}>
      Signed in as{' '}
      <span className="break-all font-semibold" style={{ color: colour.ink }}>
        {email}
      </span>
      <button
        type="button"
        onClick={onSwitch}
        className="mx-auto mt-[2px] block font-semibold underline underline-offset-2"
        style={{ color: colour.ink }}>
        Not you? Switch account
      </button>
    </p>
  );
}
