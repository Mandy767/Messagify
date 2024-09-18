import React, { createContext, useState, useContext, ReactNode } from 'react';



//@ts-ignore
const IsOnlineContext = createContext()

export const IsOnlineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isonline, setIsonline] = useState<boolean>(false);

    return (
        <IsOnlineContext.Provider value={{ isonline, setIsonline }}>
            {children}
        </IsOnlineContext.Provider>
    );
};


export const useIsOnline = () => {
    const context = useContext(IsOnlineContext);
    if (context === undefined) {
        throw new Error('useIsOnline must be used within a NavbarProvider');
    }
    return context;
};