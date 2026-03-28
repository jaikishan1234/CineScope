import { useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';
import SkeletonCard from '../SkeletonCard/SkeletonCard';

const MovieRow = ({ title, movies = [], isLoading = false, badge }) => {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const el = rowRef.current;
    if (!el) return;
    const scrollAmount = 600;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <motion.section
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          {badge && (
            <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-md">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Scroll Container */}
      <div
        className="relative"
        onMouseEnter={(e) => {
          const leftArrow = e.currentTarget.querySelector('[data-arrow="left"]');
          const rightArrow = e.currentTarget.querySelector('[data-arrow="right"]');
          if (leftArrow) leftArrow.style.opacity = '1';
          if (rightArrow) rightArrow.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const leftArrow = e.currentTarget.querySelector('[data-arrow="left"]');
          const rightArrow = e.currentTarget.querySelector('[data-arrow="right"]');
          if (leftArrow) leftArrow.style.opacity = '0';
          if (rightArrow) rightArrow.style.opacity = '0';
        }}
      >
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            data-arrow="left"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full bg-gradient-to-r from-[var(--color-cinema-black)] to-transparent flex items-center justify-start pl-2 transition-opacity"
            style={{ opacity: 0 }}
          >
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            data-arrow="right"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-full bg-gradient-to-l from-[var(--color-cinema-black)] to-transparent flex items-center justify-end pr-2 transition-opacity"
            style={{ opacity: 0 }}
          >
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all">
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </div>
          </button>
        )}

        {/* Movie Cards */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => (
                <MovieCard key={`${movie.id}-${movie.media_type || 'movie'}`} movie={movie} size="md" />
              ))
          }
        </div>
      </div>
    </motion.section>
  );
};

export default MovieRow;
