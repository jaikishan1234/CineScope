import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
  fetchPopularTV,
} from '../../features/movies/moviesSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { trending, popular, topRated, nowPlaying, popularTV } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!trending.results.length) dispatch(fetchTrending());
    if (!popular.results.length) dispatch(fetchPopular());
    if (!topRated.results.length) dispatch(fetchTopRated());
    if (!nowPlaying.results.length) dispatch(fetchNowPlaying());
    if (!popularTV.results.length) dispatch(fetchPopularTV());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner */}
      <HeroBanner
        movies={trending.results}
        isLoading={trending.isLoading}
      />

      {/* Movie Rows */}
      <div className="relative z-10 -mt-8 pb-12 space-y-8">
        <MovieRow
          title="Trending Now"
          movies={trending.results}
          isLoading={trending.isLoading}
          badge="🔥"
        />
        <MovieRow
          title="Popular Movies"
          movies={popular.results}
          isLoading={popular.isLoading}
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
        <MovieRow
          title="Popular TV Shows"
          movies={popularTV.results}
          isLoading={popularTV.isLoading}
        />
      </div>
    </motion.div>
  );
};

export default HomePage;
