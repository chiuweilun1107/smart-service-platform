import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle2, AlertCircle,
  UserPlus, ArrowRight, Calendar, UserCheck,
  Clock, RefreshCw, X
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { ProxyAssignment, User } from '../../types/schema';

export function ProxyPage() {
  const [proxies, setProxies] = useState<ProxyAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    reason: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [proxyList, userList] = await Promise.all([
        mockApi.getProxies(),
        mockApi.getUsers({ role: 'caseworker' })
      ]);
      setProxies(proxyList);
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setFormData({ from: '', to: '', reason: '', startDate: '', endDate: '' });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Authenticating Delegation Chain...</p>
      </div>
    );
  }

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">權限管理</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">授權</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} /> 指派代理
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '活躍代理', value: proxies.filter(p => p.status === 'active').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '已過期連鎖', value: proxies.filter(p => p.status === 'expired').length, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50' },
          { label: '涉及人員', value: new Set([...proxies.map(p => p.from), ...proxies.map(p => p.to)]).size, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">授權登記簿</h3>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-900"><RefreshCw size={16} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">授權來源</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">代理目標</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">期間週期</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">完整性雜湊</th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">控制</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {proxies.map(proxy => (
                <tr key={proxy.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {getUserName(proxy.from).substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-black text-xs text-slate-900 uppercase tracking-tighter">{getUserName(proxy.from)}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Issuer</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xs">
                        {getUserName(proxy.to).substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-black text-xs text-slate-900 uppercase tracking-tighter">{getUserName(proxy.to)}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Delegated</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{proxy.startDate}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Through {proxy.endDate}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${proxy.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse'
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${proxy.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      {proxy.status === 'active' ? 'Operational' : 'Terminated'}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit2 size={14} /></button>
                      <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">建立授權</h2>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">臨時權限轉移</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Issuer (From)</label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={formData.from}
                    onChange={e => setFormData({ ...formData, from: e.target.value })}
                  >
                    <option value="">Select Origin</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Proxy (To)</label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={formData.to}
                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                  >
                    <option value="">Select Target</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Cycle</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Cycle</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mission Justification</label>
                <textarea
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-600 transition-all min-h-[100px]"
                  placeholder="Specify the reason for authority transfer..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                Establish Secure Chain
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
