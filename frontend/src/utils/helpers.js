/**
 * TMDB image URL builder
 */
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path) => getImageUrl(path, 'original');
export const getPosterUrl = (path) => getImageUrl(path, 'w500');
export const getThumbnailUrl = (path) => getImageUrl(path, 'w300');

/**
 * Format rating to one decimal
 */
export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return parseFloat(rating).toFixed(1);
};

/**
 * Format large numbers with K/M suffix
 */
export const formatCount = (count) => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

/**
 * Format release date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format runtime to hours and minutes
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

/**
 * Get year from date string
 */
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

/**
 * Get the rating color based on score
 */
export const getRatingColor = (rating) => {
  if (!rating) return '#888';
  if (rating >= 7.5) return '#22c55e'; // green
  if (rating >= 6.0) return '#f5c518'; // yellow
  return '#ef4444'; // red
};

/**
 * Get title from movie or TV show object
 */
export const getTitle = (item) => item?.title || item?.name || 'Unknown';

/**
 * Get release date from movie or TV show object
 */
export const getReleaseDate = (item) => item?.release_date || item?.first_air_date || null;

/**
 * Truncate text to a given character limit
 */
export const truncate = (text, limit = 150) => {
  if (!text) return 'No description available.';
  if (text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + '…';
};

/**
 * Placeholder fallback for missing posters
 */
export const POSTER_PLACEHOLDER = 'https://via.placeholder.com/500x750/1a1a27/8888a8?text=No+Image';
export const BACKDROP_PLACEHOLDER = 'https://via.placeholder.com/1280x720/111118/2a2a3d?text=No+Backdrop';
