import React, { useState, useMemo, useEffect } from 'react';
import { CaseMap, type MapHotspot } from '../../components/map/CaseMap';
import { Layers, ArrowLeft, Shield, Zap, AlertCircle, MessageSquare, Camera, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGuardianZones } from '../../hooks/useGuardianZones';
import { computeGuardianAlerts } from '../../utils/guardianAlerts';
import { GuardianZonePanel } from '../../components/guardian/GuardianZonePanel';
import { GuardianAlertPanel } from '../../components/guardian/GuardianAlertPanel';
import { AddZoneDialog } from '../../components/guardian/AddZoneDialog';
import { BottomSheet } from '../../components/common/BottomSheet';

// Mobile bottom sheet identifiers
type ActiveSheet = 'legend' | 'report' | 'guardian' | 'addzone' | null;

function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return isMobile;
}

export const MapView: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite' | 'dark'>('osm');
    const [showLayerMenu, setShowLayerMenu] = useState(false);

    // Guardian Zone state
    const { zones, addZone, removeZone, toggleVisibility, canAdd } = useGuardianZones();
    const [showGuardianPanel, setShowGuardianPanel] = useState(false);
    const [showAlertPanel, setShowAlertPanel] = useState(false);
    const [isAddingZone, setIsAddingZone] = useState(false);
    const [pendingZoneCenter, setPendingZoneCenter] = useState<[number, number] | null>(null);
    const [pendingZoneRadius, setPendingZoneRadius] = useState<500 | 1000 | 2000>(1000);

    // Mobile state
    const isMobile = useIsMobile();
    const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

    const beeHotspots: MapHotspot[] = [
        {
            id: 'H1',
            center: [25.025, 121.465],
            radius: 300,
            color: '#f97316', // orange-500
            message: '🐝 注意： 此區當前為虎頭蜂活躍熱點。若看到巡邏蜂，請保持安靜緩步離開，切勿揮趕。'
        }
    ];

    // Guardian zone alerts (computed against hotspots only, no cases)
    const guardianAlerts = useMemo(
        () => computeGuardianAlerts(zones, [], beeHotspots),
        [zones, beeHotspots]
    );

    const totalGuardianAlerts = guardianAlerts.reduce(
        (sum, a) => sum + a.cases.length + a.hotspots.length,
        0
    );

    // Desktop handlers (unchanged logic)
    const handleStartAddZone = () => {
        setIsAddingZone(true);
        setPendingZoneCenter(null);
        setShowGuardianPanel(false);
        if (isMobile) setActiveSheet('addzone');
    };

    const handleCancelAddZone = () => {
        setIsAddingZone(false);
        setPendingZoneCenter(null);
        if (isMobile) setActiveSheet('guardian');
    };

    const handleConfirmAddZone = (name: string, radius: 500 | 1000 | 2000) => {
        if (pendingZoneCenter) {
            addZone(name, pendingZoneCenter, radius);
        }
        setIsAddingZone(false);
        setPendingZoneCenter(null);
        setShowGuardianPanel(true);
        if (isMobile) setActiveSheet('guardian');
    };

    const handleMapClickForZone = (lat: number, lng: number) => {
        setPendingZoneCenter([lat, lng]);
    };

    // Mobile sheet closers
    const closeSheet = () => setActiveSheet(null);

    const openGuardianSheet = () => {
        setIsAddingZone(false);
        setPendingZoneCenter(null);
        setActiveSheet('guardian');
    };

    return (
        <div className="relative h-screen w-full bg-slate-950">
            {/* ===== FLOATING HEADER ===== */}
            {/* Desktop: full header | Mobile: compact header */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex items-start justify-between pointer-events-none lg:top-6 lg:left-6 lg:right-6">
                {/* Left: Back + Title */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl pointer-events-auto flex items-center gap-3 p-3 lg:p-6 lg:gap-6">
                    <Link
                        to="/"
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        {/* Badge — hidden on mobile to save space */}
                        <div className="hidden lg:flex items-center gap-2 mb-1">
                            <div className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                LIVE MAP SYSTEM
                            </div>
                        </div>
                        <h1 className="text-base font-black tracking-tighter text-white lg:text-2xl">案件熱點地圖</h1>
                    </div>
                </div>

                {/* Right: Layer + Shield controls */}
                <div className="pointer-events-auto flex flex-col items-end gap-2">
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col gap-2">
                        <button
                            onClick={() => setShowLayerMenu(!showLayerMenu)}
                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                            title="切換圖層"
                        >
                            <Layers size={20} />
                        </button>
                        {/* Shield button — desktop only; mobile uses Bottom Action Bar */}
                        <button
                            onClick={() => { setShowGuardianPanel(!showGuardianPanel); setIsAddingZone(false); setPendingZoneCenter(null); }}
                            className={`hidden lg:flex relative w-10 h-10 rounded-xl transition-all items-center justify-center cursor-pointer active:scale-95 ${showGuardianPanel || isAddingZone ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
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
                </div>
            </div>

            {/* ===== MAP ===== */}
            <div className="absolute inset-0 z-0">
                <CaseMap
                    cases={[]}
                    activeLayer={activeLayer}
                    hotspots={beeHotspots}
                    guardianZones={zones}
                    guardianAlerts={guardianAlerts}
                    isAddingZone={isAddingZone}
                    onMapClickForZone={handleMapClickForZone}
                    pendingZoneCenter={pendingZoneCenter}
                    pendingZoneRadius={pendingZoneRadius}
                />

                {/* ===== DESKTOP OVERLAYS (hidden on mobile) ===== */}

                {/* Legend Overlay — desktop */}
                <div className="hidden lg:block absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[240px]">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">地圖圖例</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                            <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">危險熱點預警</span>
                        </div>
                        {zones.length > 0 && (
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowGuardianPanel(true)}>
                                <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30"></span>
                                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">我的守護範圍</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guardian Zone Panel — desktop */}
                {showGuardianPanel && (
                    <div className="hidden lg:block absolute bottom-6 left-[280px] z-[1000]">
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

                {/* Add Zone Dialog — desktop */}
                {isAddingZone && !isMobile && (
                    <div className="hidden lg:block absolute bottom-6 left-[280px] z-[1000]">
                        <AddZoneDialog
                            pendingCenter={pendingZoneCenter}
                            onConfirm={handleConfirmAddZone}
                            onCancel={handleCancelAddZone}
                        />
                    </div>
                )}

                {/* Quick Report AI Widget — desktop */}
                <div className="hidden lg:block absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[280px] group overflow-hidden">
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

            {/* ===== MOBILE BOTTOM ACTION BAR ===== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1500] bg-slate-900/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around px-4 py-3 gap-2">
                    {/* Legend Button */}
                    <button
                        onClick={() => setActiveSheet(activeSheet === 'legend' ? null : 'legend')}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeSheet === 'legend' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                    >
                        <BookOpen size={20} />
                        <span className="text-[10px] font-bold">圖例</span>
                    </button>

                    {/* Quick Report CTA — main action */}
                    <button
                        onClick={() => setActiveSheet(activeSheet === 'report' ? null : 'report')}
                        className="flex flex-col items-center gap-1 px-6 py-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                    >
                        <Zap size={22} className="animate-pulse" />
                        <span className="text-[10px] font-black">快速通報</span>
                    </button>

                    {/* Guardian Zones Button */}
                    <button
                        onClick={() => setActiveSheet(activeSheet === 'guardian' ? null : 'guardian')}
                        className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeSheet === 'guardian' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                    >
                        <Shield size={20} />
                        <span className="text-[10px] font-bold">守護範圍</span>
                        {totalGuardianAlerts > 0 && (
                            <span className="absolute top-1 right-2 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[8px] font-black text-white">
                                    {totalGuardianAlerts > 9 ? '9+' : totalGuardianAlerts}
                                </span>
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ===== MOBILE BOTTOM SHEETS ===== */}

            {/* Legend Sheet */}
            <BottomSheet
                isOpen={isMobile && activeSheet === 'legend'}
                onClose={closeSheet}
                title="地圖圖例"
                snapPoints={['half']}
                defaultSnap="half"
            >
                <div className="px-5 py-4 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className="w-4 h-4 rounded-full bg-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.5)] shrink-0"></span>
                        <div>
                            <div className="text-sm font-bold text-white">危險熱點預警</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">標示已知危險動物活躍區域</div>
                        </div>
                    </div>
                    {zones.length > 0 && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer active:bg-white/10 transition-all"
                            onClick={() => { closeSheet(); setTimeout(() => openGuardianSheet(), 100); }}
                        >
                            <span className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-blue-500/30 shrink-0"></span>
                            <div>
                                <div className="text-sm font-bold text-white">我的守護範圍</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">點擊查看 {zones.length} 個守護範圍</div>
                            </div>
                        </div>
                    )}
                    {zones.length === 0 && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 opacity-50">
                            <span className="w-4 h-4 rounded-full bg-blue-500/40 ring-2 ring-blue-500/20 shrink-0"></span>
                            <div>
                                <div className="text-sm font-bold text-white">我的守護範圍</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">尚未設定守護範圍</div>
                            </div>
                        </div>
                    )}
                    <div className="pt-2 text-[11px] text-slate-500 text-center">
                        點擊地圖上的熱點可查看詳細資訊
                    </div>
                </div>
            </BottomSheet>

            {/* Quick Report Sheet */}
            <BottomSheet
                isOpen={isMobile && activeSheet === 'report'}
                onClose={closeSheet}
                title="快速通報 AI 助理"
                snapPoints={['half', 'full']}
                defaultSnap="half"
            >
                <div className="px-5 py-4 space-y-4">
                    {/* AI Status */}
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                        <span className="text-xs font-bold text-emerald-300">AI 系統在線，支援即時影像辨識</span>
                    </div>

                    {/* Main CTA */}
                    <Link
                        to="/smart-guide"
                        onClick={closeSheet}
                        className="flex items-center justify-between w-full bg-white active:bg-blue-50 transition-all p-4 rounded-2xl shadow-lg group"
                    >
                        <div>
                            <div className="text-sm font-black text-slate-900 tracking-tighter">啟動智能引導報案</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">AI 引導完成報案流程</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                            <MessageSquare size={18} />
                        </div>
                    </Link>

                    {/* Quick Actions */}
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">快速分類通報</div>
                        <div className="grid grid-cols-3 gap-3">
                            <Link
                                to="/report/general"
                                onClick={closeSheet}
                                className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <AlertCircle size={22} className="text-red-400" />
                                <span className="text-[11px] font-black text-slate-300">一般救援</span>
                            </Link>
                            <Link
                                to="/report/bee"
                                onClick={closeSheet}
                                className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <Zap size={22} className="text-orange-400" />
                                <span className="text-[11px] font-black text-slate-300">捕蜂抓蛇</span>
                            </Link>
                            <Link
                                to="/report/general"
                                onClick={closeSheet}
                                className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <Camera size={22} className="text-emerald-400" />
                                <span className="text-[11px] font-black text-slate-300">影像上傳</span>
                            </Link>
                        </div>
                    </div>

                    <div className="pb-4 text-[11px] text-slate-500 text-center">
                        通報後將由專業人員於 30 分鐘內回應
                    </div>
                </div>
            </BottomSheet>

            {/* Guardian Zone Sheet */}
            <BottomSheet
                isOpen={isMobile && activeSheet === 'guardian'}
                onClose={closeSheet}
                snapPoints={['half', 'full']}
                defaultSnap="half"
            >
                <GuardianZonePanel
                    variant="sheet"
                    zones={zones}
                    alerts={guardianAlerts}
                    canAdd={canAdd}
                    onStartAdd={() => {
                        setIsAddingZone(true);
                        setPendingZoneCenter(null);
                        setActiveSheet('addzone');
                    }}
                    onDelete={removeZone}
                    onToggleVisibility={toggleVisibility}
                    onOpenAlerts={() => {
                        setActiveSheet(null);
                        setShowAlertPanel(true);
                    }}
                    onClose={closeSheet}
                />
            </BottomSheet>

            {/* Add Zone Sheet (mobile) */}
            <BottomSheet
                isOpen={isMobile && activeSheet === 'addzone'}
                onClose={() => {
                    setIsAddingZone(false);
                    setPendingZoneCenter(null);
                    setActiveSheet('guardian');
                }}
                title="新增守護範圍"
                snapPoints={['half', 'full']}
                defaultSnap="half"
            >
                <div className="px-5 py-4">
                    <AddZoneDialog
                        pendingCenter={pendingZoneCenter}
                        onConfirm={handleConfirmAddZone}
                        onCancel={() => {
                            setIsAddingZone(false);
                            setPendingZoneCenter(null);
                            setActiveSheet('guardian');
                        }}
                    />
                </div>
            </BottomSheet>

            {/* ===== GUARDIAN ALERT PANEL (both layouts) ===== */}
            <GuardianAlertPanel
                alerts={guardianAlerts}
                isOpen={showAlertPanel}
                onClose={() => setShowAlertPanel(false)}
            />
        </div>
    );
};
