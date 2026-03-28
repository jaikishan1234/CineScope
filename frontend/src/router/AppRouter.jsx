import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import AdminRoute from '../components/AdminRoute/AdminRoute';

// Lazy-loaded pages
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const MoviesPage = lazy(() => import('../pages/Movies/MoviesPage'));
const TVPage = lazy(() => import('../pages/TV/TVPage'));
const TrendingPage = lazy(() => import('../pages/Trending/TrendingPage'));
const MovieDetailPage = lazy(() => import('../pages/Movie/MovieDetailPage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/Auth/SignupPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-cinema-black)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--color-cinema-muted)]">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/:mediaType/:id" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>

        {/* Auth Layout Routes (no main nav/footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
