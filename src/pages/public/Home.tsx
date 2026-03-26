import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Phone, Info, Play, Pause } from 'lucide-react';
import { typo } from '../../utils/typography';
import { SearchInput } from '../../components/common';

import heroShiba from '../../assets/images/hero_shiba.png';
import heroRescue from '../../assets/images/hero_rescue.png';
import heroBee from '../../assets/images/hero_bee.png';
import imgGeneralReport from '../../assets/images/image_general_report.png';
import imgBeeRemoval from '../../assets/images/image_bee_removal.png';
import photoStepAnalysis from '../../assets/images/photo_step_analysis.png';
import photoStepDocs from '../../assets/images/photo_step_docs.png';
import photoStepRescue from '../../assets/images/photo_step_rescue.png';
import imgStepDispatch from '../../assets/images/img_step_dispatch.png';
import bgMapNtpc from '../../assets/images/bg_map_ntpc.png';

const HERO_SLIDES = [
    {
        id: 1,
        image: heroShiba,
        title: '守護每一顆心跳',
        subtitle: '守護每一個生命，不只是口號，更是我們對新北市動物的最高承諾',
        cta: '即刻通報',
        link: '/smart-guide',
        color: 'from-orange-500/20 to-orange-900/40',
        tag: '核心任務'
    },
    {
        id: 2,
        image: heroRescue,
        title: '專業精英救援',
        subtitle: '專業救援團隊：24小時全年無休，守護受難生命的第一線部署',
        cta: '了解流程',
        link: '/smart-guide',
        color: 'from-blue-600/20 to-slate-900/40',
        tag: '快速響應'
    },
    {
        id: 3,
        image: heroBee,
        title: '環境安全維護',
        subtitle: '生態與安全共存：專業蜂案處理團隊，平衡城市安全與生態保護',
        cta: '通報處理',
        link: '/smart-guide',
        color: 'from-yellow-400/20 to-yellow-900/40',
        tag: '特殊勤務'
    }
];

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [queryId, setQueryId] = useState('');
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const steps = [
        {
            step: '01',
            tag: '情境分析',
            title: '案件情境識別',
            desc: '系統自動判讀案件急迫性與屬性，協助您決定通報優先順序與應對策略。',
            image: photoStepAnalysis
        },
        {
            step: '02',
            tag: '資料整備',
            title: '報案資料整備',
            desc: '即時列出所需照片與證明文件，確保通報內容準確無誤，加速派勤效率。',
            image: photoStepDocs
        },
        {
            step: '03',
            tag: '精準派案',
            title: '精準派案處置',
            desc: '案件自動直達權責單位與最近勤務點，縮短 50% 以上現場處理時間。',
            image: photoStepRescue
        },
        {
            step: '04',
            tag: '透明追蹤',
            title: '全程透明追蹤',
            desc: '提供案件即時狀態查詢與處理進度通知，讓報案人隨時掌握救援最新動態。',
            image: imgStepDispatch
        }
    ];


    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
            }, 6000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white pb-0">
            {/* 1. HERO SECTION (Compact) */}
            <section className="relative h-[calc(550px+72px)] -mt-[72px] overflow-hidden bg-slate-950">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    >
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    </div>
                ))}

                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 text-xs font-black tracking-[0.3em] uppercase animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                {HERO_SLIDES[currentSlide].tag}
                            </div>
                            <h1 className={`${typo.hero} md:text-7xl font-black text-white tracking-tighter md:leading-[0.9] uppercase mix-blend-overlay`}>
                                {HERO_SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-base md:text-xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to={HERO_SLIDES[currentSlide].link} className="px-8 py-4 bg-white text-slate-950 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-white/10 flex items-center gap-3">
                                    {HERO_SLIDES[currentSlide].cta} <ArrowRight size={18} />
                                </Link>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-3">
                                    <Play size={18} fill="currentColor" /> 觀看簡介
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex gap-4">
                            {HERO_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-16 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 text-white/50 hover:text-white transition-colors">
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. REPORTING HUB */}
            <section className="-mt-16 relative z-30 px-6 mb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-4 flex flex-col md:flex-row overflow-hidden border border-slate-100">

                        {/* Emergency Lines */}
                        <div className="bg-slate-950 rounded-[2rem] p-6 text-white md:w-72 flex-shrink-0 flex flex-col gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 border border-red-500/20">
                                    <Activity size={12} /> 即時勤務中心
                                </div>
                                <h3 className="text-xl font-black tracking-tighter leading-tight text-white">緊急通報專線</h3>
                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
                                    發現緊急救援需求？請優先撥打熱線。
                                </p>
                            </div>
                            <div className="group/btn flex items-center justify-between px-4 py-3 bg-rose-600 rounded-xl hover:bg-rose-500 transition-all cursor-pointer active:scale-95">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-200 block mb-0.5">動物救援</span>
                                    <span className="text-2xl font-black tracking-tighter">1959</span>
                                </div>
                                <Phone className="opacity-40 group-hover/btn:opacity-100 transition-opacity" size={18} />
                            </div>
                            <div className="group/btn flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all cursor-pointer border border-white/5 active:scale-95">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-0.5">市民服務</span>
                                    <span className="text-2xl font-black tracking-tighter">1999</span>
                                </div>
                                <Info className="opacity-40 group-hover/btn:opacity-100 transition-opacity" size={18} />
                            </div>
                        </div>

                        {/* Digital Reporting Field */}
                        <div className="flex-1 p-5 md:p-6 bg-white flex flex-col gap-4">
                            {/* Header row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <h3 className="text-2xl font-black tracking-tighter text-slate-900">案件通報</h3>
                                <div className="flex-1 max-w-sm">
                                    <SearchInput
                                        value={queryId}
                                        onChange={(e) => setQueryId(e.target.value)}
                                        placeholder="輸入案件編號追蹤進度..."
                                        onSearch={() => { if (queryId) navigate(`/status?id=${queryId}`); }}
                                        buttonLabel="查詢"
                                    />
                                </div>
                            </div>

                            {/* Image Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                <Link to="/smart-guide" className="group relative h-44 md:h-52 rounded-2xl overflow-hidden">
                                    <img src={imgGeneralReport} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">一般案件通報</span>
                                        <h4 className="text-2xl font-black tracking-tighter">動物救援</h4>
                                    </div>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <ArrowRight size={14} className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/smart-guide" className="group relative h-44 md:h-52 rounded-2xl overflow-hidden">
                                    <img src={imgBeeRemoval} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="inline-block px-2.5 py-1 bg-amber-500/80 backdrop-blur-md border border-amber-400/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">特殊勤務</span>
                                        <h4 className="text-2xl font-black tracking-tighter">蜂蛇案件</h4>
                                    </div>
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                            <ArrowRight size={14} className="text-white" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Intelligent Guidance (Circular Steps) */}
            <section id="process-guide" className="py-10 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className={`${typo.hero} md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 uppercase mb-8`}>
                            智慧通報引導
                        </h2>
                        <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            不確定如何開始？智慧引導系統將協助您判斷案件類別、準備必要文件，並優化通報流程速率。
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-24 left-0 right-0 h-[2px] border-t-2 border-dashed border-slate-200 z-0"></div>

                        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {steps.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="group relative mb-8">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg z-20 shadow-xl border-4 border-white">
                                            {item.step}
                                        </div>

                                        {/* Circular Image Frame */}
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl relative transition-all duration-500 group-hover:scale-105 group-hover:border-slate-100">
                                            <img src={item.image} className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
                                            <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    </div>

                                    <div className="text-center px-4">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.tag}</div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-3">{item.title}</h4>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-10">
                        <Link to="/smart-guide" className="group flex items-center gap-4 py-5 px-8 md:py-6 md:px-10 bg-slate-900 text-white rounded-[2rem] font-black text-base md:text-xl uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                            開始智慧引導 <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Global Map Experience */}
            <section className="relative flex flex-col bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(${bgMapNtpc})` }}>
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Center CTA */}
                <div className="relative z-10 flex items-center justify-center py-20 md:py-28 px-6">
                    <div className="p-8 md:p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] text-center shadow-2xl animate-in fade-in zoom-in duration-1000 max-w-xl w-full">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-md">
                            即時動保地圖
                        </h2>
                        <p className="text-sm md:text-base text-white/80 font-medium mb-8 leading-relaxed">
                            即時掌握全新北市動保案件熱點與勤務車輛動態，透明化數據助您了解城市脈動。
                        </p>
                        <Link to="/map" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-black text-slate-950 uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-lg">
                            <Activity className="mr-2 h-4 w-4 text-rose-500 animate-pulse" />
                            進入地圖系統
                        </Link>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                        {[
                            { value: '847',  label: '案件熱點',   unit: '個' },
                            { value: '23',   label: '即時出勤',   unit: '輛' },
                            { value: '29',   label: '行政區覆蓋', unit: '區' },
                            { value: '即時', label: '資料更新',   unit: '' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center py-2 px-4">
                                <div className="text-white font-black text-2xl md:text-3xl tracking-tighter leading-none">
                                    {stat.value}<span className="text-sm ml-0.5 text-white/60">{stat.unit}</span>
                                </div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
};
