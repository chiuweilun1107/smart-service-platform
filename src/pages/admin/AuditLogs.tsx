import { useEffect, useState } from 'react';
import {
  User, Search,
  Activity, Terminal, Shield,
  ChevronDown, ChevronUp, Database,
  AlertTriangle, Eye, Download, LogIn, ArrowRight
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { AuditLog, User as UserType } from '../../types/schema';

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterUser) filters.userId = filterUser;
      if (filterResource) filters.resource = filterResource;
      const [logData, userData] = await Promise.all([
        mockApi.getAuditLogs(filters),
        mockApi.getUsers()
      ]);
      setLogs(logData);
      setUsers(userData);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) =>
    users.find(u => u.id === userId)?.name || userId;

  const actionStyles: Record<string, string> = {
    'case:create': 'text-emerald-500 bg-emerald-50 border-emerald-100',
    'case:update': 'text-blue-500 bg-blue-50 border-blue-100',
    'case:delete': 'text-red-500 bg-red-50 border-red-100',
    'case:assign': 'text-indigo-500 bg-indigo-50 border-indigo-100',
    'auth:login': 'text-slate-500 bg-slate-100 border-slate-200',
    'pii:view': 'text-orange-500 bg-orange-50 border-orange-100',
    'report:export_batch': 'text-red-600 bg-red-50 border-red-200 ring-2 ring-red-100',
  };

  const actionLabels: Record<string, string> = {
    'case:create': '建立案件',
    'case:update': '更新案件',
    'case:delete': '刪除案件',
    'case:assign': '指派案件',
    'auth:login': '系統登入',
    'pii:view': '查閱個資',
    'report:export_batch': '大量匯出',
  };

  const ActionIcon = ({ action }: { action: string }) => {
    if (action.includes('login')) return <LogIn size={14} />;
    if (action.includes('export')) return <Download size={14} />;
    if (action.includes('pii')) return <Eye size={14} />;
    if (action.includes('delete')) return <AlertTriangle size={14} />;
    return <Activity size={14} />;
  };

  const securityAlerts = logs.filter(l => l.metadata?.alertLevel === 'high' || l.action.includes('pii'));

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">系統日誌解析中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700 h-full flex flex-col">
      {/* Header & Metrics Compact Row */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">不可變帳冊</div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">智慧檔案庫</h1>
          </div>

          {/* Mini Metrics - Moved here for compactness */}
          <div className="flex gap-4 pl-6 border-l border-slate-200 py-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={14} /></div>
              <div><div className="text-[9px] text-slate-400 font-black uppercase">今日</div><div className="text-sm font-black text-slate-900 leading-none">{logs.length}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><User size={14} /></div>
              <div><div className="text-[9px] text-slate-400 font-black uppercase">在線</div><div className="text-sm font-black text-slate-900 leading-none">12</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Database size={14} /></div>
              <div><div className="text-[9px] text-slate-400 font-black uppercase">保存</div><div className="text-sm font-black text-slate-900 leading-none">1.2K</div></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} className="text-blue-400" /> 安全協定啟用
          </div>
        </div>
      </div>

      {/* Security Alerts - Compact */}
      {securityAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-center gap-3 animate-in slide-in-from-top-4">
          <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-lg shrink-0">
            <AlertTriangle size={16} />
          </div>

          <div className="flex-1 flex items-center gap-4 overflow-x-auto">
            <div className="shrink-0">
              <h3 className="text-red-900 font-black text-xs">偵測到安全異常</h3>
            </div>
            <div className="flex gap-2">
              {securityAlerts.map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-[10px] font-bold text-red-700 bg-white/60 px-2 py-1 rounded border border-red-100 whitespace-nowrap">
                  <span className="uppercase">{actionLabels[alert.action] || alert.action}</span>
                  <ArrowRight size={8} className="text-red-300" />
                  <span>{getUserName(alert.userId)}</span>
                  <span className="text-red-300">|</span>
                  <span>{alert.metadata?.ip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar - Ultra Compact */}
      <div className="bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Search className="text-slate-300" size={16} />
          <input
            type="text"
            placeholder="搜尋審計流水、IP 或 ID..."
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full placeholder:text-slate-300"
          />
        </div>
        <div className="h-6 w-px bg-slate-100"></div>
        <div className="flex gap-2">
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <option value="">全部 (All)</option>
            <option value="case">案件</option>
            <option value="user">身份</option>
            <option value="workflow">流程</option>
          </select>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black hover:bg-slate-200 transition-colors">
            匯出
          </button>
        </div>
      </div>

      {/* Audit List Table - Dense Mode */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1 h-0"> {/* Scrollable area */}
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm">
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">時間</th>
                <th className="px-6 py-3">操作者 / IP</th>
                <th className="px-6 py-3 text-center">動作</th>
                <th className="px-6 py-3 text-center">對象</th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.metadata?.alertLevel === 'high' ? 'bg-red-500 animate-pulse' : 'bg-blue-300'}`}></div>
                        <div className="font-mono text-xs font-bold text-slate-700">
                          {new Date(log.timestamp).toLocaleTimeString('zh-TW', { hour12: false })}
                          <span className="text-[10px] text-slate-300 ml-2 font-black">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[10px]">
                          {log.userId === 'system' ? 'SYS' : log.userId[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 leading-none">{getUserName(log.userId)}</span>
                          <span className="text-[9px] font-mono text-slate-400 mt-0.5">{log.metadata?.ip}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded md border text-[10px] font-bold ${actionStyles[log.action] || 'text-slate-400 bg-slate-50'}`}>
                        <ActionIcon action={log.action} />
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-center">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {log.resourceId}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-right">
                      <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ml-auto ${expandedId === log.id ? 'rotate-180' : ''}`} />
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr className="bg-slate-50/50 shadow-inner">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex gap-4">
                          {/* Diff Viewer - Left */}
                          {log.changes && (
                            <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                              <div className="px-4 py-2 bg-slate-100 text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Activity size={12} /> 資料異動比對
                              </div>
                              <div className="grid grid-cols-2 divide-x divide-slate-100">
                                <div className="p-3 bg-red-50/30">
                                  <div className="text-[9px] font-black text-red-300 mb-1">BEFORE</div>
                                  <pre className="text-[10px] font-mono text-red-800 break-all whitespace-pre-wrap">{JSON.stringify(log.changes.before, null, 2)}</pre>
                                </div>
                                <div className="p-3 bg-emerald-50/30">
                                  <div className="text-[9px] font-black text-emerald-300 mb-1">AFTER</div>
                                  <pre className="text-[10px] font-mono text-emerald-800 break-all whitespace-pre-wrap">{JSON.stringify(log.changes.after || log.changes, null, 2)}</pre>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Metadata - Right */}
                          <div className="w-64 shrink-0 bg-white border border-slate-200 rounded-xl p-3 shadow-sm h-fit">
                            <div className="text-[10px] font-black text-slate-400 mb-2">METADATA</div>
                            <div className="space-y-2">
                              {Object.entries(log.metadata || {}).map(([k, v]) => (
                                <div key={k} className="flex justify-between items-start gap-2 border-b border-slate-50 pb-1 last:border-0">
                                  <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">{k}</span>
                                  <span className="text-[10px] font-mono text-slate-600 text-right break-all leading-tight">{typeof v === 'object' ? '...' : String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
