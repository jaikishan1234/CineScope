import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, FilmIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { clearError } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (!result.error) navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--color-cinema-black)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-radial from-red-950/20 via-transparent to-transparent" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(229,9,20,0.08) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="glass rounded-2xl p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
              <FilmIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">
              Cine<span className="text-[var(--color-primary)]">Scope</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h1>
          <p className="text-[var(--color-cinema-muted)] text-sm text-center mb-8">Sign in to continue your journey</p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[var(--color-cinema-muted)] mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[var(--color-cinema-dark)] border border-[var(--color-cinema-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-cinema-muted)] mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[var(--color-cinema-dark)] border border-[var(--color-cinema-border)] rounded-xl px-4 py-3 pr-12 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cinema-muted)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_30px_var(--color-primary-glow)]"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[var(--color-cinema-muted)] mt-7">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-primary)] font-semibold hover:text-red-400 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
