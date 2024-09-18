// Layout.tsx
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from '@/components/Footer';

const Layout: React.FC<{ children: React.ReactNode; islanding?: boolean }> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
