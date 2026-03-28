import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import store from './store/store';
import AppRouter from './router/AppRouter';
import { fetchCurrentUser } from './features/auth/authSlice';

const AppInitializer = ({ children }) => {
  useEffect(() => {
    // Check if user is already logged in on app mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      store.dispatch(fetchCurrentUser());
    } else {
      // Mark as initialized even if no token
      store.dispatch({ type: 'auth/fetchMe/rejected', payload: null });
    }
  }, []);

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <AnimatePresence mode="wait">
            <AppRouter />
          </AnimatePresence>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a27',
                color: '#e8e8f0',
                border: '1px solid #2a2a3d',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#1a1a27' },
              },
              error: {
                iconTheme: { primary: '#e50914', secondary: '#1a1a27' },
              },
            }}
          />
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
