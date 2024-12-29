import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import isAuthenticated from '../libs/auth';

function AuthGuard({ children }) {
  const [authStatus, setAuthStatus] = useState(null); // null = loading, false = unauthenticated, true = authenticated
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await isAuthenticated();
        setAuthStatus(res && res.status === 200); // Update state to true if authenticated
      } catch (error) {
        setAuthStatus(false); // Update state to false if an error occurs
      }
    };

    checkAuthentication();
  }, []);

  // Show loading spinner while verifying authentication
  
  console.log(authStatus,location)
  if (authStatus === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Redirect authenticated users away from the login page
  if (authStatus && location.pathname === '/login') {
    return <Navigate to="/" />;
  }

  // Redirect to login if unauthenticated
  if (!authStatus && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  // Render children if authenticated
  return children;
}

export default AuthGuard;
