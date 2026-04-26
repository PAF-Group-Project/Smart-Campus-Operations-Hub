import React, { createContext, useContext, useState } from 'react';

const ResourceAuthContext = createContext(null);

// Real credentials for the resources module
const CREDENTIALS = [
  { email: 'admin@smartcampus.com', password: 'Admin123!', name: 'Admin User', role: 'ADMIN' },
  { email: 'user@smartcampus.com',  password: 'User123!',  name: 'Regular User', role: 'USER'  },
];

export const ResourceAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('resource_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const found = CREDENTIALS.find(c => c.email === email && c.password === password);
    if (found) {
      const userData = { email: found.email, name: found.name, role: found.role };
      setUser(userData);
      localStorage.setItem('resource_user', JSON.stringify(userData));
      return { success: true, role: found.role };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resource_user');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isLoggedIn = () => !!user;

  return (
    <ResourceAuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </ResourceAuthContext.Provider>
  );
};

export const useResourceAuth = () => {
  const ctx = useContext(ResourceAuthContext);
  // Return safe defaults if context not available
  if (!ctx) return { user: null, login: () => ({ success: false }), logout: () => {}, isAdmin: () => false, isLoggedIn: () => false };
  return ctx;
};
