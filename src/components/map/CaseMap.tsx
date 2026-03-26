import React from 'react';
import { Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createMapIcon } from '../../utils/mapIcons';
import { type LatLngTuple } from 'leaflet';
import type { GuardianZone, GuardianZoneAlert } from '../../types/guardianZone';
import { GuardianZoneLayer, PendingZoneMarker, MapClickHandler } from './GuardianZoneLayer';


export interface CaseMarker {
    id: string;
    lat: number;
    lng: number;
    type: 'general' | 'bee';
    title: string;
    status: 'pending' | 'processing' | 'resolved';
    address: string;
    reporter: string;
    photoUrl?: string; // Optional photo
    description?: string;
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
}) => {

    const getIconColor = (type: string, status: string) => {
        if (status === 'resolved') return 'green';
        if (type === 'bee') return 'orange';
        return 'red'; // general + pending/processing
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
            >
                {getTileLayer()}

                {cases.map((c) => (
                    <Marker
                        key={c.id}
                        position={[c.lat, c.lng]}
                        icon={createMapIcon(getIconColor(c.type, c.status) as any, 24)}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[240px] p-1">
                                {c.photoUrl && (
                                    <div className="mb-3 rounded-lg overflow-hidden relative aspect-video group">
                                        <img src={c.photoUrl} alt="現場照片" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${c.type === 'bee' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                    <span className="font-bold text-slate-800 text-sm">{c.type === 'bee' ? '蜂案通報' : '一般案件'}</span>
                                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-medium ${c.status === 'resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                                        c.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                            'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                        {c.status === 'resolved' ? '已結案' : c.status === 'processing' ? '處理中' : '待處理'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight tracking-tight">{c.title}</h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 shrink-0">地點</span>
                                        <span className="leading-relaxed">{c.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 shrink-0">通報</span>
                                        <span>{c.reporter}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleRoutePlanning(c.lat, c.lng)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                                    >
                                        路線規劃
                                    </button>
                                    <button
                                        onClick={() => handleDispatch(c.id, c.title)}
                                        className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all shadow-md active:scale-95"
                                    >
                                        指派任務
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {hotspots.map((h) => (
                    <Circle
                        key={h.id}
                        center={h.center}
                        radius={h.radius}
                        pathOptions={{
                            fillColor: h.color,
                            fillOpacity: 0.3,
                            color: h.color,
                            weight: 2,
                            dashArray: '5, 10'
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
