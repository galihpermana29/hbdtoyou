import { NextResponse } from 'next/server';

import { setSession } from '@/store/get-set-session';

export const dynamic = 'force-dynamic';

/**
 * Development-only login helper.
 *
 * Mints a `memoify-user-session` iron-session cookie from credentials supplied
 * via environment variables, so authenticated/admin flows can be exercised
 * without going through Google OAuth (useful for local dev and automated/agent
 * testing).
 *
 * Safety: this endpoint is inert unless `ALLOW_DEV_LOGIN === 'true'` AND the app
 * is running a dev server (`NODE_ENV !== 'production'`, i.e. `next dev`). This
 * intentionally still allows pointing at the production backend
 * (`APP_ENV=production`) from a dev server, while a real production build
 * (`next start`, where `NODE_ENV === 'production'`) can never enable it. Never
 * set ALLOW_DEV_LOGIN on the real production deployment.
 *
 * Required env when enabled:
 *   - DEV_LOGIN_TOKEN    backend access token to impersonate
 *   - DEV_LOGIN_USER_ID  backend user id (sent as the X-UserID header)
 *   - DEV_LOGIN_EMAIL    account email (drives the admin UI gate)
 *   - DEV_LOGIN_FULLNAME optional display name (defaults to "Dev Login")
 *
 * Usage: GET /api/devlogin[?to=/some/path]
 */
function isEnabled() {
  return (
    process.env.ALLOW_DEV_LOGIN === 'true' &&
    process.env.NODE_ENV !== 'production'
  );
}

export async function GET(request: Request) {
  if (!isEnabled()) {
    return new NextResponse('Not found', { status: 404 });
  }

  const accessToken = process.env.DEV_LOGIN_TOKEN;
  const userId = process.env.DEV_LOGIN_USER_ID;
  const email = process.env.DEV_LOGIN_EMAIL;
  const fullName = process.env.DEV_LOGIN_FULLNAME || 'Dev Login';

  if (!accessToken || !userId || !email) {
    return new NextResponse(
      'ALLOW_DEV_LOGIN is enabled but DEV_LOGIN_TOKEN, DEV_LOGIN_USER_ID and DEV_LOGIN_EMAIL must all be set.',
      { status: 500 }
    );
  }

  await setSession({ accessToken, userId, email, fullName });

  const { searchParams, origin } = new URL(request.url);
  const to = searchParams.get('to');
  const target = to && to.startsWith('/') ? to : '/dashboard';

  return NextResponse.redirect(new URL(target, origin));
}
