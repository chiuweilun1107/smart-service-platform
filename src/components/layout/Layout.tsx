import React, { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-grow pt-28">
                {children}
            </main>
            <Footer />
        </div>
    );
};
