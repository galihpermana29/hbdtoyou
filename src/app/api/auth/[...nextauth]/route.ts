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
  callbacks: {
    async redirect({ baseUrl }) {
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
