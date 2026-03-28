import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import { fetchTrending, fetchPopular, fetchPopularTV } from '../../features/movies/moviesSlice';

const TrendingPage = () => {
  const dispatch = useDispatch();
  const { trending, popular, popularTV } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!trending.results.length) dispatch(fetchTrending());
    if (!popular.results.length) dispatch(fetchPopular());
    if (!popularTV.results.length) dispatch(fetchPopularTV());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner using trending items */}
      <HeroBanner
        movies={trending.results}
        isLoading={trending.isLoading}
      />

      {/* Trending Rows */}
      <div className="relative z-10 -mt-8 pb-12 space-y-8">
        <MovieRow
          title="Trending Now"
          movies={trending.results}
          isLoading={trending.isLoading}
          badge="🔥"
        />
        <MovieRow
          title="Trending Movies"
          movies={popular.results}
          isLoading={popular.isLoading}
          badge="🎬"
        />
        <MovieRow
          title="Trending TV"
          movies={popularTV.results}
          isLoading={popularTV.isLoading}
          badge="📺"
        />
      </div>
    </motion.div>
  );
};

export default TrendingPage;
