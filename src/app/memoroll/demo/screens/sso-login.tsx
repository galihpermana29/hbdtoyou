'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MOCK_WEDDING } from '../mock';
import { BodyText, HandHeading } from '../ui';
import { pressTap } from '../variants';

/**
 * SSO Login. The flowchart names it; the 14 exports do not design it, so
 * this screen is interpreted in the same voice: paper ground, handwritten
 * heading, one provider button. Any tap signs in - no real OAuth.
 */
export default function SsoLoginScreen({
  onSignedIn,
}: {
  onSignedIn: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-14">
      <HandHeading>First, who are you?</HandHeading>
      <BodyText className="mt-3">
        Sign in so your ten shots have your name on them at{' '}
        {MOCK_WEDDING.coupleNames}’s reveal.
      </BodyText>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <motion.button
          type="button"
          onClick={onSignedIn}
          whileTap={reduce ? undefined : pressTap}
          className="flex h-[52px] w-[85%] items-center justify-center gap-3 rounded-full border border-[#212121]/20 bg-white text-[16px] text-[#212121] shadow-sm"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.96-1.07 7.93-2.92l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.09A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l4-3.09Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.63l4 3.09C6.23 6.88 8.88 4.77 12 4.77Z"
            />
          </svg>
          Continue with Google
        </motion.button>
        <p
          className="text-[12px] text-[#212121]/60"
          style={{ fontFamily: 'var(--font-mr-ui)' }}>
          demo: any tap signs you in, nothing is sent anywhere
        </p>
      </div>
    </div>
  );
}
