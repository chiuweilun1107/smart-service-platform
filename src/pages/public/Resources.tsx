import React, { useState } from 'react';
import { Search, Download, FileText, Book, Shield, ArrowRight, Layers } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: '全部資源', icon: Layers },
    { id: 'laws', label: '法令規章', icon: Shield },
    { id: 'manuals', label: '操作手冊', icon: Book },
    { id: 'reports', label: '行政報表', icon: FileText }
];

const RESOURCES = [
    { id: 1, category: 'laws', title: '新北市動物保護自治條例 (全文)', type: 'PDF', size: '2.4 MB', date: '2023-05-12' },
    { id: 2, category: 'laws', title: '動物保護法部分條文修正案 (112年11月)', type: 'ODF', size: '0.8 MB', date: '2023-11-20' },
    { id: 3, category: 'manuals', title: '1959 緊急通報系統操作指引 - 民眾篇', type: 'PDF', size: '1.5 MB', date: '2023-01-15' },
    { id: 4, category: 'manuals', title: '受傷動物初步急救手冊 (電子書)', type: 'EPUB', size: '5.2 MB', date: '2023-03-10' },
    { id: 5, category: 'reports', title: '112 年度第三季新北市動保救援成功率分析', type: 'ODF', size: '1.2 MB', date: '2023-10-05' },
    { id: 6, category: 'reports', title: '區域性遊蕩犬隻熱點統計報表 (2023Q3)', type: 'ODF', size: '3.1 MB', date: '2023-10-12' },
    { id: 7, category: 'manuals', title: '蜂蛇案件通報圖資準備規範', type: 'PDF', size: '0.9 MB', date: '2023-06-20' },
    { id: 8, category: 'reports', title: '動物保護防疫處年度施政績效報告 (草案)', type: 'DOCX', size: '4.5 MB', date: '2023-11-01' }
];

export const Resources: React.FC = () => {
    const [activeCat, setActiveCat] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredResources = RESOURCES.filter(res => {
        const matchesCat = activeCat === 'all' || res.category === activeCat;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Government Open Data & resources</div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.85] mb-8">
                            便民服務<br />
                            <span className="text-emerald-500">資源中心</span>
                        </h1>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">
                            我們致力於提供透明化資訊。您可以在此搜尋並下載最新的法令規章、通報手冊、以及各類行政案情報表。
                        </p>
                    </div>

                    <div className="w-full md:w-96">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="搜尋關鍵字 (例如: 法令、報表)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Selection */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-black tracking-tight transition-all ${activeCat === cat.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}
                        >
                            <cat.icon size={16} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(res => (
                        <div key={res.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${res.category === 'laws' ? 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500' : res.category === 'manuals' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500' : 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500'} group-hover:text-white`}>
                                        {res.category === 'laws' ? <Shield size={24} /> : res.category === 'manuals' ? <Book size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{res.date}</div>
                                </div>
                                <h3 className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-slate-900 transition-colors mb-4 line-clamp-2 leading-tight">
                                    {res.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-8">
                                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded uppercase tracking-widest">{res.type}</span>
                                    <span className="text-[10px] font-bold text-slate-300">{res.size}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-slate-50 group-hover:bg-slate-900 text-slate-400 group-hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                <Download size={14} /> 立即下載資源
                            </button>
                        </div>
                    ))}

                    {filteredResources.length === 0 && (
                        <div className="col-span-full py-32 text-center opacity-20">
                            <Search size={80} className="mx-auto mb-6" />
                            <p className="text-2xl font-black">找不到相符的資源</p>
                        </div>
                    )}
                </div>

                {/* FAQ Quick Link Banner */}
                <div className="mt-32 p-12 bg-slate-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tighter mb-4">還有其他疑問嗎？</h2>
                        <p className="text-slate-400 text-lg font-medium">查看服務百科，了解更多關於系統運作、通報規範與相關權責說明。</p>
                    </div>
                    <button className="relative z-10 px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center gap-3">
                        進入服務百科 <ArrowRight size={20} />
                    </button>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/10 blur-[100px] rounded-full group-hover:bg-emerald-600/20 transition-all"></div>
                </div>

            </div>
        </div>
    );
};
