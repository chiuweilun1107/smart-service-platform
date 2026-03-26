import { Link } from 'react-router-dom';

const NEWS_ARTICLES = [
    {
        id: 1,
        date: '2023-11-20',
        title: '【熱區警示】板橋區近期接獲多起蜂案通報，請民眾留意。',
        summary: '根據本局大數據分析，板橋區大觀路一帶接獲多起蜂窩通報，提醒民眾避開茂密草叢，若發現蜂窩請立即通報。',
        category: '安全警示',
        urgent: true
    },
    {
        id: 2,
        date: '2023-11-18',
        title: '「智慧勤務管理系統」正式啟動，提升報案反應速度 30%。',
        summary: '本局全新整合平台今日啟動，透過 AI 自動分派與即時圖資，將有效縮短勤務人員的反應時間，優化行政效率。',
        category: '機關新聞',
        urgent: false
    },
    {
        id: 3,
        date: '2023-11-15',
        title: '冬季流浪貓犬保暖指引：發現受困動物請聯繫 1959 專線。',
        summary: '氣溫驟降，請民眾留意家中寵物與鄰近流浪動物狀況。若發現動物受凍或受困車底，請優先聯繫專業救援隊。',
        category: '防疫宣導',
        urgent: false
    },
    {
        id: 4,
        date: '2023-11-12',
        title: '公告：本周六進行系統維護，民眾線上查詢功能將暫停 2 小時。',
        summary: '為提升系統穩定性，預計於 11/25 (六) 01:00 - 03:00 進行伺服器升級，作業期間將暫停所有查詢服務。',
        category: '系統公告',
        urgent: true
    },
    {
        id: 5,
        date: '2023-11-10',
        title: '成功案例：淡水區受傷候鳥獲救，經治療後已順利重返大自然。',
        summary: '上月接獲通報之受傷候鳥，經合作醫療中心悉心照顧後，已確認狀況恢復良好並順利野放，展現保育成果。',
        category: '成果分享',
        urgent: false
    },
    {
        id: 6,
        date: '2023-11-05',
        title: '志工募集：112 年冬季動物保護宣導大使開始招募。',
        summary: '歡迎熱愛動物的您加入我們的行列，協助宣導正確的報案流程與動保知識，詳情請下載簡章了解。',
        category: '活動快訊',
        urgent: false
    }
];

export const News: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Container */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            官方新聞與即時通報
                        </div>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-6">
                        最新公告
                    </h1>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed border-l-4 border-slate-200 pl-6">
                        即時發布新北市動物保護政策、緊急通報及各式成果快訊。我們致力於提供最透明、最高效率的資訊服務。
                    </p>
                </div>

                {/* News List */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {NEWS_ARTICLES.map((article) => (
                            <div key={article.id} className="p-8 md:p-10 hover:bg-slate-50 transition-all group cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-start gap-8">
                                    <div className="w-32 flex-shrink-0 pt-1">
                                        <div className="text-[11px] font-black text-slate-400 capitalize mb-2">{article.date}</div>
                                        <div className={`inline-block px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase ${article.urgent ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {article.category}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                            {article.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                                            {article.summary}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-all font-black text-[10px] text-blue-600 tracking-widest hidden md:block group-hover:translate-x-0 translate-x-4">
                                        READ MORE
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-20 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                        RETURN TO PORTAL
                    </Link>
                </div>
            </div>
        </div>
    );
};
