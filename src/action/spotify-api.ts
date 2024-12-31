'use server';

import { getSession, setSessionSpecific } from '@/store/get-set-session';
import dayjs from 'dayjs';

export async function getSpotifyAccessToken() {
  const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        message: 'Failed to fetch access token' + ' ' + error,
        data: null,
        success: false,
      };
    }

    const data = await response.json();
    // console.log(data, 'data?');
    // setSessionSpecific(
    //   {
    //     accessToken: data.access_token,
    //     refreshToken: data.refresh_token,
    //     expiresIn: dayjs().add(data.expires_in, 'seconds').toString(),
    //   },
    //   'spotify'
    // );
    return {
      message: 'Successfully fetched access token',
      data: data,
      success: true,
    };
  } catch (error) {
    return {
      message: '500:Failed to fetch access token',
      data: null,
      success: false,
    };
  }
}

export async function searchSpotifySong(query: string) {
  // const session = await getSpotifyAccessToken();
  const session = await getSession();
  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${session.spotify?.accessToken}`,
      },
    }
  );

  if (!searchResponse.ok) {
    return {
      message: 'Failed to search song',
      data: null,
      success: false,
    };
  }
  const searchResults = await searchResponse.json();

  return {
    message: 'Successfully searched song',
    data: searchResults,
    success: true,
  };
}
