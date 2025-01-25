'use server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { SessionData, sessionOptions, SpotifySession } from './iron-session';
import { redirect } from 'next/navigation';

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function setSession(newSessionData: SessionData) {
  let session = await getSession();
  Object.keys(newSessionData).forEach((key) => {
    if (key !== 'spotify') {
      session[key as keyof Omit<SessionData, 'spotify'>] =
        newSessionData[key as keyof Omit<SessionData, 'spotify'>];
    } else {
      session[
        key as keyof Omit<
          SessionData,
          'accessToken' | 'refreshToken' | 'fullName' | 'userId' | 'email'
        >
      ] =
        newSessionData[
          key as keyof Omit<
            SessionData,
            'accessToken' | 'refreshToken' | 'fullName' | 'userId' | 'email'
          >
        ];
    }
  });

  await session.save();
}

export async function setSessionSpecific(
  value: string | SpotifySession,
  key: string
) {
  const session = await getSession();
  if (key !== 'spotify') {
    session[key as keyof Omit<SessionData, 'spotify'>] = value as string;
  } else {
    session[
      key as keyof Omit<
        SessionData,
        'accessToken' | 'refreshToken' | 'fullName' | 'userId' | 'email'
      >
    ] = value as SpotifySession;
  }
  await session.save();
}

export async function removeSession() {
  const session = await getSession();
  session.destroy();
}
