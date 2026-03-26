import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, Search, Map, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const navItems = [
        { label: '首頁',   path: '/',            icon: <Home size={18} /> },
        { label: '案件通報', path: '/smart-guide', icon: <FileText size={18} /> },
        { label: '進度查詢', path: '/status',      icon: <Search size={18} /> },
        { label: '案件地圖', path: '/map',          icon: <Map size={18} /> },
        { label: '教育資源', path: '/resources',    icon: <BookOpen size={18} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={`fixed z-50 transition-all duration-500 ease-in-out ${
                scrolled
                    ? 'top-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 py-2'
                    : 'top-0 left-0 right-0 rounded-none bg-white/70 backdrop-blur-md border-b border-slate-200/50 py-3'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 shrink-0 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                        <div className="grid grid-cols-2 gap-0.5 transform rotate-45 scale-90">
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#FFD700] rounded-tl-full"></div>
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#FF0000] rounded-tr-full"></div>
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#00FF00] rounded-bl-full"></div>
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#0000FF] rounded-br-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-slate-500">新北市政府</span>
                        <span className="font-black text-sm md:text-xl tracking-tighter text-slate-900 leading-none whitespace-nowrap">
                            動物保護防疫處
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav — lg and up */}
                <div className="hidden lg:flex items-center bg-slate-100/60 p-1.5 rounded-full border border-slate-200/50 gap-0.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`px-4 py-2 rounded-full text-sm font-bold tracking-tight flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
                                isActive(item.path)
                                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                            }`}
                        >
                            <span className={`transition-all duration-200 ${isActive(item.path) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right: Login + hamburger */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Login button — visible on lg+ */}
                    <Link
                        to="/login"
                        className="hidden lg:inline-flex items-center px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-black tracking-widest hover:bg-blue-700 shadow-md hover:shadow-blue-700/30 transition-all uppercase whitespace-nowrap"
                    >
                        Login
                    </Link>

                    {/* Hamburger — visible below lg */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        aria-label="選單"
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile / Tablet Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 mt-1 mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 duration-200">
                    <div className="p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive(item.path)
                                        ? 'bg-blue-50 text-blue-700 font-black'
                                        : 'text-slate-600 font-bold hover:bg-slate-50'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive(item.path) ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {item.icon}
                                </div>
                                <span className="text-base">{item.label}</span>
                            </Link>
                        ))}

                        <div className="pt-3 mt-3 border-t border-slate-100">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-950 text-white font-black text-sm tracking-widest hover:bg-blue-700 transition-all"
                            >
                                LOGIN
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
