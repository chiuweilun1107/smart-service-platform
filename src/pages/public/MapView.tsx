import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CaseMap, type MapHotspot, type CaseMarker } from '../../components/map/CaseMap';
import {
    Layers, ArrowLeft, Shield, Zap, AlertCircle, MessageSquare,
    Camera, BookOpen, Filter, X, MapPin, List, Plus, Minus
} from 'lucide-react';
import { type Map as LeafletMap } from 'leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { useGuardianZones } from '../../hooks/useGuardianZones';
import { computeGuardianAlerts } from '../../utils/guardianAlerts';
import { GuardianZonePanel } from '../../components/guardian/GuardianZonePanel';
import { GuardianAlertPanel } from '../../components/guardian/GuardianAlertPanel';
import { AddZoneDialog } from '../../components/guardian/AddZoneDialog';
import { BottomSheet } from '../../components/common/BottomSheet';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveSheet = 'legend' | 'report' | 'guardian' | 'addzone' | 'cases' | null;
type CaseTypeFilter = 'all' | 'general' | 'bee';
type StatusFilter = 'all' | 'pending' | 'processing' | 'resolved';

// ─── Mock Admin Cases ─────────────────────────────────────────────────────────

const MOCK_CASES: CaseMarker[] = [
    { id: 'C001', lat: 25.033, lng: 121.565, type: 'bee',     title: '虎頭蜂築巢 — 大安區',   status: 'pending',    address: '台北市大安區和平東路二段', reporter: '市民 A', assignedTo: 'contractor01' },
    { id: 'C002', lat: 25.048, lng: 121.514, type: 'general', title: '路樹傾倒 — 中山區',      status: 'processing', address: '台北市中山區中山北路三段', reporter: '市民 B', assignedTo: 'contractor02' },
    { id: 'C003', lat: 24.997, lng: 121.530, type: 'bee',     title: '蜂窩清除 — 文山區',      status: 'resolved',   address: '台北市文山區羅斯福路六段', reporter: '市民 C', assignedTo: 'contractor01' },
    { id: 'C004', lat: 25.020, lng: 121.480, type: 'general', title: '積水清除通報 — 萬華區',   status: 'pending',    address: '台北市萬華區西藏路',      reporter: '市民 D' },
    { id: 'C005', lat: 25.055, lng: 121.600, type: 'bee',     title: '胡蜂入侵 — 內湖區',      status: 'processing', address: '台北市內湖區成功路四段',   reporter: '市民 E', assignedTo: 'contractor01' },
    { id: 'C006', lat: 25.012, lng: 121.550, type: 'general', title: '流浪犬傷人 — 信義區',    status: 'pending',    address: '台北市信義區松仁路',      reporter: '市民 F' },
    { id: 'C007', lat: 25.061, lng: 121.540, type: 'bee',     title: '黃蜂群聚 — 士林區',      status: 'pending',    address: '台北市士林區天母東路',    reporter: '市民 G', assignedTo: 'contractor02' },
    { id: 'C008', lat: 25.040, lng: 121.502, type: 'general', title: '危樹通報 — 中正區',      status: 'resolved',   address: '台北市中正區愛國西路',    reporter: '市民 H' },
    { id: 'C009', lat: 24.988, lng: 121.560, type: 'bee',     title: '蜂巢移除 — 南港區',      status: 'processing', address: '台北市南港區研究院路',    reporter: '市民 I', assignedTo: 'contractor01' },
    { id: 'C010', lat: 25.015, lng: 121.510, type: 'general', title: '噪音投訴 — 大同區',      status: 'resolved',   address: '台北市大同區延平北路三段', reporter: '市民 J' },
    { id: 'C011', lat: 25.052, lng: 121.458, type: 'bee',     title: '蜂螫事件 — 北投區',      status: 'pending',    address: '台北市北投區中山路',      reporter: '市民 K', assignedTo: 'contractor01' },
    { id: 'C012', lat: 25.003, lng: 121.494, type: 'general', title: '路面坑洞 — 中正區',      status: 'processing', address: '台北市中正區林森南路',    reporter: '市民 L', assignedTo: 'contractor02' },
    { id: 'C013', lat: 25.036, lng: 121.575, type: 'bee',     title: '蜂窩驅除 — 松山區',      status: 'pending',    address: '台北市松山區南京東路五段', reporter: '市民 M' },
    { id: 'C014', lat: 25.022, lng: 121.534, type: 'general', title: '野貓聚集 — 大安區',      status: 'resolved',   address: '台北市大安區敦化南路一段', reporter: '市民 N' },
    { id: 'C015', lat: 25.044, lng: 121.527, type: 'bee',     title: '屋簷蜂窩 — 松山區',      status: 'processing', address: '台北市松山區八德路四段',   reporter: '市民 O', assignedTo: 'contractor01' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return isMobile;
}

const STATUS_LABEL: Record<CaseMarker['status'], string> = {
    pending:    '待處理',
    processing: '處理中',
    resolved:   '已結案',
};

const STATUS_COLOR: Record<CaseMarker['status'], string> = {
    pending:    'bg-red-500/20 text-red-300 border-red-500/30',
    processing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    resolved:   'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

// ─── DispatchDialog ───────────────────────────────────────────────────────────

interface DispatchDialogProps {
    caseItem: CaseMarker;
    onClose: () => void;
}

const DispatchDialog: React.FC<DispatchDialogProps> = ({ caseItem, onClose }) => {
    const [assignee, setAssignee] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submit — real integration would call API
        alert(`已指派「${caseItem.title}」給 ${assignee || '（未填）'}。\n備注：${note || '無'}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-5"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">指派任務</div>
                        <h2 className="text-base font-black text-white tracking-tighter leading-snug">{caseItem.title}</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">{caseItem.address}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 shrink-0 transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${STATUS_COLOR[caseItem.status]}`}>
                        {STATUS_LABEL[caseItem.status]}
                    </span>
                    <span className="text-[10px] text-slate-500">{caseItem.type === 'bee' ? '捕蜂抓蛇' : '一般救援'}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            指派人員
                        </label>
                        <input
                            type="text"
                            value={assignee}
                            onChange={e => setAssignee(e.target.value)}
                            placeholder="輸入處理人員姓名或工號"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            處置備注
                        </label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="輸入現場注意事項或特殊說明…"
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-slate-300 hover:bg-white/10 transition-all"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                        >
                            確認指派
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const MapView: React.FC = () => {
    const navigate = useNavigate();

    // Auth
    const [isAdmin, setIsAdmin] = useState(false);
    const [isContractor, setIsContractor] = useState(false);
    const [contractorId, setContractorId] = useState<string | null>(null);
    useEffect(() => {
        const role = localStorage.getItem('auth_role');
        setIsAdmin(role === 'admin' || role === 'caseworker');
        setIsContractor(role === 'contractor');
        if (role === 'contractor') {
            setContractorId(localStorage.getItem('auth_username'));
        }
    }, []);

    // Map layer
    const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite' | 'dark'>('osm');
    const [showLayerMenu, setShowLayerMenu] = useState(false);

    // Guardian Zone state
    const { zones, addZone, removeZone, toggleVisibility, canAdd } = useGuardianZones();
    const [showGuardianPanel, setShowGuardianPanel] = useState(false);
    const [showAlertPanel, setShowAlertPanel] = useState(false);
    const [isAddingZone, setIsAddingZone] = useState(false);
    const [pendingZoneCenter, setPendingZoneCenter] = useState<[number, number] | null>(null);
    const [pendingZoneRadius, setPendingZoneRadius] = useState<500 | 1000 | 2000>(1000);

    // Selected case (fly-to + open popup)
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const selectCase = (id: string) => setSelectedCaseId(prev => prev === id ? null : id);

    // Admin: cases & filter state
    const [cases, setCases] = useState<CaseMarker[]>([]);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterType, setFilterType] = useState<CaseTypeFilter>('all');
    const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
    const [dispatchTarget, setDispatchTarget] = useState<CaseMarker | null>(null);

    // Public: toggle hotspot visibility
    const [showHotspots, setShowHotspots] = useState(true);

    // Legend quick-filter: status maps directly to pin color (pending=red, processing=orange, resolved=green)
    type LegendKey = 'pending' | 'processing' | 'resolved';
    const [legendFilter, setLegendFilter] = useState<Set<LegendKey>>(
        new Set<LegendKey>(['pending', 'processing', 'resolved'])
    );
    const toggleLegendKey = (key: LegendKey) => {
        setLegendFilter(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size > 1) next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // Leaflet map ref for programmatic zoom control
    const mapRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        if (isAdmin) {
            setCases(MOCK_CASES);
        } else if (isContractor) {
            // Only show cases assigned to this contractor
            setCases(MOCK_CASES.filter(c => contractorId ? c.assignedTo === contractorId : c.assignedTo != null));
        } else {
            setCases([]);
        }
    }, [isAdmin, isContractor, contractorId]);

    const filteredCases = useMemo(() => {
        return cases.filter(c => {
            const typeMatch = filterType === 'all' || c.type === filterType;
            const statusMatch = filterStatus === 'all' || c.status === filterStatus;
            const legendMatch = legendFilter.has(c.status);
            return typeMatch && statusMatch && legendMatch;
        });
    }, [cases, filterType, filterStatus, legendFilter]);

    const activeCasesCount = useMemo(
        () => cases.filter(c => c.status !== 'resolved').length,
        [cases]
    );

    // Mobile state
    const isMobile = useIsMobile();
    const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

    const beeHotspots: MapHotspot[] = [
        {
            id: 'H1',
            center: [25.025, 121.465],
            radius: 300,
            color: '#f97316',
            message: '🐝 注意： 此區當前為虎頭蜂活躍熱點。若看到巡邏蜂，請保持安靜緩步離開，切勿揮趕。'
        }
    ];

    const guardianAlerts = useMemo(
        () => computeGuardianAlerts(zones, [], beeHotspots),
        [zones, beeHotspots]
    );

    const totalGuardianAlerts = guardianAlerts.reduce(
        (sum, a) => sum + a.cases.length + a.hotspots.length,
        0
    );

    // Status update (contractor: 開始執行 / 完成回報)
    const handleStatusUpdate = (id: string, newStatus: CaseMarker['status']) => {
        setCases(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    // Listen for 指派任務 event fired from CaseMap popup
    useEffect(() => {
        const handler = (e: Event) => {
            const { id } = (e as CustomEvent<{ id: string; title: string }>).detail;
            const found = cases.find(c => c.id === id);
            if (found) setDispatchTarget(found);
        };
        window.addEventListener('open-dispatch-dialog', handler);
        return () => window.removeEventListener('open-dispatch-dialog', handler);
    }, [cases]);

    // Handlers
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

    const closeSheet = () => setActiveSheet(null);

    const openGuardianSheet = () => {
        setIsAddingZone(false);
        setPendingZoneCenter(null);
        setActiveSheet('guardian');
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="relative h-screen w-full bg-slate-950">

            {/* ===== FLOATING HEADER ===== */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex items-start justify-between pointer-events-none lg:top-6 lg:left-6 lg:right-6">

                {/* Left: Back + Title + Active Cases Badge */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl pointer-events-auto flex items-center gap-3 p-3 lg:p-4 lg:gap-4">
                    <Link
                        to="/"
                        className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <div className="hidden lg:flex items-center gap-2 mb-1">
                            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${isContractor ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                                {isContractor ? 'CONTRACTOR VIEW' : 'LIVE MAP SYSTEM'}
                            </div>
                            {isAdmin && activeCasesCount > 0 && (
                                <div className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-red-500/20 animate-pulse">
                                    {activeCasesCount} ACTIVE CASES
                                </div>
                            )}
                            {isContractor && activeCasesCount > 0 && (
                                <div className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-orange-500/20 animate-pulse">
                                    {activeCasesCount} PENDING TASKS
                                </div>
                            )}
                        </div>
                        <h1 className="text-base font-black tracking-tighter text-white lg:text-lg">
                            {isAdmin ? '案件管理地圖' : isContractor ? '我的派工地圖' : '案件熱點地圖'}
                        </h1>
                    </div>

                </div>

                {/* Right: Controls */}
                <div className="pointer-events-auto flex flex-col items-end gap-2">
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col gap-2">
                        {/* Layer toggle */}
                        <button
                            onClick={() => setShowLayerMenu(!showLayerMenu)}
                            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 ${showLayerMenu ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                            title="切換圖層"
                        >
                            <Layers size={20} />
                        </button>

                        {/* Admin: Filter */}
                        {isAdmin && (
                            <button
                                onClick={() => { setShowFilterPanel(!showFilterPanel); setShowGuardianPanel(false); }}
                                className={`hidden lg:flex relative w-10 h-10 rounded-xl transition-all items-center justify-center cursor-pointer active:scale-95 ${showFilterPanel ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
                                title="篩選案件"
                            >
                                <Filter size={20} />
                                {(filterType !== 'all' || filterStatus !== 'all') && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></span>
                                )}
                            </button>
                        )}

                        {/* Guardian Shield — desktop only for public (not contractor or admin) */}
                        {!isContractor && (
                            <button
                                onClick={() => { setShowGuardianPanel(!showGuardianPanel); setShowFilterPanel(false); setIsAddingZone(false); setPendingZoneCenter(null); }}
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
                        )}

                        {/* Zoom controls */}
                        <div className="h-px bg-slate-100 mx-1"></div>
                        <button
                            onClick={() => mapRef.current?.zoomIn()}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all active:scale-95"
                            title="放大"
                        >
                            <Plus size={20} />
                        </button>
                        <button
                            onClick={() => mapRef.current?.zoomOut()}
                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all active:scale-95"
                            title="縮小"
                        >
                            <Minus size={20} />
                        </button>

                    </div>

                    {/* Layer Menu */}
                    {showLayerMenu && (
                        <div className="bg-white p-4 rounded-2xl shadow-xl mt-2 w-48 border border-slate-100 animate-in fade-in slide-in-from-top-2 mr-1">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">地圖圖層</h3>
                            <div className="space-y-2">
                                {(['osm', 'satellite', 'dark'] as const).map(layer => (
                                    <button
                                        key={layer}
                                        onClick={() => { setActiveLayer(layer); setShowLayerMenu(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeLayer === layer ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {layer === 'osm' ? '標準地圖 (Standard)' : layer === 'satellite' ? '衛星影像 (Satellite)' : '黑夜模式 (Dark)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== MAP ===== */}
            <div className="absolute inset-0 z-0">
                <CaseMap
                    cases={filteredCases}
                    activeLayer={activeLayer}
                    hotspots={isAdmin || isContractor ? [] : (showHotspots ? beeHotspots : [])}
                    guardianZones={zones}
                    guardianAlerts={guardianAlerts}
                    isAddingZone={isAddingZone}
                    onMapClickForZone={handleMapClickForZone}
                    pendingZoneCenter={pendingZoneCenter}
                    pendingZoneRadius={pendingZoneRadius}
                    onMapReady={(map) => { mapRef.current = map; }}
                    selectedCaseId={selectedCaseId}
                    isContractor={isContractor}
                    onStatusUpdate={handleStatusUpdate}
                    onOpenReport={(c) => navigate(`/report/fieldwork/${c.id}`, { state: { caseItem: c } })}
                />

                {/* ===== DESKTOP OVERLAYS ===== */}

                {/* Legend — desktop */}
                <div className="hidden lg:block absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[200px]">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">地圖圖例</h3>
                    <div className="space-y-2">
                        {(isAdmin || isContractor) && (
                            <>
                                {([
                                    {
                                        key: 'pending'    as LegendKey,
                                        label: isAdmin ? '未派案' : '待處理',
                                        dot: 'bg-red-500 ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                    },
                                    {
                                        key: 'processing' as LegendKey,
                                        label: isAdmin ? '已派案' : '執行中',
                                        dot: 'bg-orange-500 ring-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                                    },
                                    {
                                        key: 'resolved'   as LegendKey,
                                        label: isAdmin ? '結案' : '已結案',
                                        dot: 'bg-emerald-500 ring-emerald-500/30'
                                    },
                                ]).map(({ key, label, dot }) => {
                                    const active = legendFilter.has(key);
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => toggleLegendKey(key)}
                                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all text-left group ${active ? 'hover:bg-white/5' : 'opacity-40 hover:opacity-60'}`}
                                            title={active ? '點擊隱藏' : '點擊顯示'}
                                        >
                                            <span className={`w-3 h-3 rounded-full ring-2 shrink-0 ${dot} ${active ? '' : 'grayscale'}`}></span>
                                            <span className="text-sm font-bold text-white">{label}</span>
                                            {!active && <span className="ml-auto text-[10px] text-slate-500 font-bold">隱藏</span>}
                                        </button>
                                    );
                                })}
                            </>
                        )}
                        {/* 民眾端才顯示危險熱點與守護範圍 */}
                        {!isAdmin && !isContractor && (
                            <>
                                <button
                                    onClick={() => setShowHotspots(v => !v)}
                                    className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all text-left group ${showHotspots ? 'hover:bg-white/5' : 'opacity-40 hover:opacity-60'}`}
                                    title={showHotspots ? '點擊隱藏' : '點擊顯示'}
                                >
                                    <span className={`w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.5)] shrink-0 ${showHotspots ? '' : 'grayscale'}`}></span>
                                    <span className="text-sm font-bold text-white">危險熱點預警</span>
                                    {!showHotspots && <span className="ml-auto text-[10px] text-slate-500 font-bold">隱藏</span>}
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all group"
                                    onClick={() => { setShowGuardianPanel(true); setShowFilterPanel(false); setIsAddingZone(false); }}
                                >
                                    <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500/30 shrink-0"></span>
                                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {zones.length > 0 ? `守護範圍 (${zones.length})` : '新增守護訂閱'}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Admin: Filter Panel — desktop */}
                {isAdmin && showFilterPanel && (
                    <div className="hidden lg:block absolute bottom-6 left-[280px] z-[1000]">
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl p-6 w-72">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-black text-white tracking-tighter">案件篩選</h3>
                                <button
                                    onClick={() => { setFilterType('all'); setFilterStatus('all'); }}
                                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    清除篩選
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">案件類型</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {(['all', 'bee', 'general'] as CaseTypeFilter[]).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFilterType(t)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                {t === 'all' ? '全部' : t === 'bee' ? '捕蜂抓蛇' : '一般救援'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">處理狀態</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {(['all', 'pending', 'processing', 'resolved'] as StatusFilter[]).map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setFilterStatus(s)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                {s === 'all' ? '全部' : STATUS_LABEL[s as CaseMarker['status']]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                                    <MapPin size={12} />
                                    顯示 {filteredCases.length} / {cases.length} 筆案件
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Quick Report Widget — desktop (public only, not admin or contractor) */}
                {!isAdmin && !isContractor && (
                    <div className="hidden lg:block absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[280px] group overflow-hidden">
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
                                    <Link to="/report/general" className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item" title="一般救援">
                                        <AlertCircle size={18} className="text-red-400 group-hover/item:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black text-slate-400">救援</span>
                                    </Link>
                                    <Link to="/report/bee" className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item" title="捕蜂抓蛇">
                                        <Zap size={18} className="text-orange-400 group-hover/item:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black text-slate-400">捕蜂</span>
                                    </Link>
                                    <Link to="/report/general" className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 group/item" title="影像上傳">
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
                )}

                {/* Contractor My Tasks Widget — desktop */}
                {isContractor && (
                    <div className="hidden lg:block absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[260px]">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">我的派工</div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {cases.length === 0 && (
                                <div className="text-center py-6 text-slate-500 text-sm">目前無派工任務</div>
                            )}
                            {cases.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => selectCase(c.id)}
                                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border transition-all active:scale-[0.98] text-left ${selectedCaseId === c.id ? 'bg-white/15 border-white/20 ring-1 ring-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                >
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${c.status === 'pending' ? 'bg-red-500' : c.status === 'processing' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[12px] font-bold text-white truncate">{c.title}</div>
                                        <div className="text-[10px] text-slate-400 truncate">{c.address}</div>
                                    </div>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0 ${STATUS_COLOR[c.status]}`}>
                                        {STATUS_LABEL[c.status]}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                            共 {cases.length} 筆派工任務
                        </div>
                    </div>
                )}

                {/* Admin Quick Report Widget — desktop */}
                {isAdmin && (
                    <div className="hidden lg:block absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[260px]">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">案件摘要</div>
                        <div className="space-y-2">
                            {(['pending', 'processing', 'resolved'] as CaseMarker['status'][]).map(s => {
                                const count = cases.filter(c => c.status === s).length;
                                return (
                                    <div key={s} className="flex items-center justify-between">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${STATUS_COLOR[s]}`}>
                                            {STATUS_LABEL[s]}
                                        </span>
                                        <span className="text-sm font-black text-white">{count} 件</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            共 {cases.length} 筆案件已載入
                        </div>
                    </div>
                )}
            </div>

            {/* ===== MOBILE BOTTOM ACTION BAR ===== */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1500] bg-slate-900/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
                <div className="flex items-center justify-around px-4 py-3 gap-2">
                    {/* Legend */}
                    <button
                        onClick={() => setActiveSheet(activeSheet === 'legend' ? null : 'legend')}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeSheet === 'legend' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                    >
                        <BookOpen size={20} />
                        <span className="text-[10px] font-bold">圖例</span>
                    </button>

                    {/* Center main action */}
                    {isAdmin ? (
                        <button
                            onClick={() => setActiveSheet(activeSheet === 'cases' ? null : 'cases')}
                            className="relative flex flex-col items-center gap-1 px-6 py-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                        >
                            <List size={22} />
                            <span className="text-[10px] font-black">案件</span>
                            {activeCasesCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[9px] font-black text-white">
                                        {activeCasesCount > 9 ? '9+' : activeCasesCount}
                                    </span>
                                </span>
                            )}
                        </button>
                    ) : isContractor ? (
                        <button
                            onClick={() => setActiveSheet(activeSheet === 'cases' ? null : 'cases')}
                            className="relative flex flex-col items-center gap-1 px-6 py-2.5 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
                        >
                            <List size={22} />
                            <span className="text-[10px] font-black">我的案件</span>
                            {activeCasesCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[9px] font-black text-white">
                                        {activeCasesCount > 9 ? '9+' : activeCasesCount}
                                    </span>
                                </span>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveSheet(activeSheet === 'report' ? null : 'report')}
                            className="flex flex-col items-center gap-1 px-6 py-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                        >
                            <Zap size={22} className="animate-pulse" />
                            <span className="text-[10px] font-black">快速通報</span>
                        </button>
                    )}

                    {/* Guardian (public only) */}
                    {!isContractor && (
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
                    )}
                </div>
            </div>

            {/* ===== MOBILE BOTTOM SHEETS ===== */}

            {/* Legend Sheet */}
            <BottomSheet isOpen={isMobile && activeSheet === 'legend'} onClose={closeSheet} title="地圖圖例" snapPoints={['half']} defaultSnap="half">
                <div className="px-5 py-4 space-y-4">
                    {/* 承辦人 / 外包人員：案件 pin 圖例 */}
                    {(isAdmin || isContractor) && (
                        <>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <span className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.4)] shrink-0"></span>
                                <div>
                                    <div className="text-sm font-bold text-white">{isAdmin ? '未派案' : '待處理'}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">{isAdmin ? '尚未指派處理人員' : '尚未開始執行的任務'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <span className="w-4 h-4 rounded-full bg-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.4)] shrink-0"></span>
                                <div>
                                    <div className="text-sm font-bold text-white">{isAdmin ? '已派案' : '執行中'}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">{isAdmin ? '已指派人員出勤中' : '已出勤處理中'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <span className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 shrink-0"></span>
                                <div>
                                    <div className="text-sm font-bold text-white">{isAdmin ? '結案' : '已結案'}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">處理完畢已結案</div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* 民眾端：熱點與守護範圍 */}
                    {!isAdmin && !isContractor && (
                        <>
                            <button
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:bg-white/10 ${showHotspots ? 'bg-white/5' : 'bg-white/5 opacity-50'}`}
                                onClick={() => setShowHotspots(v => !v)}
                            >
                                <span className={`w-4 h-4 rounded-full bg-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.5)] shrink-0 ${showHotspots ? '' : 'grayscale'}`}></span>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-bold text-white">危險熱點預警</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">虎頭蜂、流浪犬等已知危險活躍區域</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">{showHotspots ? '顯示中' : '隱藏'}</span>
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 active:bg-white/10 transition-all"
                                onClick={() => { closeSheet(); setTimeout(() => openGuardianSheet(), 100); }}
                            >
                                <span className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-blue-500/30 shrink-0"></span>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-white">
                                        {zones.length > 0 ? `守護範圍 (${zones.length})` : '新增守護訂閱'}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                        {zones.length > 0 ? `查看 ${zones.length} 個守護範圍` : '點擊設定守護範圍通知'}
                                    </div>
                                </div>
                            </button>
                        </>
                    )}
                    <div className="pt-2 text-[11px] text-slate-500 text-center">點擊地圖上的熱點可查看詳細資訊</div>
                </div>
            </BottomSheet>

            {/* Quick Report Sheet (public only, not admin or contractor) */}
            {!isAdmin && !isContractor && (
                <BottomSheet isOpen={isMobile && activeSheet === 'report'} onClose={closeSheet} title="快速通報 AI 助理" snapPoints={['half', 'full']} defaultSnap="half">
                    <div className="px-5 py-4 space-y-4">
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                            <span className="text-xs font-bold text-emerald-300">AI 系統在線，支援即時影像辨識</span>
                        </div>
                        <Link to="/smart-guide" onClick={closeSheet} className="flex items-center justify-between w-full bg-white active:bg-blue-50 transition-all p-4 rounded-2xl shadow-lg group">
                            <div>
                                <div className="text-sm font-black text-slate-900 tracking-tighter">啟動智能引導報案</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">AI 引導完成報案流程</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                                <MessageSquare size={18} />
                            </div>
                        </Link>
                        <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">快速分類通報</div>
                            <div className="grid grid-cols-3 gap-3">
                                <Link to="/report/general" onClick={closeSheet} className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2">
                                    <AlertCircle size={22} className="text-red-400" />
                                    <span className="text-[11px] font-black text-slate-300">一般救援</span>
                                </Link>
                                <Link to="/report/bee" onClick={closeSheet} className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2">
                                    <Zap size={22} className="text-orange-400" />
                                    <span className="text-[11px] font-black text-slate-300">捕蜂抓蛇</span>
                                </Link>
                                <Link to="/report/general" onClick={closeSheet} className="aspect-square rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 transition-all flex flex-col items-center justify-center gap-2">
                                    <Camera size={22} className="text-emerald-400" />
                                    <span className="text-[11px] font-black text-slate-300">影像上傳</span>
                                </Link>
                            </div>
                        </div>
                        <div className="pb-4 text-[11px] text-slate-500 text-center">通報後將由專業人員於 30 分鐘內回應</div>
                    </div>
                </BottomSheet>
            )}

            {/* Admin / Contractor Cases Sheet (mobile) */}
            {(isAdmin || isContractor) && (
                <BottomSheet
                    isOpen={isMobile && activeSheet === 'cases'}
                    onClose={closeSheet}
                    title={isContractor ? `我的派工（${cases.length} 筆）` : `案件清單（${filteredCases.length} 筆）`}
                    snapPoints={['half', 'full']}
                    defaultSnap="half"
                >
                    <div className="px-5 py-4 space-y-2 overflow-y-auto max-h-[calc(80vh-80px)]">
                        {(isContractor ? cases : filteredCases).length === 0 && (
                            <div className="text-center py-12 text-slate-500 text-sm">
                                {isContractor ? '目前無派工任務' : '無符合條件的案件'}
                            </div>
                        )}
                        {(isContractor ? cases : filteredCases).map(c => (
                            <div
                                key={c.id}
                                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5 active:bg-white/10 transition-all cursor-pointer"
                                onClick={() => {
                                    if (isAdmin) {
                                        closeSheet();
                                        setDispatchTarget(c);
                                    } else if (isContractor) {
                                        closeSheet();
                                        selectCase(c.id);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${c.status === 'pending' ? 'bg-red-500' : c.status === 'processing' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{c.title}</div>
                                        <div className="text-[11px] text-slate-400 truncate">{c.address}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border shrink-0 ${STATUS_COLOR[c.status]}`}>
                                    {STATUS_LABEL[c.status]}
                                </span>
                            </div>
                        ))}
                    </div>
                </BottomSheet>
            )}

            {/* Guardian Zone Sheet */}
            <BottomSheet isOpen={isMobile && activeSheet === 'guardian'} onClose={closeSheet} snapPoints={['half', 'full']} defaultSnap="half">
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

            {/* Guardian Alert Panel (both layouts) */}
            <GuardianAlertPanel
                alerts={guardianAlerts}
                isOpen={showAlertPanel}
                onClose={() => setShowAlertPanel(false)}
            />

            {/* Dispatch Dialog */}
            {dispatchTarget && (
                <DispatchDialog
                    caseItem={dispatchTarget}
                    onClose={() => setDispatchTarget(null)}
                />
            )}

        </div>
    );
};
