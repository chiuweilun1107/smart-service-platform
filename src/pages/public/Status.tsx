import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-[#FDFDFD] pb-40">
            <div className="pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header Command Area */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="max-w-2xl">
                            <Link to="/" className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all mb-10">
                                BACK TO PORTAL
                            </Link>
                            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase">
                                案件進度<br />
                                <span className="text-blue-600">查詢中心</span>
                            </h1>
                        </div>

                        <div className="w-full lg:w-[480px]">
                            <div className="bg-white border-2 border-slate-200 p-2 pr-2 rounded-[2.5rem] flex items-center shadow-xl">
                                <div className="relative flex-1 group pl-4">
                                    <input
                                        type="text"
                                        value={caseId}
                                        onChange={(e) => setCaseId(e.target.value)}
                                        placeholder="輸入案件編號..."
                                        className="w-full px-6 py-5 bg-transparent text-slate-900 font-black text-xl tracking-tight outline-none placeholder:text-slate-300"
                                    />
                                </div>
                                <button
                                    onClick={() => mockFetchStatus(caseId)}
                                    disabled={!caseId || loading}
                                    className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] hover:bg-blue-500 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 disabled:opacity-50"
                                >
                                    {loading ? 'LOADING' : 'SEARCH'}
                                </button>
                            </div>
                            {error && <p className="mt-6 text-rose-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ml-6 text-sm">{error}</p>}
                        </div>
                    </div>

                    {!result && !loading && !error && (
                        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 rounded-[4rem] animate-in fade-in duration-1000">
                            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">等待案件編號輸入</p>
                        </div>
                    )}

                    {result && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
                            {/* Mission Intelligence Overlay */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left border-r-0 md:border-r border-slate-100 pr-0 md:pr-16 md:min-w-[300px]">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
                                            LIVE STATUS
                                        </div>
                                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 uppercase leading-none">{result.id}</h2>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 pl-1">CASE IDENTIFIER</div>

                                        <div className={`px-10 py-6 rounded-3xl font-black text-3xl tracking-tighter uppercase shadow-xl ${result.status === 'processing' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-900 text-white'}`}>
                                            {result.status === 'processing' ? '執行中任務' : result.status === 'resolved' ? '已結案' : '待處理'}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">地理位置</p>
                                                <p className="text-xl font-black text-slate-900 leading-tight">{result.location}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">通報時間</p>
                                                <p className="text-xl font-black text-slate-900">{result.createDate}</p>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden transition-all hover:bg-white hover:border-blue-100 cursor-default">
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">情況摘要</p>
                                                <p className="text-lg font-medium text-slate-600 leading-relaxed italic">{result.description}</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -mr-20 pointer-events-none transform skew-x-12 border-l border-slate-100"></div>
                                </div>
                            </div>

                            {/* Mission Timeline - Full Width */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 md:p-20 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-20 relative z-10">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-4">
                                            歷程紀錄
                                        </h3>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REAL-TIME UPDATES</div>
                                    </div>

                                    <div className="space-y-0 relative z-10">
                                        {result.timeline.map((item, idx) => (
                                            <div key={idx} className="relative pl-16 md:pl-24 pb-20 last:pb-0 group">
                                                {/* Vertical Connector */}
                                                {idx !== result.timeline.length - 1 && (
                                                    <div className={`absolute left-5 md:left-[27px] top-6 w-[2px] h-full ${item.done ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                                                )}

                                                {/* Node Indicator */}
                                                <div className={`absolute left-0 md:left-[10px] top-1 w-[36px] h-[36px] rounded-2xl border-2 flex items-center justify-center transition-all bg-white z-10 ${item.done ? 'border-blue-600 shadow-lg shadow-blue-600/20' : 'border-slate-100'}`}>
                                                    {item.done ? (
                                                        <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-white scale-110">
                                                            DONE
                                                        </div>
                                                    ) : (
                                                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-20">
                                                    <div className="md:w-40 py-1">
                                                        <div className={`text-sm font-black tracking-widest uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.date}</div>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.done ? 'text-blue-400' : 'text-slate-200'}`}>{item.time}</div>
                                                    </div>
                                                    <div className="flex-1 bg-slate-50/50 p-8 rounded-[2rem] border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                                                        <h4 className={`text-xl font-black tracking-tight mb-3 uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.title}</h4>
                                                        <p className={`text-lg font-medium leading-relaxed max-w-2x ${item.done ? 'text-slate-500' : 'text-slate-200'}`}>{item.desc}</p>
                                                    </div>
                                                    {item.done && (
                                                        <div className="hidden lg:flex shrink-0 mt-8">
                                                            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] bg-blue-50 px-6 py-2 rounded-full border border-blue-100">
                                                                VERIFIED
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Visual Backdrop */}
                                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] -mr-40 -mb-40 rounded-full"></div>
                                </div>
                            </div>

                            <div className="lg:col-span-12">
                                <Link to="/" className="w-full py-8 bg-white border border-slate-100 rounded-[3rem] text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200/20 flex items-center justify-center gap-4">
                                    EXIT SYSTEM
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
