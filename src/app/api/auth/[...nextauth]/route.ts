import { getSpotifyAccessToken } from '@/action/spotify-api';
import { loginOAuth } from '@/action/user-api';
import { setSession } from '@/store/get-set-session';
import dayjs from 'dayjs';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  session: {
    // Thirty days, matching the iron-session cookie - the two expire
    // together or the shorter one signs people out mid-event (2026-08-30).
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Signing in returns to the page that asked. Every signIn() call names
      // that page - explicitly, as the wedding landing does with the Create
      // Flow, or implicitly, since NextAuth defaults the callback to the page
      // sign-in started on - so any same-origin callback is honoured. This
      // callback runs twice per sign-in - once when the callback URL is
      // stored, receiving the relative path, and once when Google returns,
      // receiving the absolute URL the first run answered - so both forms are
      // read. A foreign origin, or anything that cannot be read as a URL at
      // all, lands on home rather than wherever it pointed.
      try {
        const asked = new URL(url, baseUrl);
        if (asked.origin === baseUrl) {
          return asked.href;
        }
      } catch {}
      return baseUrl;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          id_token: token.id_token,
        });
        session = Object.assign({}, session, {
          authToken: token.myToken,
        });
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { id_token } = account;
        const oAuthResult = await loginOAuth({ token_email: id_token! });

        if (oAuthResult.data) {
          const spotifySession = await getSpotifyAccessToken();
          const newSession = {
            spotify: {
              accessToken: spotifySession.data.access_token,
              refreshToken: '',
              expiresIn: dayjs()
                .add(spotifySession.data.expires_in, 'seconds')
                .format('YYYY-MM-DD HH:mm:ss'),
            },
            userId: oAuthResult.data.user_id,
            email: oAuthResult.data.email,
            fullName: oAuthResult.data.fullname,
            accessToken: oAuthResult.data.token,
          };
          await setSession(newSession);
        }
      }

      return token;
    },
  },
});

export { handler as GET, handler as POST };
