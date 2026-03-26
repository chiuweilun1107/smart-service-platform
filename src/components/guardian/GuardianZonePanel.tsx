import React from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  X,
  ShieldCheck,
} from 'lucide-react';
import type { GuardianZone, GuardianZoneAlert } from '../../types/guardianZone';

interface GuardianZonePanelProps {
  zones: GuardianZone[];
  alerts: GuardianZoneAlert[];
  canAdd: boolean;
  onStartAdd: () => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onOpenAlerts: () => void;
  onClose: () => void;
  variant?: 'floating' | 'sheet';
}

const radiusLabel = (r: number) => {
  if (r >= 1000) return `${r / 1000}km`;
  return `${r}m`;
};

export const GuardianZonePanel: React.FC<GuardianZonePanelProps> = ({
  zones,
  alerts,
  canAdd,
  onStartAdd,
  onDelete,
  onToggleVisibility,
  onOpenAlerts,
  onClose,
  variant = 'floating',
}) => {
  const isSheet = variant === 'sheet';
  const totalAlertCount = alerts.reduce(
    (sum, a) => sum + a.cases.length + a.hotspots.length,
    0
  );

  return (
    <div className={isSheet ? 'w-full overflow-hidden' : 'bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl w-[300px] overflow-hidden'}>
      {/* Header */}
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">
              我的守護範圍
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Guardian Zones
            </p>
          </div>
        </div>
        {!isSheet && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Alert Banner */}
      {totalAlertCount > 0 && (
        <div className="mx-5 mb-3">
          <button
            onClick={onOpenAlerts}
            className="w-full flex items-center gap-2 bg-red-500/15 border border-red-500/20 rounded-xl px-3 py-2.5 text-left hover:bg-red-500/25 transition-all group"
          >
            <Bell size={14} className="text-red-400 animate-pulse" />
            <span className="text-xs font-bold text-red-300 flex-1">
              {totalAlertCount} 則警報在您的守護範圍內
            </span>
            <span className="text-[10px] text-red-400 font-bold group-hover:translate-x-0.5 transition-transform">
              查看 →
            </span>
          </button>
        </div>
      )}

      {/* Zone List */}
      <div className="px-5 pb-3 space-y-2 max-h-[240px] overflow-y-auto">
        {zones.length === 0 ? (
          <div className="text-center py-6">
            <ShieldCheck
              size={32}
              className="mx-auto text-slate-600 mb-2"
            />
            <p className="text-xs text-slate-500 font-bold">
              尚未設定守護範圍
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              新增您的第一個守護範圍
            </p>
          </div>
        ) : (
          zones.map((zone) => {
            const alert = alerts.find((a) => a.zoneId === zone.id);
            const count =
              (alert?.cases.length ?? 0) + (alert?.hotspots.length ?? 0);

            return (
              <div
                key={zone.id}
                className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 group hover:border-white/10 transition-all"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    count > 0
                      ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      : 'bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.3)]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {radiusLabel(zone.radius)}
                    {count > 0 && (
                      <span className="ml-1.5 text-red-400 font-bold">
                        · {count} 則警報
                      </span>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1 transition-opacity ${isSheet ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button
                    onClick={() => onToggleVisibility(zone.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                    title={zone.visible ? '隱藏' : '顯示'}
                  >
                    {zone.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => onDelete(zone.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    title="刪除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Button */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={onStartAdd}
          disabled={!canAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            canAdd
              ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-600/20'
              : 'bg-white/5 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Plus size={16} />
          {canAdd
            ? '新增守護範圍'
            : `已達上限 (${zones.length}/3)`}
        </button>
      </div>
    </div>
  );
};
