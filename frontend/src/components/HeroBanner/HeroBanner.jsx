import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, InformationCircleIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { openTrailerModal } from '../../features/ui/uiSlice';
import {
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
  getRatingColor,
  truncate,
  BACKDROP_PLACEHOLDER,
} from '../../utils/helpers';

const HeroBanner = ({ movies = [], isLoading = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useDispatch();

  const featured = movies.slice(0, 5);
  const movie = featured[activeIndex];

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % featured.length);
      setImageLoaded(false);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const handlePlayTrailer = () => {
    if (!movie) return;
    const mediaType = movie.media_type || 'movie';
    dispatch(openTrailerModal({ videoKey: null, movieTitle: getTitle(movie), movieId: movie.id, mediaType }));
  };

  if (isLoading) {
    return (
      <div className="relative h-[70vh] sm:h-[80vh] bg-[var(--color-cinema-dark)]">
        <div className="absolute inset-0 skeleton opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <div className="skeleton h-8 w-64 rounded-lg mb-4" />
          <div className="skeleton h-4 w-full max-w-lg rounded mb-2" />
          <div className="skeleton h-4 w-80 rounded" />
          <div className="flex gap-3 mt-6">
            <div className="skeleton h-11 w-32 rounded-full" />
            <div className="skeleton h-11 w-36 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const mediaType = movie.media_type || 'movie';
  const title = getTitle(movie);
  const year = getYear(getReleaseDate(movie));
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);
  const backdropSrc = getBackdropUrl(movie.backdrop_path) || BACKDROP_PLACEHOLDER;

  return (
    <div className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
      {/* Backdrop Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={backdropSrc}
            alt={title}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-40 hero-bottom-gradient" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Badges */}
          <div className="flex items-center gap-3 mb-3">
            {mediaType === 'tv' && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">TV Series</span>
            )}
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4" style={{ color: ratingColor }} />
              <span className="text-sm font-bold" style={{ color: ratingColor }}>{rating}</span>
            </div>
            <span className="text-sm text-[var(--color-cinema-muted)]">{year}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-sm sm:text-base text-[var(--color-cinema-muted)] leading-relaxed mb-6 max-w-xl">
            {truncate(movie.overview, 200)}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              onClick={handlePlayTrailer}
              className="flex items-center gap-2.5 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <PlayIcon className="w-5 h-5" />
              Watch Trailer
            </motion.button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={`/${mediaType}/${movie.id}`}
                className="flex items-center gap-2.5 px-6 py-3 glass border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all text-sm"
              >
                <InformationCircleIcon className="w-5 h-5" />
                More Info
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 lg:right-16 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); setImageLoaded(false); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-[var(--color-primary)]'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
