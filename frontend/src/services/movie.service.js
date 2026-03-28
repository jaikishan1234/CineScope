import api from './api';

export const movieService = {
  getTrending: (params) => api.get('/movies/trending', { params }),
  getPopular: (params) => api.get('/movies/popular', { params }),
  getPopularTV: (params) => api.get('/movies/popular-tv', { params }),
  getTopRated: (params) => api.get('/movies/top-rated', { params }),
  getNowPlaying: (params) => api.get('/movies/now-playing', { params }),
  getUpcoming: (params) => api.get('/movies/upcoming', { params }),
  getDetails: (mediaType, id) => api.get(`/movies/${mediaType}/${id}`),
  getVideos: (mediaType, id) => api.get(`/movies/${mediaType}/${id}/videos`),
  search: (query, page = 1) => api.get('/movies/search', { params: { query, page } }),
  getGenres: () => api.get('/movies/genres'),
  getByGenre: (genreId, page = 1) => api.get('/movies/by-genre', { params: { genreId, page } }),
};
