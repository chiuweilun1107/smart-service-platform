import { useEffect, useState } from 'react';
import {
  RefreshCw, Settings, AlertCircle, CheckCircle2,
  Link2, Zap, Shield, Cpu, ExternalLink,
  Terminal, Globe, Activity, ArrowRight, Edit3
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { IntegrationConfig } from '../../types/schema';
import { TextInput } from '../../components/common';

export function IntegrationPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getIntegrations();
      setIntegrations(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(integrations.map(i =>
        i.id === id ? { ...i, lastSync: new Date().toISOString() } : i
      ));
    } finally {
      setSyncingId(null);
    }
  };

  const selectedIntegration = integrations.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">系統連線中...</p>
      </div>
    );
  }

  const integrationTypeLabels: Record<string, string> = {
    '1999': '1999 市政服務',
    'agriculture': '寵物登記系統 v3.0',
    'finance': '財稅帳務系統',
    'document': '公文歸檔系統',
    'gis': 'GIS 圖資平台'
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">網路架構</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">介接</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-xs">閘道連線中</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Integration List Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">外部樞紐</h3>
              <button className="text-indigo-600"><Settings size={14} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {integrations.map(int => (
                <button
                  key={int.id}
                  onClick={() => setSelectedId(int.id)}
                  className={`w-full text-left px-8 py-6 transition-all group relative overflow-hidden ${selectedId === int.id ? 'bg-white' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-all ${selectedId === int.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                        }`}>
                        <Cpu size={18} />
                      </div>
                      <div>
                        <p className={`font-black text-sm uppercase tracking-tight ${selectedId === int.id ? 'text-slate-900' : 'text-slate-500'}`}>
                          {integrationTypeLabels[int.type] || int.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'connected' ? 'bg-green-500' :
                            int.status === 'disconnected' ? 'bg-slate-300' :
                              int.status === 'suspended' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {int.status === 'connected' ? '已穩定' :
                              int.status === 'suspended' ? '暫停中' :
                                int.status === 'disconnected' ? '離線' : '異常'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`transition-all ${selectedId === int.id ? 'text-indigo-600 opacity-100 translate-x-0' : 'text-slate-200 opacity-0 -translate-x-2'}`} />
                  </div>
                  {selectedId === int.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Network Stats Card */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">全域傳輸流量</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums">1.2GB</span>
                <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">/ 秒</span>
              </div>
              <div className="mt-6 flex gap-1 h-1.5">
                {[30, 70, 45, 90, 65, 80, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-full transition-all duration-1000" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5" />
          </div>
        </div>

        {/* Integration Details Canvas */}
        <div className="lg:col-span-8">
          {selectedIntegration && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shrink-0">
                    <Globe size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none mb-2">{selectedIntegration.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500 uppercase tracking-wider">{integrationTypeLabels[selectedIntegration.type]}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {
                          selectedIntegration.configuration.format
                            ? `資料交換格式: ${selectedIntegration.configuration.format}`
                            : '通訊協定 V2.1'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => handleSync(selectedIntegration.id)}
                    disabled={syncingId === selectedIntegration.id}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-slate-300"
                  >
                    <RefreshCw size={16} className={syncingId === selectedIntegration.id ? 'animate-spin' : ''} />
                    {syncingId === selectedIntegration.id ? '同步中...' : '強制基線'}
                  </button>
                  <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Settings size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">介接端點 (Endpoint)</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-mono font-bold text-slate-700 truncate">{selectedIntegration.endpoint}</p>
                    <ExternalLink size={16} className="text-slate-400 flex-shrink-0" />
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">最後連線</p>
                  <p className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {selectedIntegration.lastSync ? new Date(selectedIntegration.lastSync).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Visualized Management Interface */}
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">環境參數配置與管理</h4>
                  <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors">
                    <Edit3 size={12} /> 編輯參數
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  {Object.entries(selectedIntegration.configuration).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{key}</label>
                      <div className="relative">
                        <TextInput
                          type="text"
                          value={String(value)}
                          readOnly
                          className="font-mono pr-8"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                          <Terminal size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 border-dashed flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Link2 size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black tracking-tight text-slate-900 uppercase">連線已驗證</h4>
                  <p className="text-sm text-slate-500">所有安全握手已執行，資料完整性驗證通過。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
