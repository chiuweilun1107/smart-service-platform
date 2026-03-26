import React from 'react';
import { Circle, Tooltip, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { GuardianZone, GuardianZoneAlert } from '../../types/guardianZone';

interface GuardianZoneLayerProps {
  zones: GuardianZone[];
  alerts: GuardianZoneAlert[];
}

export const GuardianZoneLayer: React.FC<GuardianZoneLayerProps> = ({
  zones,
  alerts,
}) => {
  return (
    <>
      {zones
        .filter((z) => z.visible)
        .map((zone) => {
          const alert = alerts.find((a) => a.zoneId === zone.id);
          const totalAlerts =
            (alert?.cases.length ?? 0) + (alert?.hotspots.length ?? 0);
          const hasAlert = totalAlerts > 0;

          return (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                fillColor: '#2563EB',
                fillOpacity: hasAlert ? 0.15 : 0.08,
                color: hasAlert ? '#dc2626' : '#2563EB',
                weight: 2,
              }}
            >
              <Tooltip
                permanent
                direction="center"
                className="guardian-zone-tooltip"
              >
                <span className="font-bold text-xs">
                  {zone.name}
                  {hasAlert && (
                    <span className="ml-1 text-red-600">({totalAlerts} ⚠)</span>
                  )}
                </span>
              </Tooltip>
            </Circle>
          );
        })}
    </>
  );
};

// Temporary marker shown when placing a new zone
interface PendingZoneMarkerProps {
  center: [number, number];
  radius: 500 | 1000 | 2000;
}

const pendingIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 0 8px rgba(37,99,235,0.6);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const PendingZoneMarker: React.FC<PendingZoneMarkerProps> = ({
  center,
  radius,
}) => {
  return (
    <>
      <Marker position={center} icon={pendingIcon} />
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          fillColor: '#2563EB',
          fillOpacity: 0.1,
          color: '#2563EB',
          weight: 2,
          dashArray: '8, 6',
        }}
      />
    </>
  );
};

// Map click handler for zone placement mode
interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

export const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  onMapClick,
}) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};
