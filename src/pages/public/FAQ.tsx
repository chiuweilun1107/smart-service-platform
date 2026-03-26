import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_SECTIONS = [
    {
        title: '通報與受理',
        id: 'reporting',
        questions: [
            {
                q: '發現受傷動物該如何通報？',
                a: '您可以直接撥打 24 小時專線 1959，或在本門戶點擊「一般案件通報」。提供正確的地點、動物照片及您的聯絡電話將有助於加速救援流程。'
            },
            {
                q: '通報需要具名嗎？',
                a: '您可以選擇匿名通報，但在「智慧勤務管理平台」中提供聯絡通訊，可以讓承辦人員在找不到確切位置時即時與您確認，提高救援成功率。'
            },
            {
                q: '晚上發現蜂巢可以通報嗎？',
                a: '可以，蜂案處理團隊維持 24 小時值勤，但請注意，夜間處置可能會視現場照明與安全狀況，決定是立即處理或於黎明時分執行。'
            }
        ]
    },
    {
        title: '案件追蹤',
        id: 'tracking',
        questions: [
            {
                q: '如何查詢我之前的通報進度？',
                a: '通報成功後您會獲得一組 ANS- 開頭的案件編號，請前往「進度查詢」頁面輸入此編號及您的連絡電話，即可查看即時的處理歷程。'
            },
            {
                q: '為什麼我的案件一直顯示「處理中」？',
                a: '案件狀態取決於勤務組的現場處置情況，若涉及醫療送診或收容安置，歷程會記錄詳細的移動軌跡，建議您持續關注進度更新。'
            }
        ]
    },
    {
        title: '法規與權責',
        id: 'laws',
        questions: [
            {
                q: '虐待動物有什麼法律責任？',
                a: '根據動保法，惡意虐待動物最高可處二年以下有期徒刑或拘役，併科新臺幣二十萬元以上二百萬元以下罰金。本處會針對所有通報之虐待案件進行嚴格稽核。'
            },
            {
                q: '我想參觀收容中心需要申請嗎？',
                a: '是的，為維持中心品質，參觀或認養請先至服務網站預約，或下載本站資源中心之「收容中心參訪指引」了解流程。'
            }
        ]
    }
];

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('all');

    const toggle = (id: string) => setOpenIndex(openIndex === id ? null : id);

    const filteredSections = FAQ_SECTIONS.filter(section =>
        (activeSection === 'all' || section.id === activeSection) &&
        (section.questions.some(q => q.q.includes(searchTerm) || q.a.includes(searchTerm)) || section.title.includes(searchTerm))
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-40">
            <div className="pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-blue-100">
                                智慧服務門戶
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase">
                                服務<br />
                                <span className="text-blue-600">百科手冊</span>
                            </h1>
                            <p className="mt-8 text-slate-500 text-xl font-medium border-l-4 border-blue-600 pl-6">
                                智慧服務百科：整合新北市動保處所有業務流程、法規諮詢與常見問答，為您提供最即時的知識支援。
                            </p>
                        </div>
                        <div className="w-full lg:w-96">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="搜尋智慧索引..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-8 py-5 bg-white border-2 border-slate-200 rounded-[2rem] text-slate-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex flex-wrap gap-4 mb-16">
                        <button
                            onClick={() => setActiveSection('all')}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSection === 'all'
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                                    : 'bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                                }`}
                        >
                            所有類別
                        </button>
                        {FAQ_SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSection === s.id
                                        ? 'bg-slate-900 border border-blue-500 text-white shadow-xl shadow-blue-500/10'
                                        : 'bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                                    }`}
                            >
                                {s.title}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Questions List */}
                        <div className="lg:col-span-8 space-y-12">
                            {filteredSections.map((section, sIdx) => (
                                <div key={sIdx} className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                                    <h2 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase flex items-center gap-4">
                                        <span className="w-8 h-[1px] bg-slate-800"></span>
                                        {section.title}
                                    </h2>

                                    <div className="grid grid-cols-1 gap-4">
                                        {section.questions.filter(q => q.q.includes(searchTerm) || q.a.includes(searchTerm)).map((q, qIdx) => {
                                            const id = `${sIdx}-${qIdx}`;
                                            const isOpen = openIndex === id;
                                            return (
                                                <div key={qIdx} className={`group relative bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${isOpen ? 'border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-400/20' : 'border-slate-100 hover:border-blue-200'}`}>
                                                    <button
                                                        onClick={() => toggle(id)}
                                                        className="w-full text-left p-10 flex items-center justify-between gap-8"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-blue-600 scale-150' : 'bg-slate-200'}`}></div>
                                                            <span className={`text-xl font-black tracking-tight transition-all ${isOpen ? 'text-blue-600' : 'text-slate-800'}`}>
                                                                {q.q}
                                                            </span>
                                                        </div>
                                                        <div className={`shrink-0 font-black text-[10px] transition-all duration-500 ${isOpen ? 'text-blue-600 rotate-180' : 'text-slate-300'}`}>
                                                            {isOpen ? 'CLOSE' : 'OPEN'}
                                                        </div>
                                                    </button>
                                                    <div className={`transition-all duration-500 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                                        <div className="px-10 pb-12 text-slate-500 font-medium leading-relaxed bg-slate-50/50 pt-6">
                                                            <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-inner text-lg">
                                                                {q.a}
                                                            </div>
                                                            <div className="mt-8 flex items-center gap-6">
                                                                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">這有幫助嗎？</button>
                                                                <div className="h-3 w-[1px] bg-slate-200"></div>
                                                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline">分享此問答</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar Widgets */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Fast Links Widget */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">
                                    快速鏈結
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: '動物認養流程' },
                                        { label: '案件編號規範' },
                                        { label: '年度動保白皮書' },
                                        { label: '相關法規庫' }
                                    ].map((link, i) => (
                                        <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                                            <span className="font-bold text-slate-600 group-hover:text-slate-900">{link.label}</span>
                                            <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-600 transition-all">VIEW</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Help Banner Widget */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black tracking-tighter mb-4">仍有疑問？</h3>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                                        若百科中的內容無法解決您的問題，請聯繫我們的 24/7 諮詢中心。
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">動保專線</p>
                                            <p className="text-4xl font-black">1959</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">市民熱線</p>
                                            <p className="text-4xl font-black">1999</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            </div>

                            <Link to="/" className="flex items-center justify-center gap-4 py-6 bg-white border border-slate-100 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-slate-900 transition-all">
                                RETURN TO PORTAL
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
