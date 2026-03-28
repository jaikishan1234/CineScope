import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailerModal } from '../../features/ui/uiSlice';
import { movieService } from '../../services/movie.service';

const TrailerModal = () => {
  const dispatch = useDispatch();
  const { isOpen, videoKey, movieTitle, movieId, mediaType } = useSelector((state) => state.ui.trailerModal);
  const [resolvedKey, setResolvedKey] = useState(videoKey);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);

  // Fetch trailer key from API when a movieId is available but no key
  useEffect(() => {
    if (!isOpen) {
      setResolvedKey(null);
      setError(null);
      return;
    }

    if (videoKey) {
      setResolvedKey(videoKey);
      return;
    }

    if (movieId && mediaType) {
      setIsLoading(true);
      movieService.getVideos(mediaType, movieId)
        .then((res) => {
          const videos = res.data?.data?.results || [];
          const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
            || videos.find((v) => v.site === 'YouTube');
          if (trailer) {
            setResolvedKey(trailer.key);
          } else {
            setError('No trailer available for this title.');
          }
        })
        .catch(() => setError('Failed to load trailer.'))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, videoKey, movieId, mediaType]);

  // Trap focus and close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') dispatch(closeTrailerModal());
    };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, dispatch]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) dispatch(closeTrailerModal());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative w-full max-w-4xl bg-[var(--color-cinema-dark)] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-cinema-border)]">
              <div>
                <span className="text-xs text-[var(--color-cinema-muted)] uppercase tracking-widest font-medium">Now Playing</span>
                <h2 className="text-white font-bold text-lg leading-tight truncate max-w-sm">{movieTitle}</h2>
              </div>
              <button
                onClick={() => dispatch(closeTrailerModal())}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 text-[var(--color-cinema-muted)] transition-all"
                aria-label="Close trailer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Video Area */}
            <div className="aspect-video bg-black relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {error && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-8">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-2xl mb-2">🎬</div>
                  <p className="text-white font-semibold">Trailer Not Available</p>
                  <p className="text-[var(--color-cinema-muted)] text-sm">{error}</p>
                  <button
                    onClick={() => dispatch(closeTrailerModal())}
                    className="mt-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-primary-hover)] transition-all"
                  >
                    Close
                  </button>
                </div>
              )}

              {resolvedKey && !isLoading && (
                <iframe
                  src={`https://www.youtube.com/embed/${resolvedKey}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${movieTitle} Trailer`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailerModal;
