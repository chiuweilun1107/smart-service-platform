import React from 'react';
import { X, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import type { GuardianZoneAlert } from '../../types/guardianZone';

interface GuardianAlertPanelProps {
  alerts: GuardianZoneAlert[];
  isOpen: boolean;
  onClose: () => void;
}

const statusLabel: Record<string, string> = {
  pending: '待處理',
  processing: '處理中',
  resolved: '已結案',
};

const statusColor: Record<string, string> = {
  pending: 'bg-red-500/20 text-red-400 border-red-500/20',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
};

const typeIcon: Record<string, string> = {
  general: '🐾',
  bee: '🐝',
};

function formatDistance(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)}km`;
  return `${m}m`;
}

export const GuardianAlertPanel: React.FC<GuardianAlertPanelProps> = ({
  alerts,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const hasAnyAlert = alerts.some(
    (a) => a.cases.length > 0 || a.hotspots.length > 0
  );

  return (
    <div className="fixed inset-y-0 left-0 z-[2000] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-slate-950 border-r border-white/10 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-md border-b border-white/10 p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              守護範圍警報
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Guardian Zone Alerts
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {!hasAnyAlert ? (
            <div className="text-center py-12">
              <ShieldCheck
                size={48}
                className="mx-auto text-emerald-500 mb-3"
              />
              <h3 className="text-lg font-black text-white mb-1">一切安全</h3>
              <p className="text-sm text-slate-400">
                您的守護範圍目前沒有任何警報
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const count = alert.cases.length + alert.hotspots.length;
              if (count === 0) return null;

              return (
                <div key={alert.zoneId}>
                  {/* Zone Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-black text-white">
                      {alert.zoneName}
                    </h3>
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/20">
                      {count} 則警報
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Case Alerts */}
                    {alert.cases.map((c) => (
                      <div
                        key={c.caseId}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-lg shrink-0 mt-0.5">
                            {typeIcon[c.type] || '📋'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">
                              {c.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                  statusColor[c.status] || 'text-slate-400'
                                }`}
                              >
                                {statusLabel[c.status] || c.status}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                距中心 {formatDistance(c.distance)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Hotspot Alerts */}
                    {alert.hotspots.map((h) => (
                      <div
                        key={h.hotspotId}
                        className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle
                            size={16}
                            className="text-orange-400 shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="text-xs font-bold text-orange-300 flex items-center gap-1">
                              <Zap size={12} /> 危險熱點重疊
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                              {h.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
