import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createMapIcon } from '../../utils/mapIcons';
import { type LatLngTuple } from 'leaflet';
import { MapPin } from 'lucide-react';

interface MapPickerProps {
    initialPosition?: { lat: number; lng: number };
    onLocationSelect: (lat: number, lng: number) => void;
}

// Center of New Taipei City (Approx)
const DEFAULT_CENTER: LatLngTuple = [25.0118, 121.4658];
const DEFAULT_ZOOM = 13;

const LocationMarker: React.FC<{
    position: LatLngTuple | null;
    setPosition: (pos: LatLngTuple) => void;
    onSelect: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onSelect }) => {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onSelect(lat, lng);
            map.flyTo([lat, lng], map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={createMapIcon('blue', 32)} />
    );
};

export const MapPicker: React.FC<MapPickerProps> = ({ initialPosition, onLocationSelect }) => {
    const [position, setPosition] = useState<LatLngTuple | null>(
        initialPosition ? [initialPosition.lat, initialPosition.lng] : null
    );

    // Fix for Leaflet maps not rendering correctly in some containers without explicit height
    // Handled by parent CSS usually, but here ensure full height

    return (
        <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
                center={initialPosition ? [initialPosition.lat, initialPosition.lng] : DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true} // Enable scroll zoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onSelect={onLocationSelect} />
            </MapContainer>

            {/* Instructional Overlay */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded shadow text-xs text-slate-600 z-[1000] pointer-events-none">
                <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-primary-600" />
                    <span>點擊地圖以選擇位置</span>
                </div>
            </div>
        </div>
    );
};
