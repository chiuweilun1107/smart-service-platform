import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, Search, Map, BookOpen, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lang, setLang] = useState('TW');
    const [fontSize, setFontSize] = useState<'standard' | 'large'>('standard');
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply font size class to body
    useEffect(() => {
        if (fontSize === 'large') {
            document.documentElement.classList.add('text-lg');
        } else {
            document.documentElement.classList.remove('text-lg');
        }
    }, [fontSize]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = [
        { label: '首頁', path: '/', icon: <Home size={18} /> },
        { label: '案件通報', path: '/smart-guide', icon: <FileText size={18} /> },
        { label: '進度查詢', path: '/status', icon: <Search size={18} /> },
        { label: '案件地圖', path: '/map', icon: <Map size={18} /> },
        { label: '教育資源', path: '/resources', icon: <BookOpen size={18} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'top-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 py-3'
                : 'top-0 left-0 right-0 rounded-none bg-white/70 backdrop-blur-md border-b border-slate-200/50 py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

                {/* 1. Official Identity Block (CSS-based official logo) */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-4 group">
                        {/* CSS Icon Wrapper */}
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            {/* Four-leaf Heart Icon Recreation using CSS */}
                            <div className="grid grid-cols-2 gap-0.5 transform rotate-45 scale-90">
                                <div className="w-5 h-5 bg-[#FFD700] rounded-tl-full"></div>
                                <div className="w-5 h-5 bg-[#FF0000] rounded-tr-full"></div>
                                <div className="w-5 h-5 bg-[#00FF00] rounded-bl-full"></div>
                                <div className="w-5 h-5 bg-[#0000FF] rounded-br-full"></div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col">
                            <span className="text-[9px] md:text-xs font-bold tracking-[0.05em] text-slate-600 uppercase">新北市政府</span>
                            <span className="font-black text-base md:text-2xl tracking-tighter text-slate-900 leading-none">
                                動物保護防疫處
                            </span>
                            <span className="hidden md:block text-[8px] font-medium text-slate-400 uppercase tracking-tighter">
                                New Taipei City Government Animal Protection and Health Inspection Office
                            </span>
                        </div>
                    </Link>
                </div>

                {/* 2. Desktop Navigation */}
                <div className="hidden lg:flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`px-5 py-2 rounded-full text-sm font-bold tracking-tight flex items-center gap-2 transition-all duration-300 ${isActive(item.path)
                                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                                }`}
                        >
                            {/* Icon only shows on hover or active to keep it clean */}
                            <span className={`${isActive(item.path) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto'} transition-all duration-300`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* 3. Utility Block (A11y + Admin) */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Font Size Toggle */}
                    <div className="flex items-center bg-slate-100/80 rounded-lg p-1 border border-slate-200/50 backdrop-blur-sm">
                        <button
                            onClick={() => setFontSize('standard')}
                            className={`px-2 py-1 rounded-md transition-all text-sm font-medium ${fontSize === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <span className="text-xs">T</span>
                        </button>
                        <div className="w-px h-3 bg-slate-300 mx-1"></div>
                        <button
                            onClick={() => setFontSize('large')}
                            className={`px-2 py-1 rounded-md transition-all text-sm font-medium ${fontSize === 'large' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <span className="text-lg">T</span>
                        </button>
                    </div>

                    {/* Language Toggle */}
                    <button
                        onClick={() => setLang(lang === 'TW' ? 'EN' : 'TW')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Globe size={16} />
                        {lang}
                    </button>

                    <div className="w-px h-8 bg-slate-200 mx-1"></div>

                    <Link
                        to="/login"
                        className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-[11px] font-black tracking-[0.15em] hover:bg-blue-700 shadow-lg shadow-black/10 hover:shadow-blue-700/30 transition-all duration-300 transform hover:-translate-y-0.5 uppercase"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="p-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Animate in) */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 glass-panel rounded-b-3xl p-6 mx-0 md:hidden flex flex-col gap-2 shadow-2xl border-t border-slate-100 animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
                    {/* Mobile Utility Row */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                        <div className="flex gap-2">
                            <button className="p-2 bg-slate-100 rounded-lg"><Globe size={16} /></button>
                        </div>
                        <Link to="/admin/login" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">
                            管理員登入
                        </Link>
                    </div>

                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-700 font-black'
                                : 'text-slate-600 font-bold hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive(item.path) ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                {item.icon}
                            </div>
                            <span className="text-lg">{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};
