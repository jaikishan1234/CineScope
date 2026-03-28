import api from './api';

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),

  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (movie) => api.post('/user/favorites', movie),
  removeFavorite: (movieId) => api.delete(`/user/favorites/${movieId}`),

  getHistory: () => api.get('/user/history'),
  addToHistory: (movie) => api.post('/user/history', movie),
  clearHistory: () => api.delete('/user/history'),
};
