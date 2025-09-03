interface Genre {
  id: number;
  name: string;
}

interface GenreResponse {
  genres: Genre[];
}

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNDNmOTFlMTMwODY0YjIxMjM1ODE2OGY5ZjFlNGIzMSIsIm5iZiI6MTc1Mjk5MDE0Ny45MjIsInN1YiI6IjY4N2M4MWMzODg5Y2Y5NTgxZTI0NDI4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4eYgsNND8hwcniRTHpT-rLOhlykE9YwmFGm-nMViy1Y',
    },
  };

  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?language=en',
      options
    );
    const data = (await response.json()) as GenreResponse;
    return data.genres;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    return [];
  }
};

export type { Genre };
