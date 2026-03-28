const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

// All user routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:movieId', removeFavorite);

router.get('/history', getHistory);
router.post('/history', addToHistory);
router.delete('/history', clearHistory);

module.exports = router;
