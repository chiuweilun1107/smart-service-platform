import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, Search } from 'lucide-react';
import { typo, btn } from '../../utils/typography';

export const ReportSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const caseId = location.state?.caseId;

    // Protect route
    useEffect(() => {
        if (!caseId) {
            navigate('/');
        }
    }, [caseId, navigate]);

    if (!caseId) return null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                {/* Page Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border bg-blue-50 text-blue-600 border-blue-100 mb-4">通報完成</div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">案件已成功送出</h1>
                    <p className="mt-3 text-base text-slate-500 font-medium">系統已受理您的通報，以下為您的案件資訊。</p>
                </div>

            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-16 text-center relative overflow-hidden">

                {/* Decorative Background */}
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent left-0 z-0"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30 animate-in zoom-in duration-500">
                        <CheckCircle2 size={48} />
                    </div>

                    <h1 className={`${typo.h1} font-black tracking-tighter text-slate-900 mb-6`}>
                        案件通報成功！
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-lg mx-auto">
                        感謝您的熱心通報。我們已收到您的案件資訊，系統將立即通知轄區勤務中心進行派案。
                    </p>

                    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 mb-12 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        <div className="relative z-10">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">您的案件編號 (Case ID)</p>
                            <p className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white tracking-widest select-all break-all">
                                {caseId}
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                System Processing
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className={`${btn.primary} rounded-xl bg-white border border-slate-200 text-slate-600 uppercase tracking-widest hover:border-slate-400 hover:text-slate-900 flex items-center justify-center gap-3 transition-all`}
                        >
                            <Home size={18} />
                            返回首頁
                        </Link>
                        <Link
                            to={`/status?id=${caseId}`}
                            className={`${btn.primary} rounded-xl bg-emerald-500 text-white uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all`}
                        >
                            <Search size={18} />
                            查詢處理進度
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};
