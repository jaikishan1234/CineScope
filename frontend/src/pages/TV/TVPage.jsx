import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import { fetchPopularTV, fetchTopRated } from '../../features/movies/moviesSlice';

const TVPage = () => {
  const dispatch = useDispatch();
  const { popularTV, topRated } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!popularTV.results.length) dispatch(fetchPopularTV());
    if (!topRated.results.length) dispatch(fetchTopRated());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Banner using popular TV shows */}
      <HeroBanner
        movies={popularTV.results}
        isLoading={popularTV.isLoading}
      />

      {/* TV Rows */}
      <div className="relative z-10 -mt-8 pb-12 space-y-8">
        <MovieRow
          title="Popular TV Shows"
          movies={popularTV.results}
          isLoading={popularTV.isLoading}
          badge="📺"
        />
        <MovieRow
          title="Top Rated Series"
          movies={topRated.results}
          isLoading={topRated.isLoading}
          badge="⭐"
        />
      </div>
    </motion.div>
  );
};

export default TVPage;
