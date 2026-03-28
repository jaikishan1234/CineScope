const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/movie.controller');

// Public routes — no auth required
router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/popular-tv', getPopularTV);
router.get('/top-rated', getTopRated);
router.get('/now-playing', getNowPlaying);
router.get('/upcoming', getUpcoming);
router.get('/search', search);
router.get('/genres', getGenres);
router.get('/by-genre', getByGenre);
router.get('/:mediaType/:id', getDetails);
router.get('/:mediaType/:id/videos', getVideos);

module.exports = router;
