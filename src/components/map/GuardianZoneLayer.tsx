import React from 'react';
import { Circle, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { GuardianZone, GuardianZoneAlert } from '../../types/guardianZone';

interface GuardianZoneLayerProps {
  zones: GuardianZone[];
  alerts: GuardianZoneAlert[];
}

const createGuardianLabelIcon = (name: string, hasAlert: boolean, alertCount: number) => {
  const alertBadge = hasAlert
    ? `<span style="background:rgba(239,68,68,0.9);color:white;padding:1px 6px;border-radius:10px;font-size:9px;margin-left:4px;font-weight:900;letter-spacing:0;">${alertCount}</span>`
    : '';
  const borderColor = hasAlert ? 'rgba(239,68,68,0.5)' : 'rgba(37,99,235,0.35)';
  const dotColor = hasAlert ? '#f87171' : '#60a5fa';
  const glowColor = hasAlert ? 'rgba(239,68,68,0.25)' : 'rgba(37,99,235,0.2)';

  return L.divIcon({
    html: `
      <div style="
        position: absolute;
        transform: translate(-50%, -50%);
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px 4px 8px;
        background: rgba(15,23,42,0.88);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid ${borderColor};
        border-radius: 20px;
        color: white;
        font-size: 11px;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 2px 16px ${glowColor}, 0 1px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
        font-family: system-ui, -apple-system, sans-serif;
        letter-spacing: 0.02em;
        pointer-events: none;
        user-select: none;
      ">
        <span style="
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${dotColor};
          flex-shrink: 0;
          box-shadow: 0 0 5px ${dotColor};
        "></span>
        ${name}${alertBadge}
      </div>
    `,
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

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
            <React.Fragment key={zone.id}>
              <Circle
                center={zone.center}
                radius={zone.radius}
                pathOptions={{
                  fillColor: hasAlert ? '#dc2626' : '#2563EB',
                  fillOpacity: hasAlert ? 0.08 : 0.05,
                  color: hasAlert ? '#ef4444' : '#3b82f6',
                  weight: 1.5,
                }}
              />
              <Marker
                position={zone.center}
                icon={createGuardianLabelIcon(zone.name, hasAlert, totalAlerts)}
              />
            </React.Fragment>
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
