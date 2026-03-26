import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type Step = 'start' | 'animal_v_bee' | 'animal_detail' | 'bee_detail' | 'result_emergency' | 'result_normal';

const ChoiceCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    active?: boolean;
    label?: string;
    warning?: boolean;
}> = ({ title, description, onClick, active, label, warning }) => (
    <button
        onClick={onClick}
        className={`w-full group relative p-10 bg-white rounded-[3rem] border-2 transition-all duration-500 text-left overflow-hidden ${warning ? 'hover:border-rose-300' : 'hover:border-blue-300'} ${active ? 'border-blue-600 shadow-2xl shadow-blue-600/10' : 'border-slate-100'}`}
    >
        <div className="relative z-10">
            {label && (
                <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${warning ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {label}
                </div>
            )}
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4 uppercase">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">{description}</p>
        </div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] blur-[80px] rounded-full transition-all duration-700 ${warning ? 'bg-rose-600/5' : 'bg-blue-600/5'} ${active ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}></div>
    </button>
);

export const SmartGuide: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>('start');
    const navigate = useNavigate();

    const goTo = (step: Step) => setCurrentStep(step);

    const renderStep = () => {
        switch (currentStep) {
            case 'start':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="max-w-4xl mx-auto">
                            <div className="inline-block px-4 py-2 bg-blue-500/10 text-blue-600 border border-blue-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                                智慧通報引導方案
                            </div>
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-12 uppercase">
                                您需要<br />
                                <span className="text-blue-600">哪種協助？</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl leading-relaxed">
                                歡迎使用智慧勤務引導系統。請根據您現場觀察到的情況，選擇最符合的案件類型，我們將引導您完成正式通報。
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ChoiceCard
                                    onClick={() => goTo('animal_detail')}
                                    title="一般動保勤務"
                                    description="包含受傷動物救援、受困案件、疑似虐待或棄養等動物福利相關事務。"
                                    label="ANIMAL WELFARE"
                                />
                                <ChoiceCard
                                    onClick={() => goTo('bee_detail')}
                                    title="蜂蛇移除勤務"
                                    description="發現具危險性之蜂巢、蛇類侵入住家或威脅公眾安全之緊急移除需求。"
                                    label="HAZARD REMOVAL"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'animal_detail':
                return (
                    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                        <div className="max-w-4xl mx-auto">
                            <button onClick={() => goTo('start')} className="mb-12 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2">
                                返回上一步
                            </button>
                            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">動物狀況評估</h2>
                            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl">請進一步描述動物目前的具體狀況，這將幫助我們判斷派遣優先級。</p>

                            <div className="grid grid-cols-1 gap-6">
                                <ChoiceCard
                                    onClick={() => navigate('/report/general?category=rescue')}
                                    title="動物受傷或受困"
                                    description="動物有明顯外傷、流血、無法移動，或受困於無法自行脫困的場所（如高處、溝渠）。"
                                    label="RESCUE NEEDED"
                                />
                                <ChoiceCard
                                    onClick={() => navigate('/report/general?category=abuse')}
                                    title="疑似受虐或不當飼養"
                                    description="發現有人為虐待動物行為，或飼養環境極其惡劣（無水無食、空間過小）。"
                                    label="CRUELTY REPORT"
                                />
                                <ChoiceCard
                                    onClick={() => goTo('result_emergency')}
                                    title="具立即性攻擊威脅"
                                    description="動物正在攻擊人類或其他動物，具有高度危險性。"
                                    label="EMERGENCY"
                                    warning={true}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'bee_detail':
                return (
                    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
                        <div className="max-w-4xl mx-auto">
                            <button onClick={() => goTo('start')} className="mb-12 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2">
                                返回上一步
                            </button>
                            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">蜂蛇危害評估</h2>
                            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl">確認蜂巢或蛇類的位置與狀態，以利專業人員攜帶正確裝備。</p>

                            <div className="grid grid-cols-1 gap-6">
                                <ChoiceCard
                                    onClick={() => navigate('/report/bee?category=indoor')}
                                    title="位於室內或居住區"
                                    description="目標位於住家內部、陽台、校園教室等人員密集活動區域。"
                                    label="RESIDENTIAL"
                                />
                                <ChoiceCard
                                    onClick={() => navigate('/report/bee?category=outdoor')}
                                    title="位於戶外公共區域"
                                    description="目標位於公園、行道樹、路燈桿等開放空間。"
                                    label="PUBLIC AREA"
                                />
                                <ChoiceCard
                                    onClick={() => goTo('result_emergency')}
                                    title="造成人員受傷或休克"
                                    description="現場已有民眾遭到叮咬或攻擊，出現過敏性休克或其他緊急醫療需求。"
                                    label="MEDICAL EMERGENCY"
                                    warning={true}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'result_emergency':
                return (
                    <div className="animate-in zoom-in-95 duration-1000">
                        <div className="max-w-4xl mx-auto text-center py-20 bg-rose-50 rounded-[5rem] border-2 border-rose-100 flex flex-col items-center">
                            <div className="w-32 h-32 bg-rose-600 text-white rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-rose-600/50 font-black text-2xl">
                                !!!
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter text-rose-950 mb-6 uppercase">緊急告警</h2>
                            <p className="text-2xl text-rose-800 font-bold mb-12 max-w-2xl px-10">
                                基於您的描述，當前情況被判定為「極高危險」。請立即撥打動保 24 小時專線進行即時調度。
                            </p>
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">緊急調渡熱線</div>
                                <div className="text-8xl font-black text-rose-600 tracking-tighter">1959</div>
                            </div>
                            <div className="mt-20 flex flex-wrap justify-center gap-6">
                                <button onClick={() => goTo('start')} className="px-12 py-6 bg-white text-slate-400 rounded-3xl font-black text-sm uppercase tracking-widest border border-rose-100 hover:bg-rose-100 hover:text-rose-600 transition-all">返回首頁</button>
                                <button onClick={() => navigate('/report/general?emergency=true')} className="px-12 py-6 bg-rose-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-600/30">仍要網頁通報</button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center">
            {/* Minimalist Background Layout */}
            <div className="absolute inset-0 bg-white pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[150px] rounded-full"></div>

            <div className="relative z-10 w-full px-6 py-20">
                {renderStep()}
            </div>

            {/* Global Overlay Elements */}
            <div className="fixed top-10 left-10 flex flex-col">
                <Link to="/" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] hover:text-blue-600 transition-all">
                    EXIT GUIDE
                </Link>
            </div>

            <div className="fixed bottom-10 right-10 text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    SYSTEM PROTOCOL: {currentStep.toUpperCase().replace(/_/g, ' ')}
                </p>
            </div>
        </div>
    );
};
