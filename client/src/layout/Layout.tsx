// Layout.tsx
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from '@/components/Footer';

const Layout: React.FC<{ children: React.ReactNode; islanding?: boolean }> = ({ children, islanding }) => {
    return (
        <div>
            <Navbar islanding={islanding || false} />
            <main className="pt-16"> {/* Adjust padding-top based on Navbar height */}
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
