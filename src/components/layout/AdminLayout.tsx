import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Shield, Users, Zap, BarChart3, FileCheck, Lock, GitBranch, ChevronDown, Map } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { AIAssistantWidget } from '../ai-assistant/AIAssistantWidget';

interface AdminLayoutProps {
    children?: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['cases']));
    const [detailedCaseMenu, setDetailedCaseMenu] = useState<Record<string, any>>({});

    useEffect(() => {
        // Simple mock auth guard
        if (!localStorage.getItem('auth_token')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Load detailed case menu
        loadDetailedCaseMenu();
    }, []);

    const loadDetailedCaseMenu = async () => {
        try {
            const menu = await mockApi.getDetailedCaseMenu();
            setDetailedCaseMenu(menu);
        } catch (error) {
            console.error('Failed to load detailed case menu:', error);
        }
    };

    const toggleMenu = (menuId: string) => {
        const newExpanded = new Set(expandedMenus);
        if (newExpanded.has(menuId)) {
            newExpanded.delete(menuId);
        } else {
            newExpanded.add(menuId);
        }
        setExpandedMenus(newExpanded);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        navigate('/login');
    };

    // 定義詳細的菜單項順序
    const caseMenuOrder = [
        'all', 'attention',
        'receipt_pending', 'receipt_authorized',
        'assignment_assigned',
        'undertaker_pending', 'undertaker_processing', 'undertaker_transferred', 'undertaker_overdue',
        'public_completed',
        'resolved', 'rejected'
    ];

    const caseMenuLabels: Record<string, string> = {
        'all': '全部案件',
        'attention': '關注案件',
        'receipt_pending': '收簽-待簽收',
        'receipt_authorized': '收簽-已授理',
        'assignment_assigned': '分派-已分派',
        'undertaker_pending': '承辦-待簽收',
        'undertaker_processing': '承辦-處理中',
        'undertaker_transferred': '承辦-轉移中',
        'undertaker_overdue': '承辦-超期',
        'public_completed': '公文-待審核',
        'resolved': '已結案',
        'rejected': '責撤'
    };

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: '總覽儀表板', category: '系統' },
        { to: '/admin/cases', icon: FileText, label: '案件管理', category: '核心業務', submenu: true, menuId: 'cases' },
        { to: '/admin/users', icon: Users, label: '用戶管理', category: '系統權限' },
        { to: '/admin/roles', icon: Lock, label: '權限角色', category: '系統權限' },
        { to: '/admin/workflows', icon: GitBranch, label: '工作流程', category: '設置' },
        { to: '/admin/reports', icon: FileCheck, label: '報表中心', category: '數據分析' },
        { to: '/admin/audit-logs', icon: BarChart3, label: '審計日誌', category: '數據分析' },
        { to: '/admin/gis', icon: Map, label: 'GIS 圖資分析', category: '數據分析' },
        { to: '/admin/integrations', icon: Zap, label: '外部介接', category: '設置' },
        { to: '/admin/settings', icon: Settings, label: '系統設定', category: '設置' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col flex-shrink-0 relative z-20 shadow-2xl">
                <div className="p-8 flex items-center gap-4 border-b border-slate-900">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                        <Shield size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-white text-base tracking-tight leading-tight uppercase">Smart Intel</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Case Management</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
                    {['系統', '核心業務', '系統權限', '數據分析', '設置'].map((category) => {
                        const items = navItems.filter(i => i.category === category);
                        return items.length > 0 ? (
                            <div key={category} className="space-y-3">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3">{category}</p>
                                <div className="space-y-1">
                                    {items.map((item: any) => {
                                        const isExpanded = item.menuId && expandedMenus.has(item.menuId);
                                        const isSubmenu = item.submenu;

                                        if (isSubmenu) {
                                            return (
                                                <div key={item.to} className="space-y-1">
                                                    {/* 主菜單項 - 案件管理 */}
                                                    <button
                                                        onClick={() => toggleMenu(item.menuId)}
                                                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-900"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon size={18} />
                                                            <span>{item.label}</span>
                                                        </div>
                                                        <ChevronDown
                                                            size={16}
                                                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {/* 子菜單項 - 詳細狀態 */}
                                                    {isExpanded && (
                                                        <div className="space-y-0.5 pl-2">
                                                            {caseMenuOrder.map((key) => {
                                                                const menuItem = detailedCaseMenu[key];
                                                                const count = menuItem?.count || 0;
                                                                const label = caseMenuLabels[key];

                                                                return (
                                                                    <NavLink
                                                                        key={key}
                                                                        to={`/admin/cases?filter=${key}`}
                                                                        className={({ isActive }) => `
                                                            flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold
                                                            ${isActive
                                                                ? 'bg-blue-600 text-white shadow-lg'
                                                                : 'text-slate-500 hover:text-white hover:bg-slate-800'}
                                                        `}
                                                    >
                                                        <span className="truncate flex-1">{label}</span>
                                                        {count > 0 && (
                                                            <span className={`flex items-center justify-center min-w-5 h-5 text-[9px] font-black rounded-full flex-shrink-0 ${
                                                                count > 9 ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                                                            }`}>
                                                                {count > 99 ? '99+' : count}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-bold
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-900'}
                                    `}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        }
                    })}
                </div>
                            </div>
                        ) : null;
                    })}
                </nav>

                <div className="p-6 border-t border-slate-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 w-full transition-all text-sm font-bold"
                    >
                        <LogOut size={18} />
                        <span>登出系統</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                        <h2 className="text-xl font-black tracking-tight text-slate-900">管理作業環境</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected User</div>
                                <div className="text-sm font-black text-slate-900">系統管理員</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 shadow-sm">
                                AD
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-auto">
                    <div className="p-10 max-w-[1600px] mx-auto">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>

            {/* AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
};
