import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await api.get('/auth/me');
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const loginWithPassword = async ({ email, password }) => {
    const userData = await api.post('/auth/login', { email, password });
    setUser(userData);
    return userData;
  };

  const registerWithPassword = async ({ name, email, password }) => {
    const userData = await api.post('/auth/register', { name, email, password });
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    setUser(null);
    window.location.href = 'http://localhost:8080/api/v1/auth/logout';
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginGoogle: login,
        loginWithPassword,
        registerWithPassword,
        logout,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
