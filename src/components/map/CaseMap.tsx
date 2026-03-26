import React, { useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createMapIcon } from '../../utils/mapIcons';
import { type LatLngTuple, type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet';
import type { GuardianZone, GuardianZoneAlert } from '../../types/guardianZone';
import { GuardianZoneLayer, PendingZoneMarker, MapClickHandler } from './GuardianZoneLayer';

const createHotspotPingIcon = (color: string) => L.divIcon({
  html: `
    <div style="position:absolute;top:0;left:0;width:0;height:0;overflow:visible;">
      <div style="position:absolute;width:24px;height:24px;top:-12px;left:-12px;border-radius:50%;border:1.5px solid ${color};opacity:0.6;animation:hotspot-ping 2.4s ease-out infinite;"></div>
      <div style="position:absolute;width:24px;height:24px;top:-12px;left:-12px;border-radius:50%;border:1.5px solid ${color};opacity:0.6;animation:hotspot-ping 2.4s ease-out infinite;animation-delay:0.8s;"></div>
      <div style="position:absolute;width:24px;height:24px;top:-12px;left:-12px;border-radius:50%;border:1.5px solid ${color};opacity:0.6;animation:hotspot-ping 2.4s ease-out infinite;animation-delay:1.6s;"></div>
      <div style="position:absolute;width:10px;height:10px;top:-5px;left:-5px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}99,0 0 16px ${color}44;"></div>
    </div>
  `,
  className: '',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Captures the Leaflet map instance and passes it up
const MapRefCapture: React.FC<{ onReady: (map: LeafletMap) => void }> = ({ onReady }) => {
    const map = useMap();
    useEffect(() => { onReady(map); }, [map, onReady]);
    return null;
};

// Flies to the selected case and opens its popup
const FlyToCase: React.FC<{
    selectedCaseId: string | null;
    cases: CaseMarker[];
    markersRef: React.MutableRefObject<Record<string, LeafletMarker>>;
}> = ({ selectedCaseId, cases, markersRef }) => {
    const map = useMap();
    useEffect(() => {
        if (!selectedCaseId) return;
        const c = cases.find(c => c.id === selectedCaseId);
        if (!c) return;
        map.flyTo([c.lat, c.lng], 16, { duration: 0.8 });
        const t = setTimeout(() => markersRef.current[selectedCaseId]?.openPopup(), 900);
        return () => clearTimeout(t);
    }, [selectedCaseId]); // eslint-disable-line react-hooks/exhaustive-deps
    return null;
};


export interface CaseMarker {
    id: string;
    lat: number;
    lng: number;
    type: 'general' | 'bee';
    title: string;
    status: 'pending' | 'processing' | 'resolved';
    address: string;
    reporter: string;
    photoUrl?: string;
    description?: string;
    assignedTo?: string; // contractor ID assigned to this case
}

export interface MapHotspot {
    id: string;
    center: LatLngTuple;
    radius: number;
    color: string;
    message: string;
}

interface CaseMapProps {
    cases: CaseMarker[];
    activeLayer?: 'osm' | 'satellite' | 'dark';
    hotspots?: MapHotspot[];
    onHotspotClick?: (message: string) => void;
    guardianZones?: GuardianZone[];
    guardianAlerts?: GuardianZoneAlert[];
    isAddingZone?: boolean;
    onMapClickForZone?: (lat: number, lng: number) => void;
    pendingZoneCenter?: [number, number] | null;
    pendingZoneRadius?: 500 | 1000 | 2000;
    onMapReady?: (map: LeafletMap) => void;
    selectedCaseId?: string | null;
    isContractor?: boolean;
    onStatusUpdate?: (id: string, newStatus: CaseMarker['status']) => void;
    onOpenReport?: (caseItem: CaseMarker) => void;
}

const DEFAULT_CENTER: LatLngTuple = [25.0118, 121.4658];

export const CaseMap: React.FC<CaseMapProps> = ({
    cases,
    activeLayer = 'osm',
    hotspots = [],
    onHotspotClick,
    guardianZones = [],
    guardianAlerts = [],
    isAddingZone = false,
    onMapClickForZone,
    pendingZoneCenter,
    pendingZoneRadius = 1000,
    onMapReady,
    selectedCaseId = null,
    isContractor = false,
    onStatusUpdate,
    onOpenReport,
}) => {

    const markersRef = useRef<Record<string, LeafletMarker>>({});

    const getIconColor = (status: string) => {
        if (status === 'resolved')   return 'green';
        if (status === 'processing') return 'orange';
        return 'red'; // pending
    };

    const handleRoutePlanning = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    const handleDispatch = (id: string, title: string) => {
        const event = new CustomEvent('open-dispatch-dialog', { detail: { id, title } });
        window.dispatchEvent(event);
    };

    const handleHotspotInteraction = (message: string) => {
        if (onHotspotClick) {
            onHotspotClick(message);
        } else {
            const event = new CustomEvent('trigger-ai-warning', { detail: { message } });
            window.dispatchEvent(event);
        }
    };

    const getTileLayer = () => {
        switch (activeLayer) {
            case 'satellite':
                return (
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                );
            case 'dark':
                return (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                );
            case 'osm':
            default:
                return (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                );
        }
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-md">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                {onMapReady && <MapRefCapture onReady={onMapReady} />}
                <FlyToCase selectedCaseId={selectedCaseId} cases={cases} markersRef={markersRef} />
                {getTileLayer()}

                {cases.map((c) => (
                    <Marker
                        key={c.id}
                        position={[c.lat, c.lng]}
                        icon={createMapIcon(getIconColor(c.status) as any, 24)}
                        ref={(el) => { if (el) markersRef.current[c.id] = el; else delete markersRef.current[c.id]; }}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[240px] p-1">
                                {c.photoUrl && (
                                    <div className="mb-3 rounded-lg overflow-hidden relative aspect-video group">
                                        <img src={c.photoUrl} alt="現場照片" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                )}

                                {/* Header — dot color matches pin (status-based) */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                                        c.status === 'resolved' ? 'bg-emerald-500' :
                                        c.status === 'processing' ? 'bg-orange-500' : 'bg-red-500'
                                    }`}></span>
                                    <span className="font-bold text-slate-800 text-sm">{c.type === 'bee' ? '蜂案通報' : '一般案件'}</span>
                                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                                        c.status === 'resolved'   ? 'bg-green-50 border-green-200 text-green-700' :
                                        c.status === 'processing' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                                                    'bg-red-50 border-red-200 text-red-700'
                                    }`}>
                                        {c.status === 'resolved' ? '已結案' :
                                         c.status === 'processing' ? (isContractor ? '執行中' : '已派案') :
                                         (isContractor ? '待處理' : '未派案')}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight tracking-tight">{c.title}</h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 shrink-0">地點</span>
                                        <span className="leading-relaxed">{c.address}</span>
                                    </div>
                                    {/* Contractor sees case ID; admin sees reporter */}
                                    {isContractor ? (
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className="font-bold text-slate-400 shrink-0">案件</span>
                                            <span className="font-mono text-slate-400">{c.id}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className="font-bold text-slate-400 shrink-0">通報</span>
                                            <span>{c.reporter}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleRoutePlanning(c.lat, c.lng)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                                    >
                                        路線規劃
                                    </button>

                                    {/* Admin: 指派任務 */}
                                    {!isContractor && (
                                        <button
                                            onClick={() => handleDispatch(c.id, c.title)}
                                            className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all shadow-md active:scale-95"
                                        >
                                            指派任務
                                        </button>
                                    )}

                                    {/* Contractor: status-based action */}
                                    {isContractor && c.status === 'pending' && (
                                        <button
                                            onClick={() => onStatusUpdate?.(c.id, 'processing')}
                                            className="flex-1 bg-orange-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-orange-400 transition-all shadow-md active:scale-95"
                                        >
                                            開始執行
                                        </button>
                                    )}
                                    {isContractor && c.status === 'processing' && (
                                        <button
                                            onClick={() => onOpenReport?.(c)}
                                            className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-500 transition-all shadow-md active:scale-95"
                                        >
                                            完成回報
                                        </button>
                                    )}
                                    {isContractor && c.status === 'resolved' && (
                                        <button
                                            disabled
                                            className="flex-1 bg-slate-100 text-slate-400 text-xs font-bold py-2 rounded-lg cursor-not-allowed"
                                        >
                                            已完成
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {hotspots.map((h) => (
                    <React.Fragment key={h.id}>
                        <Circle
                            center={h.center}
                            radius={h.radius}
                            pathOptions={{
                                fillColor: h.color,
                                fillOpacity: 0.07,
                                color: h.color,
                                weight: 1,
                            }}
                            eventHandlers={{
                                click: () => handleHotspotInteraction(h.message)
                            }}
                        >
                            <Popup>
                                <div className="p-2">
                                    <div className="text-orange-600 font-black flex items-center gap-1 mb-1">
                                        <Zap size={14} /> 警告區域
                                    </div>
                                    <div className="text-xs font-bold text-slate-700">
                                        此處為虎頭蜂活躍熱點，請小心經過。
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                        <Marker
                            position={h.center}
                            icon={createHotspotPingIcon(h.color)}
                            eventHandlers={{
                                click: () => handleHotspotInteraction(h.message)
                            }}
                        />
                    </React.Fragment>
                ))}

                {/* Guardian Zones */}
                <GuardianZoneLayer zones={guardianZones} alerts={guardianAlerts} />

                {/* Zone placement mode */}
                {isAddingZone && onMapClickForZone && (
                    <MapClickHandler onMapClick={onMapClickForZone} />
                )}
                {pendingZoneCenter && (
                    <PendingZoneMarker center={pendingZoneCenter} radius={pendingZoneRadius} />
                )}
            </MapContainer>
        </div>
    );
};
