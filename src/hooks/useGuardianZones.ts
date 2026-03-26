import { useState, useEffect, useCallback } from 'react';
import type { GuardianZone } from '../types/guardianZone';

const STORAGE_KEY = 'guardian-zones';
const MAX_ZONES = 3;

function loadZones(): GuardianZone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GuardianZone[];
  } catch {
    return [];
  }
}

function saveZones(zones: GuardianZone[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
}

export function useGuardianZones() {
  const [zones, setZones] = useState<GuardianZone[]>(loadZones);

  useEffect(() => {
    saveZones(zones);
  }, [zones]);

  const addZone = useCallback(
    (name: string, center: [number, number], radius: 500 | 1000 | 2000) => {
      setZones((prev) => {
        if (prev.length >= MAX_ZONES) return prev;
        const newZone: GuardianZone = {
          id: `gz-${Date.now()}`,
          name,
          center,
          radius,
          visible: true,
          createdAt: new Date().toISOString(),
        };
        return [...prev, newZone];
      });
    },
    []
  );

  const removeZone = useCallback((id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, visible: !z.visible } : z))
    );
  }, []);

  const canAdd = zones.length < MAX_ZONES;

  return { zones, addZone, removeZone, toggleVisibility, canAdd };
}
