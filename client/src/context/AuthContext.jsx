import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
        localStorage.setItem('imovies_user', JSON.stringify(currentUser));
      } catch (err) {
        // Token expired or invalid
        setUser(null);
        localStorage.removeItem('imovies_user');
        localStorage.removeItem('imovies_token');
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to log in. Please check your credentials.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setAuthError(null);
    try {
      const data = await authService.register({ name, email, password, confirmPassword });
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
