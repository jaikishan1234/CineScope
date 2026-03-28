import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, StarIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { openTrailerModal } from '../../features/ui/uiSlice';
import {
  getPosterUrl,
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
  getRatingColor,
  POSTER_PLACEHOLDER,
} from '../../utils/helpers';
import { userService } from '../../services/user.service';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const MovieCard = ({ movie, showDetails = true, size = 'md' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const [isFav, setIsFav] = useState(() =>
    user?.favorites?.some((f) => f.movieId === movie?.id)
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!movie) return null;

  const title = getTitle(movie);
  const year = getYear(getReleaseDate(movie));
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);
  const posterSrc = imageError ? POSTER_PLACEHOLDER : (getPosterUrl(movie.poster_path) || POSTER_PLACEHOLDER);
  const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');

  const handleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Sign in to save favorites');
      return;
    }
    try {
      if (isFav) {
        await userService.removeFavorite(movie.id);
        setIsFav(false);
        toast.success('Removed from favorites');
      } else {
        await userService.addFavorite({
          movieId: movie.id,
          title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          voteAverage: movie.vote_average,
          releaseDate: getReleaseDate(movie),
          mediaType,
        });
        setIsFav(true);
        toast.success('Added to favorites!');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(openTrailerModal({ videoKey: null, movieTitle: title, movieId: movie.id, mediaType }));
  };

  const sizeClasses = {
    sm: 'w-36 sm:w-40',
    md: 'w-40 sm:w-48',
    lg: 'w-48 sm:w-56',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} shrink-0 cursor-pointer`}
      animate={{
        scale: isHovered ? 1.06 : 1,
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <Link to={`/${mediaType}/${movie.id}`}>
        <div
          className="relative rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: 'var(--color-cinema-card)',
            boxShadow: isHovered
              ? '0 8px 32px rgba(229, 9, 20, 0.35), 0 4px 16px rgba(0,0,0,0.6)'
              : '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Poster Image */}
          <div className="aspect-[2/3] relative overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={posterSrc}
              alt={title}
              className="w-full h-full object-cover"
              style={{
                opacity: imageLoaded ? 1 : 0,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(true); }}
              loading="lazy"
            />

            {/* Hover Overlay Gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* Hover Buttons */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-4 gap-2"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              <button
                onClick={handlePlayTrailer}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-black text-xs font-bold hover:bg-gray-200 transition-all"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
              >
                <PlayIcon className="w-3 h-3" />
                Trailer
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isFav
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'bg-black/40 border-white/30 text-white hover:bg-white/20'
                }`}
              >
                {isFav ? <CheckIcon className="w-3 h-3" /> : <PlusIcon className="w-3 h-3" />}
                {isFav ? 'Saved' : 'Favorite'}
              </button>
            </div>

            {/* Rating Badge — shown on hover */}
            <div
              className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1"
              style={{
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <StarIcon className="w-3 h-3" style={{ color: ratingColor }} />
              <span className="text-xs font-bold text-white">{rating}</span>
            </div>

            {/* Media Type Badge */}
            {mediaType === 'tv' && (
              <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                TV
              </div>
            )}
          </div>

          {/* Card Footer */}
          {showDetails && (
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-white truncate">{title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[var(--color-cinema-muted)]">{year}</span>
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-2.5 h-2.5" style={{ color: ratingColor }} />
                  <span className="text-[10px] font-medium" style={{ color: ratingColor }}>{rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
