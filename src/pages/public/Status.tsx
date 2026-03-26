import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common';
import { typo } from '../../utils/typography';

interface CaseStatus {
    id: string;
    type: string;
    status: 'pending' | 'processing' | 'resolved';
    createDate: string;
    location: string;
    description: string;
    timeline: {
        date: string;
        time: string;
        title: string;
        desc: string;
        done: boolean;
    }[];
}

export const Status: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [caseId, setCaseId] = useState(searchParams.get('id') || 'ANS-20231120001');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CaseStatus | null>(null);
    const [error, setError] = useState('');

    const mockFetchStatus = (id: string) => {
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (id.toUpperCase().startsWith('ANS-')) {
                setResult({
                    id: id.toUpperCase(),
                    type: '救援行動 / 動物保護',
                    status: 'processing',
                    createDate: '2023-11-20 14:30',
                    location: '新北市板橋區四川路一段 157 巷口',
                    description: '發現受傷貓咪，左前肢骨折，需緊急救援。現場已由民眾初步固定。',
                    timeline: [
                        { date: '2023-11-20', time: '14:30', title: '案件受理', desc: '案件受理：系統已接收您的通報資料，案號已生成並鏈接至地理資訊中心。', done: true },
                        { date: '2023-11-20', time: '14:45', title: '資料審核', desc: '初步審核：中心人員已審核資料內容，確認為緊急優先案件。', done: true },
                        { date: '2023-11-20', time: '15:10', title: '單位派勤', desc: '單位派勤：已指派最近之板橋區勤務小組前往，部署車號: ADC-8899。', done: true },
                        { date: '2023-11-20', time: '15:40', title: '現場處置', desc: '現場處置：勤務人員已抵達現場進行初步檢查與包紮處置。', done: true },
                        { date: '當前階段', time: '執行中', title: '醫療運送', desc: '醫療運送：動物正運送往合作之醫療機構進行近一步診治。', done: false },
                        { date: '-', time: '-', title: '任務完成', desc: '完成處置後將更新最終結案報告。', done: false }
                    ]
                });
            } else {
                setError('身分驗證失敗。系統查無此案件編號。');
                setResult(null);
            }
            setLoading(false);
        }, 1200);
    };

    useEffect(() => {
        if (searchParams.get('id')) {
            mockFetchStatus(searchParams.get('id')!);
        } else if (caseId === 'ANS-20231120001') {
            mockFetchStatus(caseId); // Auto-load demo on enter if ID matches default
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <div>
                <div className="max-w-6xl mx-auto">
                    {/* Header Command Area */}
                    <PageHeader
                        badge="案件查詢系統"
                        badgeColor="blue"
                        title={<>案件進度 <span className="text-blue-600">查詢中心</span></>}
                        subtitle="輸入案件編號，即時查詢處理進度與完整歷程紀錄。"
                        layout="split"
                    >
                        <div>
                            <div className="bg-white border-2 border-slate-200 p-1.5 rounded-2xl flex items-center shadow-sm">
                                <div className="relative flex-1 group pl-2">
                                    <input
                                        type="text"
                                        value={caseId}
                                        onChange={(e) => setCaseId(e.target.value)}
                                        placeholder="輸入案件編號..."
                                        className="w-full px-4 py-2.5 bg-transparent text-slate-900 font-black text-base tracking-tight outline-none placeholder:text-slate-300"
                                    />
                                </div>
                                <button
                                    onClick={() => mockFetchStatus(caseId)}
                                    disabled={!caseId || loading}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-slate-900 transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {loading ? '查詢中' : '查詢'}
                                </button>
                            </div>
                            {error && <p className="mt-6 text-red-600 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ml-6 text-sm">{error}</p>}
                        </div>
                    </PageHeader>

                    {!result && !loading && !error && (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl animate-in fade-in duration-500 bg-white">
                            <p className="text-base font-black text-slate-400 tracking-widest">請輸入案件編號開始查詢</p>
                        </div>
                    )}

                    {result && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            {/* Mission Intelligence Overlay */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                    {/* Blue accent top bar */}
                                    <div className="h-1 bg-blue-600 w-full"></div>
                                    <div className="flex flex-col md:flex-row">
                                        {/* Dark Left Panel */}
                                        <div className="bg-slate-900 p-6 md:p-8 flex flex-col items-center md:items-start text-center md:text-left md:w-72 flex-shrink-0">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-blue-300 rounded-full text-[10px] font-black tracking-widest mb-4 border border-white/10">
                                                即時狀態
                                            </div>
                                            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter text-white mb-1 leading-none break-all">{result.id}</h2>
                                            <div className="text-[10px] font-black text-white/30 tracking-[0.3em] mb-6">案件編號</div>
                                            <div className={`px-4 py-2.5 rounded-xl font-black text-sm tracking-tight ${result.status === 'processing' ? 'bg-blue-600 text-white' : result.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white'}`}>
                                                {result.status === 'processing' ? '執行中任務' : result.status === 'resolved' ? '已結案' : '待處理'}
                                            </div>
                                        </div>

                                        {/* Right Panel */}
                                        <div className="flex-1 p-6 md:p-8 space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 tracking-widest">地理位置</p>
                                                    <p className="text-base font-black text-slate-900 leading-tight">{result.location}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 tracking-widest">通報時間</p>
                                                    <p className="text-base font-black text-slate-900">{result.createDate}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-blue-100 transition-all cursor-default group">
                                                <p className="text-[10px] font-black text-slate-400 tracking-widest mb-2">情況摘要</p>
                                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{result.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Timeline - Full Width */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-10 relative overflow-hidden">
                                    {/* Progress Bar */}
                                    {(() => {
                                        const doneCount = result.timeline.filter(t => t.done).length;
                                        const totalCount = result.timeline.length;
                                        const pct = Math.round((doneCount / totalCount) * 100);
                                        return (
                                            <div className="mb-6 relative z-10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xs font-black text-slate-900 tracking-[0.5em]">歷程紀錄</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-blue-600">{doneCount}/{totalCount} 已完成</span>
                                                        <span className="text-[10px] font-black text-slate-300 tracking-widest">即時更新</span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <div className="relative z-10">
                                        {result.timeline.map((item, idx) => {
                                            const isActive = !item.done && idx === result.timeline.findIndex(t => !t.done);
                                            const isPending = !item.done && !isActive;
                                            return (
                                                <div key={idx} className="relative flex items-stretch gap-0 group">

                                                    {/* 左欄：日期時間 */}
                                                    <div className="hidden md:flex flex-col items-end justify-start pt-3 pr-5 w-32 flex-shrink-0">
                                                        <span className={`text-xs font-bold leading-tight ${item.done ? 'text-slate-700' : 'text-slate-300'}`}>{item.date}</span>
                                                        <span className={`text-[11px] font-black mt-0.5 ${item.done ? 'text-blue-500' : isActive ? 'text-blue-400' : 'text-slate-200'}`}>{item.time}</span>
                                                    </div>

                                                    {/* 中欄：步驟編號 + 連接線 */}
                                                    <div className="flex flex-col items-center flex-shrink-0 w-10">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 font-black text-xs transition-all
                                                            ${item.done ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                                            : isActive ? 'bg-slate-900 text-white shadow-md ring-2 ring-blue-400 ring-offset-2'
                                                            : 'bg-slate-100 text-slate-300'}`}>
                                                            {item.done
                                                                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                : <span>{String(idx + 1).padStart(2, '0')}</span>
                                                            }
                                                        </div>
                                                        {idx !== result.timeline.length - 1 && (
                                                            <div className={`w-[2px] flex-1 my-1 ${item.done ? 'bg-blue-200' : 'bg-slate-100'}`} style={{ minHeight: '24px' }}></div>
                                                        )}
                                                    </div>

                                                    {/* 右欄：內容卡片 */}
                                                    <div className="flex-1 pb-3 last:pb-0 pl-4">
                                                        <div className={`rounded-xl p-4 transition-all duration-300 mb-0
                                                            ${item.done ? 'bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-sm'
                                                            : isActive ? 'bg-blue-600 border border-blue-500 shadow-lg shadow-blue-600/20'
                                                            : 'bg-transparent border border-transparent'}`}>

                                                            {/* 手機版日期 */}
                                                            <div className={`md:hidden text-[10px] font-bold mb-1 ${item.done ? 'text-slate-400' : isActive ? 'text-blue-200' : 'text-slate-300'}`}>
                                                                {item.date} {item.time}
                                                            </div>

                                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                                <h4 className={`text-sm font-black tracking-tight
                                                                    ${item.done ? 'text-slate-800' : isActive ? 'text-white' : 'text-slate-300'}`}>
                                                                    {item.title}
                                                                </h4>
                                                                {item.done && (
                                                                    <span className="hidden sm:inline-flex text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex-shrink-0">已確認</span>
                                                                )}
                                                                {isActive && (
                                                                    <span className="flex items-center gap-1 text-[9px] font-black text-blue-200 flex-shrink-0">
                                                                        <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"></span>
                                                                        處理中
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm leading-relaxed
                                                                ${item.done ? 'text-slate-500 font-medium' : isActive ? 'text-blue-100 font-medium' : 'text-slate-300 font-normal'}`}>
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Visual Backdrop */}
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-20 -mb-20 rounded-full pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="lg:col-span-12">
                                <Link to="/" className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-4">
                                    返回首頁
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
