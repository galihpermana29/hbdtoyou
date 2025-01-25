import { SessionOptions } from 'iron-session';

export interface SpotifySession {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}
export interface SessionData {
  accessToken?: string;
  userId?: string;
  email?: string;
  fullName?: string;
  spotify?: SpotifySession;
}

export const defaultSession: SessionData = {};

export const sessionOptions: SessionOptions = {
  // You need to create a secret key at least 32 characters long.
  password: 'yMB4GTIrk7KdGqBCvxT5Ka0H3QWSlmewebRdkf2UkPM=',
  cookieName: 'memoify-user-session',
  cookieOptions: {
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 3, // One hour
  },
};
