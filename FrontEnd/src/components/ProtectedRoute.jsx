import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import isAdmin from '../utils/isAdmin';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && requiredRole === 'Admin' && !isAdmin(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;