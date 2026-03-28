import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { HeartIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useAuth from '../../hooks/useAuth';
import { userService } from '../../services/user.service';
import { getPosterUrl, getTitle, getYear, POSTER_PLACEHOLDER } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'favorites';
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: HeartIcon },
    { id: 'history', label: 'Watch History', icon: ClockIcon },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [favRes, histRes] = await Promise.all([
          userService.getFavorites(),
          userService.getHistory(),
        ]);
        setFavorites(favRes.data.data.favorites || []);
        setHistory(histRes.data.data.history || []);
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    try {
      await userService.removeFavorite(movieId);
      setFavorites((f) => f.filter((m) => m.movieId !== movieId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleClearHistory = async () => {
    try {
      await userService.clearHistory();
      setHistory([]);
      toast.success('History cleared');
    } catch {
      toast.error('Failed to clear history');
    }
  };

  const FavoriteGrid = () => (
    favorites.length === 0 ? (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <HeartSolid className="w-16 h-16 text-[var(--color-cinema-border)]" />
        <h3 className="text-lg font-semibold text-white">No favorites yet</h3>
        <p className="text-[var(--color-cinema-muted)] text-sm">Browse movies and hit the ♥ to save them here</p>
        <Link to="/" className="mt-2 px-6 py-2.5 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all text-sm">
          Discover Movies
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favorites.map((movie) => (
          <motion.div key={movie.movieId} className="relative group" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <Link to={`/${movie.mediaType || 'movie'}/${movie.movieId}`}>
              <div className="rounded-xl overflow-hidden bg-[var(--color-cinema-card)]">
                <div className="aspect-[2/3] relative">
                  <img
                    src={movie.posterPath ? getPosterUrl(movie.posterPath) : POSTER_PLACEHOLDER}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-white truncate">{movie.title}</p>
                  <p className="text-[10px] text-[var(--color-cinema-muted)]">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}</p>
                </div>
              </div>
            </Link>
            <button
              onClick={() => handleRemoveFavorite(movie.movieId)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
            >
              <TrashIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </motion.div>
        ))}
      </div>
    )
  );

  const HistoryList = () => (
    history.length === 0 ? (
      <div className="flex flex-col items-center py-20 gap-4 text-center">
        <ClockIcon className="w-16 h-16 text-[var(--color-cinema-border)]" />
        <h3 className="text-lg font-semibold text-white">No watch history</h3>
        <p className="text-[var(--color-cinema-muted)] text-sm">Movies you view will appear here</p>
      </div>
    ) : (
      <div>
        <div className="flex justify-end mb-4">
          <button onClick={handleClearHistory} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Clear All History
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {history.map((item) => (
            <Link key={item.movieId} to={`/${item.mediaType || 'movie'}/${item.movieId}`}>
              <motion.div className="rounded-xl overflow-hidden bg-[var(--color-cinema-card)] group" whileHover={{ scale: 1.03 }}>
                <div className="aspect-[2/3] relative">
                  <img
                    src={item.posterPath ? getPosterUrl(item.posterPath) : POSTER_PLACEHOLDER}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-[10px]">Watched {new Date(item.watchedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    )
  );

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-cinema-black)] pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Profile Header */}
      <div className="border-b border-[var(--color-cinema-border)] bg-[var(--color-cinema-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-2xl font-black text-white">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-[var(--color-cinema-muted)] text-sm">{user?.email}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-[var(--color-cinema-muted)]">
                  <span className="text-white font-semibold">{favorites.length}</span> Favorites
                </span>
                <span className="text-xs text-[var(--color-cinema-muted)]">
                  <span className="text-white font-semibold">{history.length}</span> Watched
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSearchParams({ tab: id })}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-cinema-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[2/3] skeleton" />
                <div className="p-2 space-y-1">
                  <div className="skeleton h-3 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          activeTab === 'favorites' ? <FavoriteGrid /> : <HistoryList />
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
