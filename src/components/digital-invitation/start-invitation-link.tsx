'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import type { ReactNode } from 'react';

import { useMemoifySession } from '@/app/session-provider';
import { CREATE_FLOW_ROUTE } from '@/components/forms/wedding/create-flow-route';

/**
 * Opens the wedding invitation Create Flow. The flow needs an account (saving
 * needs an owner, uploads need a bearer token), so a visitor without one is
 * signed in first and the callback carries them into the flow they asked for.
 */
export default function StartInvitationLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const session = useMemoifySession();

  return (
    <Link
      href={CREATE_FLOW_ROUTE}
      onClick={(event) => {
        if (!session?.accessToken) {
          event.preventDefault();
          signIn('google', { callbackUrl: CREATE_FLOW_ROUTE });
        }
      }}
      className={className}>
      {children}
    </Link>
  );
}
