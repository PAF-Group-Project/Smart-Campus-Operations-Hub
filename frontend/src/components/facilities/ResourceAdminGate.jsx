import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A simple wrapper that checks for ADMIN role using the integrated AuthContext.
 * Note: Route-level protection is preferred using RoleGuard in App.jsx.
 */
export const ResourceAdminGate = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
