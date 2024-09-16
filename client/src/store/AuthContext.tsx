import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useHttpRequest } from "../hooks/httpClient";
import dispatchMessage from "../hooks/messageHandler"; // Adjust the import based on your project structure

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
    user: any;
    setUser: (user: any) => void;
    type: string;
    setType: (type: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null); // Define the type if available
    const [type, setType] = useState("user"); // Define the type if applicable
    const sendRequest = useHttpRequest();


    const login = () => setIsAuthenticated(true);
    const logout = async () => {
        try {

            await sendRequest("/api/user/logout", {
                method: "POST",
            });

            // Clear local storage and update state
            localStorage.clear();
            setIsAuthenticated(false);
            setUser(null);
            dispatchMessage("success", "Logout successful");
            setType("user"); // Adjust as necessary
        } catch (err) {
            console.error("Logout failed", err);
            dispatchMessage("error", "Logout failed");
        }
    };

    const fetchMe = useCallback(async () => {
        setIsLoading(true);
        try {
            let res = await sendRequest("/api/user/me");
            if (res.data) {
                login();
                setUser(res.data.user);

            } else {
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.log(err);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [sendRequest]);

    useEffect(() => {
        fetchMe();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, user, setUser, type, setType }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
