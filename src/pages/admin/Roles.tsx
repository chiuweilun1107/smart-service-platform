import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, ChevronDown, Shield,
  Zap, Lock, CheckCircle2, MoreHorizontal,
  ArrowRight, UserCheck
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { Role } from '../../types/schema';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roleList, permList] = await Promise.all([
        mockApi.getRoles(),
        mockApi.getPermissions()
      ]);
      setRoles(roleList);
      setPermissions(permList);
      if (roleList.length > 0) setExpandedId(roleList[0].id);
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
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Authenticating Permission Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">安全架構</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">角色與權限</h1>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-all flex items-center gap-2">
          <Plus size={18} /> 新增角色
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Shield size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">角色總數</p>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900">{roles.length}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Lock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">權限總數</p>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900">{permissions.length}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">活躍權限</p>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900">{new Set(roles.flatMap(r => r.permissions)).size}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Role List Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">可用角色</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setExpandedId(role.id)}
                  className={`w-full text-left px-8 py-6 transition-all group relative overflow-hidden ${expandedId === role.id ? 'bg-white' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight ${expandedId === role.id ? 'text-slate-900' : 'text-slate-500'}`}>
                        {role.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {role.permissions.length} 項權限
                        </span>
                      </div>
                    </div>
                    <div className={`transition-all ${expandedId === role.id ? 'text-indigo-600 opacity-100 scale-110' : 'text-slate-200 opacity-0'}`}>
                      <Shield size={20} />
                    </div>
                  </div>
                  {expandedId === role.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Details Canvas */}
        <div className="lg:col-span-8">
          {expandedId && (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 animate-in slide-in-from-right-10 duration-500">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{roles.find(r => r.id === expandedId)?.name}</h2>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">存取級別</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{roles.find(r => r.id === expandedId)?.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Edit2 size={18} /></button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                </div>
              </div>

              {/* Group permissions by category */}
              <div className="space-y-8">
                {Object.entries(
                  (roles.find(r => r.id === expandedId)?.permissions || [])
                    .map(permId => permissions.find(p => p.id === permId))
                    .filter(Boolean)
                    .reduce((acc, perm) => {
                      if (!acc[perm!.category]) acc[perm!.category] = [];
                      acc[perm!.category].push(perm!);
                      return acc;
                    }, {} as Record<string, any[]>)
                ).map(([category, categoryPerms]) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-0.5 flex-1 bg-slate-100"></div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 whitespace-nowrap">
                        {category}
                      </span>
                      <div className="h-0.5 flex-1 bg-slate-100"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryPerms.map(perm => (
                        <div key={perm.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 hover:bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/5 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mt-1 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                            <Lock size={18} />
                          </div>
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest text-slate-900 mb-1">{perm.name}</p>
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{perm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Security Marker */}
              <div className="mt-12 p-8 bg-slate-950 rounded-[2rem] text-white flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">安全驗證</div>
                  <h4 className="text-lg font-black tracking-tight">SHA-256 協議已啟用</h4>
                  <p className="text-slate-400 text-xs font-mono mt-2">7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">指派用戶數</div>
                    <div className="text-2xl font-black">12.8k</div>
                  </div>
                  <UserCheck size={32} className="text-indigo-500" />
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[100px] rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
