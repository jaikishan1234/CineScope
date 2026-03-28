import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '../features/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error, isInitialized } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (data) => dispatch(registerUser(data));
  const logout = () => dispatch(logoutUser());

  const isAdmin = user?.role === 'admin';

  return { user, isAuthenticated, isLoading, error, isInitialized, isAdmin, login, register, logout };
};

export default useAuth;
