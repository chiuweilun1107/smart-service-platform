import type { LatLngTuple } from 'leaflet';

export interface GuardianZone {
  id: string;
  name: string;
  center: LatLngTuple;
  radius: 500 | 1000 | 2000;
  visible: boolean;
  createdAt: string;
}

export interface GuardianZoneAlertCase {
  caseId: string;
  title: string;
  type: 'general' | 'bee';
  status: string;
  distance: number;
}

export interface GuardianZoneAlertHotspot {
  hotspotId: string;
  message: string;
}

export interface GuardianZoneAlert {
  zoneId: string;
  zoneName: string;
  cases: GuardianZoneAlertCase[];
  hotspots: GuardianZoneAlertHotspot[];
}
