import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, FilmIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import { clearError } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, isLoading, error, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (!result.error) navigate('/');
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-[var(--color-cinema-black)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(229,9,20,0.08) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
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

          <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>
          <p className="text-[var(--color-cinema-muted)] text-sm text-center mb-8">Start discovering your next favorite film</p>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400"
            >
              {displayError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-[var(--color-cinema-muted)] mb-2 uppercase tracking-widest">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-[var(--color-cinema-dark)] border border-[var(--color-cinema-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-[var(--color-cinema-muted)] mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full bg-[var(--color-cinema-dark)] border border-[var(--color-cinema-border)] rounded-xl px-4 py-3 pr-12 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cinema-muted)] hover:text-white">
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-cinema-muted)] mb-2 uppercase tracking-widest">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[var(--color-cinema-dark)] border border-[var(--color-cinema-border)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-cinema-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all text-sm mt-2 disabled:opacity-60 shadow-[0_0_30px_var(--color-primary-glow)]"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[var(--color-cinema-muted)] mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:text-red-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
