import { Link } from 'react-router-dom';
import { FilmIcon } from '@heroicons/react/24/outline';

const Footer = () => (
  <footer className="border-t border-[var(--color-cinema-border)] bg-[var(--color-cinema-dark)] mt-16">
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FilmIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white">
            Cine<span className="text-[var(--color-primary)]">Scope</span>
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[var(--color-cinema-muted)]">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/tv" className="hover:text-white transition-colors">TV Shows</Link>
          <Link to="/search" className="hover:text-white transition-colors">Search</Link>
        </div>
        <div className="text-xs text-[var(--color-cinema-muted)]">
          <p>Movie data by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:text-red-400">TMDB</a></p>
          <p className="mt-1">© {new Date().getFullYear()} CineScope. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
