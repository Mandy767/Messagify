
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation(); // Get the current path

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-blue-500" size={24} />
                <span className="ml-2 text-gray-700">Loading...</span>
            </div>
        );
    }

    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
