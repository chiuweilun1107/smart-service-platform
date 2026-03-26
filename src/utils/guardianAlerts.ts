import type { GuardianZone, GuardianZoneAlert } from '../types/guardianZone';
import type { CaseMarker, MapHotspot } from '../components/map/CaseMap';
import { haversineDistance, circlesOverlap } from './geoUtils';

export function computeGuardianAlerts(
  zones: GuardianZone[],
  cases: CaseMarker[],
  hotspots: MapHotspot[]
): GuardianZoneAlert[] {
  return zones.map((zone) => {
    const alertCases = cases
      .filter((c) => c.status !== 'resolved')
      .map((c) => {
        const dist = haversineDistance(
          zone.center[0],
          zone.center[1],
          c.lat,
          c.lng
        );
        return { case: c, distance: Math.round(dist) };
      })
      .filter(({ distance }) => distance <= zone.radius)
      .sort((a, b) => a.distance - b.distance)
      .map(({ case: c, distance }) => ({
        caseId: c.id,
        title: c.title,
        type: c.type,
        status: c.status,
        distance,
      }));

    const alertHotspots = hotspots
      .filter((h) =>
        circlesOverlap(
          [zone.center[0], zone.center[1]],
          zone.radius,
          [h.center[0], h.center[1]],
          h.radius
        )
      )
      .map((h) => ({
        hotspotId: h.id,
        message: h.message,
      }));

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      cases: alertCases,
      hotspots: alertHotspots,
    };
  });
}
