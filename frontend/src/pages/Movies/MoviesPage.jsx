import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import {
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
} from '../../features/movies/moviesSlice';

const MoviesPage = () => {
  const dispatch = useDispatch();
  const { popular, topRated, nowPlaying } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!popular.results.length) dispatch(fetchPopular());
    if (!topRated.results.length) dispatch(fetchTopRated());
    if (!nowPlaying.results.length) dispatch(fetchNowPlaying());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner using popular movies */}
      <HeroBanner
        movies={popular.results}
        isLoading={popular.isLoading}
      />

      {/* Movie Rows */}
      <div className="relative z-10 -mt-8 pb-12 space-y-8">
        <MovieRow
          title="Popular Movies"
          movies={popular.results}
          isLoading={popular.isLoading}
          badge="🔥"
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying.results}
          isLoading={nowPlaying.isLoading}
          badge="In Theaters"
        />
        <MovieRow
          title="Top Rated"
          movies={topRated.results}
          isLoading={topRated.isLoading}
          badge="⭐"
        />
      </div>
    </motion.div>
  );
};

export default MoviesPage;
