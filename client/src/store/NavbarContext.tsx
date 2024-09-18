
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NavbarContextType {
    islanding: boolean;
    setIslanding: (islanding: boolean) => void;
}


const NavbarContext = createContext<NavbarContextType | undefined>(undefined);


export const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [islanding, setIslanding] = useState<boolean>(true);

    return (
        <NavbarContext.Provider value={{ islanding, setIslanding }}>
            {children}
        </NavbarContext.Provider>
    );
};


export const useNavbar = () => {
    const context = useContext(NavbarContext);
    if (context === undefined) {
        throw new Error('useNavbar must be used within a NavbarProvider');
    }
    return context;
};
