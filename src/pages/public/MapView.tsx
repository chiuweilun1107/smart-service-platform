import React, { useEffect, useState, useMemo } from 'react';
import { CaseMap, type CaseMarker, type MapHotspot } from '../../components/map/CaseMap';
import { Filter, Layers, ArrowLeft, Zap, AlertCircle, MessageSquare, Camera, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGuardianZones } from '../../hooks/useGuardianZones';
import { computeGuardianAlerts } from '../../utils/guardianAlerts';
import { GuardianZonePanel } from '../../components/guardian/GuardianZonePanel';
import { GuardianAlertPanel } from '../../components/guardian/GuardianAlertPanel';
import { AddZoneDialog } from '../../components/guardian/AddZoneDialog';

export const MapView: React.FC = () => {
    // Mock Data
    const [cases, setCases] = useState<CaseMarker[]>([]);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [showDispatchDialog, setShowDispatchDialog] = useState(false);
    const [selectedCase, setSelectedCase] = useState<{ id: string; title: string } | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite' | 'dark'>('osm');
    const [showLayerMenu, setShowLayerMenu] = useState(false);

    // Guardian Zone state
    const { zones, addZone, removeZone, toggleVisibility, canAdd } = useGuardianZones();
    const [showGuardianPanel, setShowGuardianPanel] = useState(false);
    const [showAlertPanel, setShowAlertPanel] = useState(false);
    const [isAddingZone, setIsAddingZone] = useState(false);
    const [pendingZoneCenter, setPendingZoneCenter] = useState<[number, number] | null>(null);
    const [pendingZoneRadius, setPendingZoneRadius] = useState<500 | 1000 | 2000>(1000);

    useEffect(() => {
        const handleOpenDispatch = (e: CustomEvent<{ id: string; title: string }>) => {
            setSelectedCase(e.detail);
            setShowDispatchDialog(true);
        };

        window.addEventListener('open-dispatch-dialog', handleOpenDispatch as EventListener);
        return () => {
            window.removeEventListener('open-dispatch-dialog', handleOpenDispatch as EventListener);
        };
    }, []);

    useEffect(() => {
        // Simulate API fetch
        const mockCases: CaseMarker[] = [
            {
                id: 'C20231021001',
                lat: 25.012,
                lng: 121.465,
                type: 'general',
                title: '板橋區流浪犬聚集',
                status: 'pending',
                address: '新北市板橋區縣民大道二段7號',
                reporter: '王小明',
                photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300',
                description: '三隻流浪犬在公園遊蕩，有追車行為。'
            },
            {
                id: 'C20231021002',
                lat: 25.008,
                lng: 121.460,
                type: 'bee',
                title: '民宅屋簷蜂窩',
                status: 'processing',
                address: '新北市板橋區中山路一段161號',
                reporter: '李大華',
                photoUrl: 'https://images.unsplash.com/photo-1579383618796-08e67bbc3363?auto=format&fit=crop&q=80&w=300',
                description: '約籃球大小，位於三樓屋簷下。'
            },
            {
                id: 'C20231021003',
                lat: 25.020,
                lng: 121.470,
                type: 'general',
                title: '受傷貓咪救援',
                status: 'resolved',
                address: '新北市板橋區文化路一段188巷',
                reporter: '陳志豪',
                photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
                description: '左後腳似乎受傷，行動不便。'
            },
            {
                id: 'C20231021004',
                lat: 25.030,
                lng: 121.450,
                type: 'bee',
                title: '公園樹上蜂窩',
                status: 'pending',
                address: '新北市板橋區藝文一街',
                reporter: '林美雲',
                photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=300',
                description: '目測即將分蜂，請盡快處理。'
            },
            {
                id: 'C20231021005',
                lat: 25.015,
                lng: 121.480,
                type: 'general',
                title: '疑似虐待動物',
                status: 'processing',
                address: '新北市板橋區三民路二段',
                reporter: '張建國',
                description: '聽到長期哀嚎聲，疑似未提供飲水。'
            },
            {
                id: 'C20231021006',
                lat: 25.025,
                lng: 121.455,
                type: 'general',
                title: '大型犬隻遊蕩',
                status: 'pending',
                address: '新北市板橋區中正路300號附近',
                reporter: '黃怡君',
                photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300',
                description: '黑色大型犬，無項圈，看起來很餓。'
            },
            {
                id: 'C20231021007',
                lat: 25.005,
                lng: 121.475,
                type: 'bee',
                title: '路燈桿上蜂窩',
                status: 'resolved',
                address: '新北市板橋區四川路二段',
                reporter: '趙技安',
                description: '虎頭蜂窩，已請相關單位移除。'
            },
            {
                id: 'C20231021008',
                lat: 25.018,
                lng: 121.462,
                type: 'general',
                title: '受困幼貓',
                status: 'processing',
                address: '新北市板橋區實踐路',
                reporter: '吳淑芬',
                photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=300',
                description: '卡在車底盤，需要協助誘捕。'
            },
            {
                id: 'C20231021009',
                lat: 25.035,
                lng: 121.445,
                type: 'bee',
                title: '校園操場蜂窩',
                status: 'pending',
                address: '新北市板橋區大觀路一段',
                reporter: '陳老師',
                photoUrl: 'https://images.unsplash.com/photo-1528696892704-5e1122852276?auto=format&fit=crop&q=80&w=300',
                description: '學生發現足球門旁有蜂窩。'
            },
            {
                id: 'C20231021010',
                lat: 25.010,
                lng: 121.485,
                type: 'general',
                title: '捕獸夾誤傷犬隻',
                status: 'pending',
                address: '新北市板橋區三民路一段',
                reporter: '劉志明',
                description: '狗狗右腳被夾住，需要緊急救援。'
            },
            {
                id: 'C20231021011',
                lat: 25.022,
                lng: 121.458,
                type: 'bee',
                title: '變電箱蜂窩',
                status: 'processing',
                address: '新北市板橋區南雅南路二段',
                reporter: '台電人員',
                description: '維修時發現，暫停作業中。'
            },
            {
                id: 'C20231021012',
                lat: 25.028,
                lng: 121.468,
                type: 'general',
                title: '流浪貓結紮回置',
                status: 'resolved',
                address: '新北市板橋區民生路二段',
                reporter: '愛媽小玲',
                photoUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968ef?auto=format&fit=crop&q=80&w=300',
                description: '已完成絕育手術，剪耳標記。'
            },
            {
                id: 'C20231021013',
                lat: 25.016,
                lng: 121.452,
                type: 'general',
                title: '走失柴犬',
                status: 'pending',
                address: '新北市板橋區國光路',
                reporter: '林先生',
                photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300',
                description: '黃色柴犬，紅色項圈，叫聲宏亮。'
            },
            {
                id: 'C20231021014',
                lat: 25.006,
                lng: 121.466,
                type: 'bee',
                title: '陽台築巢',
                status: 'pending',
                address: '新北市板橋區貴興路',
                reporter: '張太太',
                description: '一早起來發現好多蜜蜂。'
            },
            {
                id: 'C20231021015',
                lat: 25.013,
                lng: 121.472,
                type: 'general',
                title: '公園違規餵食',
                status: 'resolved',
                address: '新北市板橋區雙十路二段',
                reporter: '環保局稽查',
                description: '勸導後已改善，清理環境。'
            }
        ];
        setCases(mockCases);
    }, []);

    const beeHotspots: MapHotspot[] = [
        {
            id: 'H1',
            center: [25.025, 121.465],
            radius: 300,
            color: '#f97316', // orange-500
            message: '🐝 注意： 此區當前為虎頭蜂活躍熱點。若看到巡邏蜂，請保持安靜緩步離開，切勿揮趕。'
        }
    ];

    const filteredCases = cases.filter(c => {
        if (filterType !== 'all' && c.type !== filterType) return false;
        if (filterStatus !== 'all' && c.status !== filterStatus) return false;
        return true;
    });

    // Guardian zone alerts (computed against ALL cases, not filtered)
    const guardianAlerts = useMemo(
        () => computeGuardianAlerts(zones, cases, beeHotspots),
        [zones, cases, beeHotspots]
    );

    const totalGuardianAlerts = guardianAlerts.reduce(
        (sum, a) => sum + a.cases.length + a.hotspots.length,
        0
    );

    const handleStartAddZone = () => {
        setIsAddingZone(true);
        setPendingZoneCenter(null);
        setShowGuardianPanel(false);
    };

    const handleCancelAddZone = () => {
        setIsAddingZone(false);
        setPendingZoneCenter(null);
    };

    const handleConfirmAddZone = (name: string, radius: 500 | 1000 | 2000) => {
        if (pendingZoneCenter) {
            addZone(name, pendingZoneCenter, radius);
        }
        setIsAddingZone(false);
        setPendingZoneCenter(null);
        setShowGuardianPanel(true);
    };

    const handleMapClickForZone = (lat: number, lng: number) => {
        setPendingZoneCenter([lat, lng]);
    };

    return (
        <div className="relative h-screen w-full bg-slate-950">
            {/* Floating Header */}
            <div className="absolute top-6 left-6 right-6 z-[1000] flex items-start justify-between pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl pointer-events-auto flex items-center gap-6">
                    <Link to="/" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                LIVE MAP SYSTEM
                            </div>
                            <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {filteredCases.length} ACTIVE CASES
                            </div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">案件熱點圖資中心</h1>
                    </div>
                </div>

                <div className="pointer-events-auto flex flex-col items-end gap-2">
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col gap-2">
                        <button
                            onClick={() => setShowLayerMenu(!showLayerMenu)}
                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                            title="切換圖層"
                        >
                            <Layers size={20} />
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${showFilters ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
                            title="篩選案件"
                        >
                            <Filter size={20} />
                        </button>
                        <button
                            onClick={() => { setShowGuardianPanel(!showGuardianPanel); setIsAddingZone(false); setPendingZoneCenter(null); }}
                            className={`relative w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${showGuardianPanel || isAddingZone ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
                            title="我的守護範圍"
                        >
                            <Shield size={20} />
                            {totalGuardianAlerts > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[8px] font-black text-white">
                                        {totalGuardianAlerts > 9 ? '9+' : totalGuardianAlerts}
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Layer Menu */}
                    {showLayerMenu && (
                        <div className="bg-white p-4 rounded-2xl shadow-xl mt-2 w-48 border border-slate-100 animate-in fade-in slide-in-from-top-2 mr-1">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">地圖圖層</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => { setActiveLayer('osm'); setShowLayerMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeLayer === 'osm' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    標準地圖 (Standard)
                                </button>
                                <button
                                    onClick={() => { setActiveLayer('satellite'); setShowLayerMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeLayer === 'satellite' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    衛星影像 (Satellite)
                                </button>
                                <button
                                    onClick={() => { setActiveLayer('dark'); setShowLayerMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeLayer === 'dark' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    黑夜模式 (Dark)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-white p-4 rounded-2xl shadow-xl mt-2 w-64 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">案件篩選</h3>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-2">案件類型</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >全部</button>
                                    <button
                                        onClick={() => setFilterType('general')}
                                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${filterType === 'general' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >一般</button>
                                    <button
                                        onClick={() => setFilterType('bee')}
                                        className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${filterType === 'bee' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >蜂案</button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">處理狀態</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full text-sm p-2 rounded-lg bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                                >
                                    <option value="all">所有狀態</option>
                                    <option value="pending">待處理</option>
                                    <option value="processing">處理中</option>
                                    <option value="resolved">已結案</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute inset-0 z-0">
                <CaseMap
                    cases={filteredCases}
                    activeLayer={activeLayer}
                    hotspots={beeHotspots}
                    guardianZones={zones}
                    guardianAlerts={guardianAlerts}
                    isAddingZone={isAddingZone}
                    onMapClickForZone={handleMapClickForZone}
                    pendingZoneCenter={pendingZoneCenter}
                    pendingZoneRadius={pendingZoneRadius}
                />

                {/* Legend Overlay */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[240px]">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">即時狀態圖例</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">一般案件 (處理中)</span>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                            <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">蜂案 (處理中)</span>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">已結案</span>
                        </div>
                        {zones.length > 0 && (
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowGuardianPanel(true)}>
                                <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></span>
                                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">我的守護範圍</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guardian Zone Panel */}
                {showGuardianPanel && (
                    <div className="absolute bottom-6 left-[280px] z-[1000]">
                        <GuardianZonePanel
                            zones={zones}
                            alerts={guardianAlerts}
                            canAdd={canAdd}
                            onStartAdd={handleStartAddZone}
                            onDelete={removeZone}
                            onToggleVisibility={toggleVisibility}
                            onOpenAlerts={() => { setShowAlertPanel(true); setShowGuardianPanel(false); }}
                            onClose={() => setShowGuardianPanel(false)}
                        />
                    </div>
                )}

                {/* Add Zone Dialog */}
                {isAddingZone && (
                    <div className="absolute bottom-6 left-[280px] z-[1000]">
                        <AddZoneDialog
                            pendingCenter={pendingZoneCenter}
                            onConfirm={handleConfirmAddZone}
                            onCancel={handleCancelAddZone}
                        />
                    </div>
                )}

                {/* Quick Report AI Widget */}
                <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[280px] group overflow-hidden">
                    {/* Background Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <Zap size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white tracking-tighter">快速通報 AI 助理</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Intelligent Reporting</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link
                                to="/smart-guide"
                                className="flex items-center justify-between w-full bg-white hover:bg-blue-50 transition-all p-4 rounded-2xl group/btn shadow-lg"
                            >
                                <span className="text-sm font-black text-slate-900 tracking-tighter">啟動智能引導報案</span>
                                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                    <MessageSquare size={16} />
                                </div>
                            </Link>

                            <div className="grid grid-cols-3 gap-2">
                                <Link
                                    to="/report/general"
                                    className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item"
                                    title="一般救援"
                                >
                                    <AlertCircle size={18} className="text-red-400 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black text-slate-400">救援</span>
                                </Link>
                                <Link
                                    to="/report/bee"
                                    className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item"
                                    title="捕蜂抓蛇"
                                >
                                    <Zap size={18} className="text-orange-400 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black text-slate-400">捕蜂</span>
                                </Link>
                                <Link
                                    to="/report/general"
                                    className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item"
                                    title="影像上傳"
                                >
                                    <Camera size={18} className="text-emerald-400 group-hover/item:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black text-slate-400">上傳</span>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                AI 系統在線，支援即時影像辨識
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guardian Alert Panel */}
            <GuardianAlertPanel
                alerts={guardianAlerts}
                isOpen={showAlertPanel}
                onClose={() => setShowAlertPanel(false)}
            />

            {/* Dispatch Dialog */}
            <DispatchDialog
                isOpen={showDispatchDialog}
                onClose={() => setShowDispatchDialog(false)}
                caseInfo={selectedCase}
            />
        </div>
    );
};

// Dispatch Dialog Component
const DispatchDialog = ({ isOpen, onClose, caseInfo }: { isOpen: boolean; onClose: () => void; caseInfo: { id: string; title: string } | null }) => {
    if (!isOpen || !caseInfo) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`指派成功！\n案件：${caseInfo.title}\n已通知相關單位前往處理。`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-lg text-slate-800">指派任務</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-5 h-5 rotate-180" /> {/* Reuse ArrowLeft as Close for now or just X */}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-xs text-blue-600 font-bold mb-1">目標案件</div>
                        <div className="font-bold text-slate-800">{caseInfo.title}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{caseInfo.id}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">指派單位/人員</label>
                        <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium text-slate-600">
                            <option>請選擇指派對象...</option>
                            <optgroup label="動保處">
                                <option>動保救援隊 - 第一分隊</option>
                                <option>動保救援隊 - 第二分隊</option>
                                <option>板橋區駐點人員 - 林技士</option>
                            </optgroup>
                            <optgroup label="外包廠商">
                                <option>快樂清潔有限公司 (捕蜂)</option>
                                <option>安心除蟲企業社</option>
                            </optgroup>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">任務優先級</label>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="w-4 h-4 text-slate-600 focus:ring-slate-500" defaultChecked />
                                <span className="text-sm font-medium text-slate-600">普通</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                                <span className="text-sm font-medium text-slate-600">緊急</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="priority" className="w-4 h-4 text-red-600 focus:ring-red-600" />
                                <span className="text-sm font-bold text-red-600">最速件</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">任務備註</label>
                        <textarea
                            rows={3}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none text-sm"
                            placeholder="請輸入任務詳細說明或注意事項..."
                        ></textarea>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                            取消
                        </button>
                        <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg hover:shadow-slate-900/20 active:scale-95 transform duration-100">
                            確認指派
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
