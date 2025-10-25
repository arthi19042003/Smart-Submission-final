import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If no user is logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If a user is logged in, show the component they were trying to access
  return children;
};

export default ProtectedRoute;