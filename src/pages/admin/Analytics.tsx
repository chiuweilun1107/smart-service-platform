import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, MapPin, Calendar,
  ArrowUpRight, ArrowDownRight, Activity,
  PieChart, Layers, Target, Clock
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { Case } from '../../types/schema';

export function AnalyticsPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const caseList = await mockApi.getCases();
      setCases(caseList);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Processing Intelligence Data...</p>
      </div>
    );
  }

  const statusDistribution = [
    { name: 'Pending', count: cases.filter(c => c.status === 'pending').length, color: 'bg-indigo-600', icon: Clock },
    { name: 'In Progress', count: cases.filter(c => c.status === 'processing').length, color: 'bg-blue-500', icon: Activity },
    { name: 'Resolved', count: cases.filter(c => c.status === 'resolved').length, color: 'bg-emerald-500', icon: Target }
  ];

  const typeDistribution = [
    { name: 'General', count: cases.filter(c => c.type === 'general').length, trend: '+12%', up: true },
    { name: 'Bee/Snake', count: cases.filter(c => c.type === 'bee').length, trend: '-5%', up: false },
    { name: '1999 Civic', count: cases.filter(c => c.type === '1999').length, trend: '+3%', up: true },
    { name: '1959 Rescue', count: cases.filter(c => c.type === '1959').length, trend: '+20%', up: true }
  ];

  const topLocations = [
    { location: 'Banqiao District', count: 324, percent: 85 },
    { location: 'Sanchong District', count: 218, percent: 62 },
    { location: 'Xinzhuang District', count: 189, percent: 54 },
    { location: 'Zhonghe District', count: 145, percent: 41 },
    { location: 'Yonghe District', count: 112, percent: 32 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">統計引擎</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">分析</h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
            <option value="year">Past Fiscal Year</option>
          </select>
          <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
            <TrendingUp size={20} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '總案件數', value: cases.length, trend: '+8.4%', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: '解決率', value: '94.2%', trend: '+2.1%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '平均回應時間', value: '14m', trend: '-12.5%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '緊急操作', value: cases.filter(c => c.priority === 'critical').length, trend: '+0.0%', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="relative z-10">
              <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                <kpi.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black tracking-tighter text-slate-900">{kpi.value}</h3>
                <div className={`flex items-center text-[10px] font-black ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.trend}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Distribution Chart */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase">系統吞吐分佈</h3>
              <PieChart size={20} className="text-slate-300" />
            </div>

            <div className="space-y-10">
              {statusDistribution.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${item.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-widest text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status Node</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900 tabular-nums">{item.count}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Units</span>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-1000 shadow-sm`}
                      style={{ width: `${(item.count / cases.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-6">
              {typeDistribution.map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 tabular-nums">{t.count}</span>
                    <span className={`text-[8px] font-black p-0.5 rounded ${t.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspot Analysis */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden h-full">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-xl font-black tracking-tight uppercase">熱點指標</h3>
                  <MapPin size={20} className="text-indigo-500" />
                </div>

                <div className="space-y-10">
                  {topLocations.map((loc, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex justify-between items-baseline mb-3">
                        <p className="font-black text-xs uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{loc.location}</p>
                        <span className="text-xs font-mono font-bold text-slate-500">{loc.count}</span>
                      </div>
                      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-white transition-all duration-700"
                          style={{ width: `${loc.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Prediction Engine</p>
                    <p className="text-sm font-black uppercase tracking-tight">+15% Volume Next Quarter</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">Neural analysis suggests increased reporting density in eastern sectors due to seasonal shifts.</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
