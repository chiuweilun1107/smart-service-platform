import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search, Filter, ArrowRight, Clock, CheckCircle,
    AlertCircle, MapPin, Calendar, MoreHorizontal,
    ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { WorkflowSidebar } from '../../components/WorkflowSidebar';
import { CaseDetailPanel } from '../../components/CaseDetailPanel';
import type { Case } from '../../types/schema';

export function CaseList() {
    const [searchParams] = useSearchParams();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
    const [filterPriority, setFilterPriority] = useState(searchParams.get('priority') || 'all');
    const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadCases = async () => {
            setLoading(true);
            try {
                const filters = {
                    status: filterStatus === 'all' ? undefined : filterStatus,
                    priority: filterPriority === 'all' ? undefined : filterPriority,
                };
                const data = await mockApi.getCases(filters);
                setCases(data);
            } catch (error) {
                console.error('Failed to load cases:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCases();
    }, [filterStatus, filterPriority]);

    const filteredCases = cases.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.reporterName?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-600';
            case 'high': return 'text-orange-600';
            case 'medium': return 'text-blue-600';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="flex h-full gap-0 animate-in fade-in duration-700">
            {/* Workflow Sidebar */}
            <WorkflowSidebar
                selectedCaseId={selectedCaseId}
                onSelectCase={setSelectedCaseId}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col gap-0">
                <div className="p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">運營中心</div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">案件管理</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all flex items-center gap-2">
                        + 新增案件錄案
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                        type="text"
                        placeholder="搜尋案號、標題或報案人姓名..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none transition-all font-bold text-sm"
                    />
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent border-none outline-none font-bold text-sm text-slate-600 cursor-pointer"
                        >
                            <option value="all">所有狀態</option>
                            <option value="pending">待處理</option>
                            <option value="processing">處理中</option>
                            <option value="resolved">已結案</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl">
                        <AlertCircle size={18} className="text-slate-400" />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-transparent border-none outline-none font-bold text-sm text-slate-600 cursor-pointer"
                        >
                            <option value="all">所有優先級</option>
                            <option value="critical">最緊急</option>
                            <option value="high">高</option>
                            <option value="medium">普通</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">案號 / 標題</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">狀態</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">優先權</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">地點 / 報案人</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">更新時間</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-8 py-10">
                                        <div className="h-6 bg-slate-100 rounded-lg w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredCases.length > 0 ? (
                            filteredCases.map((c) => (
                                <tr
                                    key={c.id}
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`cursor-pointer transition-colors group ${
                                        selectedCaseId === c.id
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <td className="px-8 py-8 w-[350px]">
                                        <div className="text-[10px] font-black text-blue-600 mb-1 font-mono">{c.id}</div>
                                        <div className="text-lg font-black text-slate-900 tracking-tight line-clamp-1">{c.title}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {c.type === 'bee' ? '蜂案捕捉' : '一般動保'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(c.status)}`}>
                                            {c.status === 'pending' ? <Clock size={12} /> : c.status === 'processing' ? <Zap size={12} /> : <CheckCircle size={12} />}
                                            {c.status === 'pending' ? '待處理' : c.status === 'processing' ? '處理中' : '已結案'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className={`text-xs font-black uppercase tracking-[0.2em] ${getPriorityStyle(c.priority)}`}>
                                            {c.priority}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-1">
                                            <MapPin size={14} className="text-slate-300" />
                                            <span className="line-clamp-1">{c.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400">
                                            報案人: {c.reporterName}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <Calendar size={14} className="text-slate-300 mb-1" />
                                            <div className="text-[10px] font-bold text-slate-500">{new Date(c.updatedAt).toLocaleDateString()}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/cases/${c.id}`}
                                                className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                            >
                                                <ArrowRight size={18} />
                                            </Link>
                                            <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-32 text-center">
                                    <div className="flex flex-col items-center opacity-20">
                                        <Search size={64} className="mb-4" />
                                        <p className="text-2xl font-black">找不到相符的案件</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-8 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        顯示 {filteredCases.length} 筆 / 共 {cases.length} 筆
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1 mx-2">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-8 h-8 rounded-lg text-xs font-black ${p === 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'}`}>{p}</button>
                            ))}
                        </div>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
                </div>
            </div>

            {/* Case Detail Panel */}
            <CaseDetailPanel
                caseId={selectedCaseId}
                onClose={() => setSelectedCaseId(undefined)}
            />
        </div>
    );
}
