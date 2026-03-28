const tmdb = require('../services/tmdb.service');

/**
 * GET /api/movies/trending
 */
const getTrending = async (req, res) => {
  const { mediaType = 'all', timeWindow = 'week', page = 1 } = req.query;
  const data = await tmdb.getTrending(mediaType, timeWindow, page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/popular
 */
const getPopular = async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb.getPopularMovies(page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/popular-tv
 */
const getPopularTV = async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb.getPopularTV(page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/top-rated
 */
const getTopRated = async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb.getTopRated(page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/now-playing
 */
const getNowPlaying = async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb.getNowPlaying(page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/upcoming
 */
const getUpcoming = async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb.getUpcoming(page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/:mediaType/:id
 */
const getDetails = async (req, res) => {
  const { mediaType, id } = req.params;

  if (!['movie', 'tv'].includes(mediaType)) {
    return res.status(400).json({ success: false, message: 'Invalid media type. Use "movie" or "tv"' });
  }

  const data = await tmdb.getDetails(mediaType, id);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/:mediaType/:id/videos
 */
const getVideos = async (req, res) => {
  const { mediaType, id } = req.params;
  const data = await tmdb.getVideos(mediaType, id);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/search?query=...
 */
const search = async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query || query.trim().length < 1) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }
  const data = await tmdb.searchMulti(query.trim(), page);
  res.json({ success: true, data });
};

/**
 * GET /api/movies/genres
 */
const getGenres = async (req, res) => {
  const data = await tmdb.getGenres();
  res.json({ success: true, data });
};

/**
 * GET /api/movies/by-genre?genreId=...
 */
const getByGenre = async (req, res) => {
  const { genreId, page = 1 } = req.query;
  if (!genreId) {
    return res.status(400).json({ success: false, message: 'genreId is required' });
  }
  const data = await tmdb.getByGenre(genreId, page);
  res.json({ success: true, data });
};

module.exports = {
  getTrending,
  getPopular,
  getPopularTV,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  getDetails,
  getVideos,
  search,
  getGenres,
  getByGenre,
};
