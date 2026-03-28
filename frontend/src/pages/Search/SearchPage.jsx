import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearchResults } from '../../features/movies/moviesSlice';
import useDebounce from '../../hooks/useDebounce';
import MovieCard from '../../components/MovieCard/MovieCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState([]);
  const debouncedQuery = useDebounce(query, 350);
  const dispatch = useDispatch();
  const { results, totalPages, isLoading } = useSelector((state) => state.movies.search);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setPage(1);
      setAllResults([]);
      setSearchParams({ q: debouncedQuery });
      dispatch(searchMovies({ query: debouncedQuery, page: 1 }));
    } else if (!debouncedQuery.trim()) {
      dispatch(clearSearchResults());
      setAllResults([]);
    }
  }, [debouncedQuery, dispatch, setSearchParams]);

  useEffect(() => {
    if (results.length > 0) {
      if (page === 1) {
        setAllResults(results);
      } else {
        setAllResults((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          return [...prev, ...results.filter((m) => !ids.has(m.id))];
        });
      }
    }
  }, [results, page]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(searchMovies({ query: debouncedQuery, page: nextPage }));
    }
  }, [page, totalPages, isLoading, debouncedQuery, dispatch]);

  const filteredResults = allResults.filter((m) =>
    m.media_type !== 'person' && (m.poster_path || m.backdrop_path)
  );

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-cinema-black)] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Search Input */}
        <div className="relative max-w-2xl mb-8">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-cinema-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows..."
            autoFocus
            className="w-full bg-[var(--color-cinema-card)] border border-[var(--color-cinema-border)] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-base"
          />
        </div>

        {/* Results */}
        {!debouncedQuery.trim() ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-3xl">🔍</div>
            <h2 className="text-xl font-bold text-white">Discover Amazing Content</h2>
            <p className="text-[var(--color-cinema-muted)] max-w-sm">Search for your favorite movies, TV series, or anything you'd like to watch.</p>
          </div>
        ) : (
          <>
            {filteredResults.length > 0 && !isLoading && (
              <p className="text-sm text-[var(--color-cinema-muted)] mb-6">
                Showing results for <span className="text-white font-semibold">"{debouncedQuery}"</span>
              </p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {isLoading && page === 1
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} size="sm" />)
                : filteredResults.map((movie) => (
                    <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} size="sm" />
                  ))
              }
            </div>

            {/* No Results */}
            {!isLoading && filteredResults.length === 0 && debouncedQuery.trim() && (
              <div className="flex flex-col items-center py-24 gap-4 text-center">
                <div className="text-5xl">😕</div>
                <h2 className="text-xl font-bold text-white">No Results Found</h2>
                <p className="text-[var(--color-cinema-muted)]">We couldn't find anything for "{debouncedQuery}". Try a different search.</p>
              </div>
            )}

            {/* Load More */}
            {filteredResults.length > 0 && page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-[var(--color-cinema-card)] border border-[var(--color-cinema-border)] text-white font-semibold rounded-full hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;
