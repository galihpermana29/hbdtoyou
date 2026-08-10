import { getSpotifyAccessToken } from '@/action/spotify-api';
import { loginOAuth } from '@/action/user-api';
import { CREATE_FLOW_ROUTE } from '@/components/forms/wedding/create-flow-route';
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
    maxAge: 3 * 60 * 60, // 4 hours
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // The wedding landing signs a visitor in with the Create Flow as the
      // callback, so they land in the flow they were opening rather than on
      // the home page. This callback runs twice per sign-in - once when the
      // callback URL is stored, receiving the relative path, and once when
      // Google returns, receiving the absolute URL the first run answered -
      // so the flow is recognised in either form, by its whole path rather
      // than a prefix a sibling route could share. Every other sign-in stays
      // exactly what it was: its callback URL is the page the sign-in started
      // on, which is not the flow, and it still lands on home - as does
      // anything that cannot be read as a URL at all.
      try {
        const asked = new URL(url, baseUrl);
        if (
          asked.origin === baseUrl &&
          asked.pathname === CREATE_FLOW_ROUTE
        ) {
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
