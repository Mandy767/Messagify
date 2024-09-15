import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { Loader } from "lucide-react";

const ProtectedRoute = ({ children }: any) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Center the loader on the screen
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-blue-500" size={24} /> {/* Adjust the size and color as needed */}
                <span className="ml-2 text-gray-700">Loading...</span> {/* Optional text next to the loader */}
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
