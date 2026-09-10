import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verifying disaster credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl text-center space-y-4 border border-red-200 dark:border-red-900/50">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Access Restricted</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This area requires specific authorized responder privileges ({allowedRoles.join(', ')}). Your current role is <strong>{user?.role}</strong>.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
