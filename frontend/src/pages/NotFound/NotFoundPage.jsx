import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilmIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => (
  <div className="min-h-screen bg-[var(--color-cinema-black)] flex items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md"
    >
      <div className="w-24 h-24 rounded-full glass flex items-center justify-center mx-auto mb-8">
        <FilmIcon className="w-12 h-12 text-[var(--color-cinema-muted)]" />
      </div>
      <h1 className="text-8xl font-black text-gradient mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Scene Not Found</h2>
      <p className="text-[var(--color-cinema-muted)] mb-8">
        The page you're looking for doesn't exist or was removed. Let's get you back to the show.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-full transition-all shadow-[0_0_30px_var(--color-primary-glow)]"
      >
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
