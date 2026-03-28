const User = require('../models/User');

/**
 * GET /api/user/profile
 */
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: { user } });
};

/**
 * PUT /api/user/profile
 */
const updateProfile = async (req, res) => {
  const { name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: { user }, message: 'Profile updated' });
};

/**
 * POST /api/user/favorites
 */
const addFavorite = async (req, res) => {
  const { movieId, title, posterPath, backdropPath, voteAverage, releaseDate, mediaType } = req.body;

  if (!movieId || !title) {
    return res.status(400).json({ success: false, message: 'movieId and title are required' });
  }

  const user = await User.findById(req.user._id);

  // Prevent duplicates
  const alreadyFav = user.favorites.some((f) => f.movieId === movieId);
  if (alreadyFav) {
    return res.status(409).json({ success: false, message: 'Already in favorites' });
  }

  user.favorites.unshift({ movieId, title, posterPath, backdropPath, voteAverage, releaseDate, mediaType });
  await user.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Added to favorites', data: { favorites: user.favorites } });
};

/**
 * DELETE /api/user/favorites/:movieId
 */
const removeFavorite = async (req, res) => {
  const movieId = Number(req.params.movieId);
  const user = await User.findById(req.user._id);

  user.favorites = user.favorites.filter((f) => f.movieId !== movieId);
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Removed from favorites', data: { favorites: user.favorites } });
};

/**
 * GET /api/user/favorites
 */
const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).select('favorites');
  res.json({ success: true, data: { favorites: user.favorites } });
};

/**
 * POST /api/user/history
 */
const addToHistory = async (req, res) => {
  const { movieId, title, posterPath, mediaType } = req.body;

  if (!movieId || !title) {
    return res.status(400).json({ success: false, message: 'movieId and title are required' });
  }

  const user = await User.findById(req.user._id);

  // Remove if already exists (re-add with fresh timestamp at front)
  user.history = user.history.filter((h) => h.movieId !== movieId);
  user.history.unshift({ movieId, title, posterPath, mediaType });

  // Keep only last 50 items
  if (user.history.length > 50) {
    user.history = user.history.slice(0, 50);
  }

  await user.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Added to history', data: { history: user.history } });
};

/**
 * GET /api/user/history
 */
const getHistory = async (req, res) => {
  const user = await User.findById(req.user._id).select('history');
  res.json({ success: true, data: { history: user.history } });
};

/**
 * DELETE /api/user/history
 */
const clearHistory = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { history: [] } });
  res.json({ success: true, message: 'Watch history cleared' });
};

module.exports = {
  getProfile,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
};
