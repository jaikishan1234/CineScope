const axios = require('axios');
const { TMDB_API_KEY, TMDB_BASE_URL } = require('../config/env');

console.log('=== TMDB CONFIG ===');
console.log('API Key:', TMDB_API_KEY ? `${TMDB_API_KEY.slice(0, 8)}...` : '❌ MISSING');
console.log('Base URL:', TMDB_BASE_URL);
console.log('==================');

// Axios instance pre-configured for TMDB
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

/**
 * Fetch trending movies/TV (week or day)
 */
const getTrending = async (mediaType = 'all', timeWindow = 'week', page = 1) => {
  const { data } = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, {
    params: { page },
  });
  return data;
};

/**
 * Fetch popular movies
 */
const getPopularMovies = async (page = 1) => {
  const { data } = await tmdbClient.get('/movie/popular', { params: { page } });
  return data;
};

/**
 * Fetch popular TV shows
 */
const getPopularTV = async (page = 1) => {
  const { data } = await tmdbClient.get('/tv/popular', { params: { page } });
  return data;
};

/**
 * Fetch top-rated movies
 */
const getTopRated = async (page = 1) => {
  const { data } = await tmdbClient.get('/movie/top_rated', { params: { page } });
  return data;
};

/**
 * Fetch now-playing movies
 */
const getNowPlaying = async (page = 1) => {
  const { data } = await tmdbClient.get('/movie/now_playing', { params: { page } });
  return data;
};

/**
 * Fetch movie or TV details by ID
 */
const getDetails = async (mediaType, id) => {
  const { data } = await tmdbClient.get(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,videos,similar,recommendations,images' },
  });
  return data;
};

/**
 * Fetch videos (trailers) for a movie or TV show
 */
const getVideos = async (mediaType, id) => {
  const { data } = await tmdbClient.get(`/${mediaType}/${id}/videos`);
  return data;
};

/**
 * Multi-search (movies, TV, people)
 */
const searchMulti = async (query, page = 1) => {
  const { data } = await tmdbClient.get('/search/multi', {
    params: { query, page, include_adult: false },
  });
  return data;
};

/**
 * Fetch movies by genre
 */
const getByGenre = async (genreId, page = 1) => {
  const { data } = await tmdbClient.get('/discover/movie', {
    params: { with_genres: genreId, sort_by: 'popularity.desc', page },
  });
  return data;
};

/**
 * Fetch all movie genres
 */
const getGenres = async () => {
  const { data } = await tmdbClient.get('/genre/movie/list');
  return data;
};

/**
 * Fetch upcoming movies
 */
const getUpcoming = async (page = 1) => {
  const { data } = await tmdbClient.get('/movie/upcoming', { params: { page } });
  return data;
};

module.exports = {
  getTrending,
  getPopularMovies,
  getPopularTV,
  getTopRated,
  getNowPlaying,
  getDetails,
  getVideos,
  searchMulti,
  getByGenre,
  getGenres,
  getUpcoming,
};
