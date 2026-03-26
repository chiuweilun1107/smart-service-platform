import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, Search } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-12 md:p-16 text-center border border-slate-100 relative overflow-hidden">

                {/* Decorative Background */}
                <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent left-0 z-0"></div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 animate-in zoom-in duration-500">
                        <CheckCircle2 size={48} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
                        案件通報成功！
                    </h1>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-lg mx-auto">
                        感謝您的熱心通報。我們已收到您的案件資訊，系統將立即通知轄區勤務中心進行派案。
                    </p>

                    <div className="bg-slate-950 p-8 rounded-[2rem] shadow-xl shadow-slate-900/20 mb-12 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800"></div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">您的案件編號 (Case ID)</p>
                            <p className="text-4xl md:text-5xl font-mono font-bold text-white tracking-widest select-all">
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
                            className="px-8 py-4 border border-slate-200 text-slate-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
                        >
                            <Home size={18} />
                            返回首頁
                        </Link>
                        <Link
                            to={`/status?id=${caseId}`}
                            className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                        >
                            <Search size={18} />
                            查詢處理進度
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
