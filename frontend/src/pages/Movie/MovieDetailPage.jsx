import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayIcon, StarIcon, ClockIcon, CalendarIcon, ArrowLeftIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearCurrentMovie } from '../../features/movies/moviesSlice';
import { openTrailerModal } from '../../features/ui/uiSlice';
import {
  getBackdropUrl, getPosterUrl, getTitle, getReleaseDate,
  formatDate, formatRating, formatRuntime, getRatingColor,
  getYear, POSTER_PLACEHOLDER, BACKDROP_PLACEHOLDER, truncate,
} from '../../utils/helpers';
import MovieRow from '../../components/MovieRow/MovieRow';
import { userService } from '../../services/user.service';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const MovieDetailPage = () => {
  const { mediaType, id } = useParams();
  const dispatch = useDispatch();
  const { data: movie, isLoading, error } = useSelector((state) => state.movies.current);
  const { user, isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchMovieDetails({ mediaType, id }));
    window.scrollTo(0, 0);
    return () => dispatch(clearCurrentMovie());
  }, [dispatch, mediaType, id]);

  useEffect(() => {
    if (movie && isAuthenticated && user) {
      setIsFav(user.favorites?.some((f) => f.movieId === movie.id));
      // Add to watch history
      userService.addToHistory({
        movieId: movie.id,
        title: getTitle(movie),
        posterPath: movie.poster_path,
        mediaType,
      }).catch(() => {});
    }
  }, [movie, isAuthenticated, user, mediaType]);

  const handlePlayTrailer = () => {
    if (!movie) return;
    dispatch(openTrailerModal({ videoKey: null, movieTitle: getTitle(movie), movieId: movie.id, mediaType }));
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Sign in to save favorites'); return; }
    try {
      if (isFav) {
        await userService.removeFavorite(movie.id);
        setIsFav(false);
        toast.success('Removed from favorites');
      } else {
        await userService.addFavorite({
          movieId: movie.id, title: getTitle(movie),
          posterPath: movie.poster_path, backdropPath: movie.backdrop_path,
          voteAverage: movie.vote_average, releaseDate: getReleaseDate(movie), mediaType,
        });
        setIsFav(true);
        toast.success('Added to favorites!');
      }
    } catch { toast.error('Something went wrong'); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-cinema-black)] pt-20">
        <div className="h-[50vh] skeleton opacity-40" />
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="skeleton rounded-xl aspect-[2/3]" />
          <div className="md:col-span-2 space-y-4">
            {[80, 50, 100, 100, 60].map((w, i) => (
              <div key={i} className={`skeleton h-5 rounded w-[${w}%]`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center bg-[var(--color-cinema-black)] pt-20 px-4">
        <div className="text-6xl">🎬</div>
        <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
        <p className="text-[var(--color-cinema-muted)]">{error || 'Could not load this title.'}</p>
        <Link to="/" className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  const title = getTitle(movie);
  const year = getYear(getReleaseDate(movie));
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);
  const backdropSrc = getBackdropUrl(movie.backdrop_path) || BACKDROP_PLACEHOLDER;
  const posterSrc = getPosterUrl(movie.poster_path) || POSTER_PLACEHOLDER;
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const similar = movie.similar?.results?.slice(0, 12) || movie.recommendations?.results?.slice(0, 12) || [];
  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-cinema-black)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={backdropSrc}
          alt={title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cinema-black)] via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-cinema-black)]/80 to-transparent" />

        {/* Back Button */}
        <Link
          to=".."
          onClick={(e) => { e.preventDefault(); window.history.back(); }}
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-white glass px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <img
              src={posterSrc}
              alt={title}
              className="w-full rounded-2xl shadow-2xl border border-[var(--color-cinema-border)]"
              onError={(e) => { e.target.src = POSTER_PLACEHOLDER; }}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 glass rounded-full text-xs font-medium text-[var(--color-cinema-text)] border border-[var(--color-cinema-border)]">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">{title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[var(--color-cinema-muted)]">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" style={{ color: ratingColor }} />
                <span className="font-bold text-white">{rating}</span>
                <span>({(movie.vote_count || 0).toLocaleString()} votes)</span>
              </div>
              {year && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              {mediaType === 'tv' && movie.number_of_seasons && (
                <span>{movie.number_of_seasons} Season{movie.number_of_seasons !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Overview */}
            <p className="text-[var(--color-cinema-text)] leading-relaxed mb-8 text-sm sm:text-base max-w-2xl">
              {movie.overview || 'No description available.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <motion.button
                onClick={handlePlayTrailer}
                className="flex items-center gap-2.5 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all text-sm shadow-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <PlayIcon className="w-5 h-5" />
                {trailer ? 'Watch Trailer' : 'Search Trailer'}
              </motion.button>

              <motion.button
                onClick={handleFavorite}
                className={`flex items-center gap-2.5 px-6 py-3 font-semibold rounded-full text-sm transition-all border ${
                  isFav
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'glass border-white/20 text-white hover:border-white/50'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isFav ? <CheckIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                {isFav ? 'In Favorites' : 'Add to Favorites'}
              </motion.button>
            </div>

            {/* Additional Info */}
            {(movie.production_companies?.length > 0 || movie.spoken_languages?.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {movie.original_language && (
                  <div>
                    <p className="text-xs text-[var(--color-cinema-muted)] uppercase tracking-widest mb-1">Language</p>
                    <p className="text-sm font-medium text-white capitalize">{movie.original_language}</p>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <p className="text-xs text-[var(--color-cinema-muted)] uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-medium text-white">{movie.status}</p>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-cinema-muted)] uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-sm font-medium text-white">${(movie.budget / 1000000).toFixed(0)}M</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {cast.map((person) => (
                <div key={person.id} className="shrink-0 w-24 sm:w-28 text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-2 bg-[var(--color-cinema-card)] border-2 border-[var(--color-cinema-border)]">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1a1a27&color=8888a8`
                      }
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{person.name}</p>
                  <p className="text-[10px] text-[var(--color-cinema-muted)] truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieRow
              title="More Like This"
              movies={similar}
              isLoading={false}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;
