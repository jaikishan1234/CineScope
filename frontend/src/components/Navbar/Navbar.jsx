import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
  FilmIcon,
  Bars3Icon,
  XMarkIcon,
  TvIcon,
} from '@heroicons/react/24/outline';
import { StarIcon, FilmIcon as FilmSolid } from '@heroicons/react/24/solid';
import useAuth from '../../hooks/useAuth';
import { movieService } from '../../services/movie.service';
import { getPosterUrl, getTitle } from '../../utils/helpers';

/* ── helper: highlight matched text ─────────────────────────────── */
const HighlightMatch = ({ text, query }) => {
  if (!query || !text) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: 3 }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  /* ── scroll detection ──────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── close menus on route change ────────────────────────────────── */
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    closeSearch();
  }, [location.pathname]);

  /* ── focus input when search expands ───────────────────────────── */
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  /* ── outside click to close dropdown ───────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── debounced live search ──────────────────────────────────────── */
  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    setShowDropdown(true);
    try {
      const res = await movieService.search(query, 1);
      const results = (res.data?.data?.results || []).slice(0, 7);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setActiveIndex(-1);
    clearTimeout(debounceTimer.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  /* ── keyboard navigation ────────────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearchSubmit(e);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigateToSuggestion(suggestions[activeIndex]);
      } else {
        handleSearchSubmit(e);
      }
    }
  };

  const navigateToSuggestion = (item) => {
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    navigate(`/${mediaType}/${item.id}`);
    closeSearch();
  };

  const handleSearchSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setShowDropdown(false);
    setSuggestions([]);
    setSearchQuery('');
    setActiveIndex(-1);
    clearTimeout(debounceTimer.current);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Movies', to: '/movies' },
    { label: 'TV Shows', to: '/tv' },
    { label: 'Trending', to: '/trending' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <FilmIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Cine<span className="text-[var(--color-primary)]">Scope</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-white bg-white/10'
                    : 'text-[var(--color-cinema-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search Container */}
            <div ref={containerRef} className="relative flex items-center">
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-visible"
                    style={{ position: 'relative' }}
                  >
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-cinema-muted)]" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleQueryChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search movies, shows..."
                        className="w-full bg-[var(--color-cinema-card)] border border-[var(--color-cinema-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        autoComplete="off"
                      />
                    </div>

                    {/* Dropdown Suggestions */}
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-full mt-2 w-full rounded-xl shadow-2xl overflow-hidden"
                          style={{
                            background: 'rgba(17, 17, 24, 0.97)',
                            border: '1px solid rgba(42,42,61,0.8)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 9999,
                            minWidth: 280,
                          }}
                        >
                          {searchLoading ? (
                            <div className="flex items-center gap-3 px-4 py-3">
                              <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-[var(--color-cinema-muted)]">Searching...</span>
                            </div>
                          ) : suggestions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-[var(--color-cinema-muted)] text-center">
                              No results found for &ldquo;{searchQuery}&rdquo;
                            </div>
                          ) : (
                            <>
                              {suggestions.map((item, index) => {
                                const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                                const itemTitle = getTitle(item);
                                const poster = getPosterUrl(item.poster_path);
                                const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);
                                const isActive = index === activeIndex;

                                return (
                                  <button
                                    key={`${item.id}-${mediaType}`}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                                    style={{
                                      background: isActive ? 'rgba(229,9,20,0.12)' : 'transparent',
                                      borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(-1)}
                                    onClick={() => navigateToSuggestion(item)}
                                  >
                                    {/* Poster thumbnail */}
                                    <div
                                      className="w-9 h-12 rounded-md shrink-0 overflow-hidden"
                                      style={{ background: 'var(--color-cinema-card)' }}
                                    >
                                      {poster ? (
                                        <img
                                          src={poster}
                                          alt={itemTitle}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <FilmSolid className="w-4 h-4 text-[var(--color-cinema-muted)]" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        <HighlightMatch text={itemTitle} query={searchQuery} />
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span
                                          className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                                          style={{
                                            background: mediaType === 'tv' ? 'rgba(59,130,246,0.2)' : 'rgba(229,9,20,0.2)',
                                            color: mediaType === 'tv' ? '#60a5fa' : 'var(--color-primary)',
                                          }}
                                        >
                                          {mediaType === 'tv' ? 'TV' : 'Movie'}
                                        </span>
                                        {year && (
                                          <span className="text-[11px] text-[var(--color-cinema-muted)]">
                                            {year}
                                          </span>
                                        )}
                                        {item.vote_average > 0 && (
                                          <span className="flex items-center gap-0.5 text-[11px] text-yellow-400">
                                            <StarIcon className="w-2.5 h-2.5" />
                                            {parseFloat(item.vote_average).toFixed(1)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}

                              {/* View all results */}
                              <button
                                className="w-full px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] hover:bg-white/5 transition-all border-t border-[var(--color-cinema-border)] flex items-center gap-2 justify-center"
                                onClick={handleSearchSubmit}
                              >
                                <MagnifyingGlassIcon className="w-4 h-4" />
                                View all results for &ldquo;{searchQuery}&rdquo;
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                onClick={() => {
                  if (searchOpen) {
                    closeSearch();
                  } else {
                    setSearchOpen(true);
                  }
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-cinema-muted)] hover:text-white hover:bg-white/10 transition-all"
                aria-label="Search"
              >
                {searchOpen
                  ? <XMarkIcon className="w-5 h-5" />
                  : <MagnifyingGlassIcon className="w-5 h-5" />
                }
              </button>
            </div>

            {/* Authenticated Controls */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-[var(--color-cinema-muted)] hover:text-yellow-400 hover:bg-white/10 transition-all"
                  aria-label="My Favorites"
                >
                  <StarIcon className="w-5 h-5" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDownIcon className={`w-3 h-3 text-[var(--color-cinema-muted)] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-[var(--color-cinema-border)]">
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-[var(--color-cinema-muted)] truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" className="block px-4 py-2.5 text-sm text-[var(--color-cinema-text)] hover:bg-white/5 hover:text-white transition-all">
                            My Profile
                          </Link>
                          <Link to="/profile?tab=favorites" className="block px-4 py-2.5 text-sm text-[var(--color-cinema-text)] hover:bg-white/5 hover:text-white transition-all">
                            Favorites
                          </Link>
                          <Link to="/profile?tab=history" className="block px-4 py-2.5 text-sm text-[var(--color-cinema-text)] hover:bg-white/5 hover:text-white transition-all">
                            Watch History
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" className="block px-4 py-2.5 text-sm text-[var(--color-primary)] hover:bg-white/5 transition-all">
                              Admin Dashboard
                            </Link>
                          )}
                          <hr className="my-1 border-[var(--color-cinema-border)]" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block px-4 py-1.5 text-sm font-medium text-[var(--color-cinema-text)] hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_var(--color-primary-glow)]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-cinema-muted)] hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden glass border-t border-[var(--color-cinema-border)]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--color-cinema-text)] hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
