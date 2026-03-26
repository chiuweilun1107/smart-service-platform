import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Camera, FileText, CheckSquare, Loader2, Check, Clock, Shield, X } from 'lucide-react';
import type { CaseMarker } from '../../components/map/CaseMap';
import { TextInput, Textarea, PageHeader } from '../../components/common';

type Step = 'gps' | 'form' | 'photo' | 'sign';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: 'gps',   label: '現場簽到', icon: <MapPin size={14} /> },
    { id: 'form',  label: '稽查紀錄', icon: <FileText size={14} /> },
    { id: 'photo', label: '現場照片', icon: <Camera size={14} /> },
    { id: 'sign',  label: '電子簽核', icon: <CheckSquare size={14} /> },
];

export const FieldworkReport: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const caseItem = (location.state as { caseItem?: CaseMarker } | null)?.caseItem;

    const [step, setStep] = useState<Step>('gps');

    // Step 1 — GPS
    const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [gpsTime, setGpsTime] = useState('');

    // Step 2 — 三聯單
    const [handlerName, setHandlerName] = useState('張志明');
    const [handlerBadge, setHandlerBadge] = useState('A-2341');
    const [processingResult, setProcessingResult] = useState('');
    const [vehicleCount, setVehicleCount] = useState('');
    const [note, setNote] = useState('');

    // Step 3 — 照片
    const [photoMock, setPhotoMock] = useState(false);

    // Step 4 — 簽核
    const [signName, setSignName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const stepIndex = STEPS.findIndex(s => s.id === step);
    const isBee = caseItem?.type === 'bee';

    const handleGpsCapture = () => {
        setGpsStatus('loading');
        setTimeout(() => {
            setGpsCoords({
                lat:     caseItem?.lat     ?? 25.0330,
                lng:     caseItem?.lng     ?? 121.5650,
                address: caseItem?.address ?? '台北市大安區和平東路二段',
            });
            setGpsTime(new Date().toLocaleString('zh-TW'));
            setGpsStatus('done');
        }, 1800);
    };

    const handleSubmit = () => {
        setSubmitting(true);
        const existing = JSON.parse(sessionStorage.getItem('resolved_cases') ?? '[]') as string[];
        if (caseId && !existing.includes(caseId)) existing.push(caseId);
        sessionStorage.setItem('resolved_cases', JSON.stringify(existing));
        setTimeout(() => navigate('/map'), 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <div className="max-w-5xl mx-auto">

                {/* ── Page Header ─────────────────────────────────────────────── */}
                <PageHeader
                    badge="外勤回報作業"
                    badgeColor="amber"
                    title={<>外勤回報 <span className="text-blue-600">作業記錄</span></>}
                    subtitle={`${caseItem?.title ?? `案件 ${caseId}`} · ${isBee ? '蜂蛇移除' : '一般救援'}`}
                    layout="split"
                >
                    {/* 步驟計數 */}
                    <div className="flex items-center gap-4 pl-5 pr-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">目前步驟</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-900 leading-none">{stepIndex + 1}</span>
                                <span className="text-base font-bold text-slate-400">/ {STEPS.length}</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-100"></div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">當前</div>
                            <div className="text-sm font-black text-slate-700">{STEPS[stepIndex].label}</div>
                        </div>
                        {/* Mini progress dots */}
                        <div className="flex items-center gap-1.5 ml-2">
                            {STEPS.map((_, i) => (
                                <div key={i} className={`rounded-full transition-all duration-300 ${
                                    i < stepIndex  ? 'w-2 h-2 bg-emerald-400' :
                                    i === stepIndex ? 'w-3 h-3 bg-blue-600' :
                                                      'w-2 h-2 bg-slate-200'
                                }`} />
                            ))}
                        </div>
                    </div>
                </PageHeader>

                {/* ── Step Indicator ──────────────────────────────────────────── */}
                <div className="flex items-start gap-0 mb-10">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    i < stepIndex
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                        : i === stepIndex
                                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                                        : 'bg-white border border-slate-200 text-slate-300'
                                }`}>
                                    {i < stepIndex ? <Check size={15} /> : s.icon}
                                </div>
                                <span className={`text-[10px] font-black tracking-wide text-center whitespace-nowrap transition-colors ${
                                    i < stepIndex ? 'text-emerald-500' :
                                    i === stepIndex ? 'text-slate-900' : 'text-slate-300'
                                }`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-px mt-5 mx-3 transition-all duration-300 ${
                                    i < stepIndex ? 'bg-emerald-300' : 'bg-slate-200'
                                }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Step Content Card ────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className={`h-1 w-full transition-colors duration-300 ${
                        step === 'sign' ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}></div>

                    <div className="p-8 md:p-10">
                        <div className="max-w-2xl mx-auto">

                            {/* ── Step 1: GPS 現場簽到 ─────────────────────────── */}
                            {step === 'gps' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">步驟 01</div>
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">現場簽到</h2>
                                        <p className="text-slate-500 text-sm font-medium">取得當前 GPS 位置，確認已到達案件現場。</p>
                                    </div>

                                    {gpsStatus !== 'done' ? (
                                        <button
                                            onClick={handleGpsCapture}
                                            disabled={gpsStatus === 'loading'}
                                            className="w-full py-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {gpsStatus === 'loading' ? (
                                                <>
                                                    <Loader2 size={32} className="animate-spin text-blue-600" />
                                                    <span className="text-sm font-bold text-blue-600">定位中，請稍候…</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
                                                        <MapPin size={28} />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">點擊取得 GPS 位置</span>
                                                    <span className="text-[11px] text-slate-400">需要開啟定位與相機權限</span>
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden">
                                            <div className="h-0.5 bg-emerald-500 w-full"></div>
                                            <div className="p-5 space-y-3">
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                                                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                                                        <Check size={13} />
                                                    </div>
                                                    到場簽到完成
                                                </div>
                                                <div className="space-y-2.5 pt-1">
                                                    {[
                                                        { label: '地點', value: gpsCoords?.address },
                                                        { label: '座標', value: `${gpsCoords?.lat.toFixed(6)}, ${gpsCoords?.lng.toFixed(6)}`, mono: true },
                                                        { label: '時間', value: gpsTime },
                                                    ].map(row => (
                                                        <div key={row.label} className="flex gap-3 text-sm">
                                                            <span className="text-slate-400 shrink-0 text-[10px] font-black uppercase tracking-widest w-10 pt-0.5">{row.label}</span>
                                                            <span className={`${row.mono ? 'font-mono text-xs text-slate-500' : 'text-slate-700 font-medium'}`}>{row.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setStep('form')}
                                        disabled={gpsStatus !== 'done'}
                                        className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                                    >
                                        下一步：填寫稽查紀錄單 →
                                    </button>
                                </div>
                            )}

                            {/* ── Step 2: 動物保護稽查紀錄單 ──────────────────── */}
                            {step === 'form' && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">步驟 02</div>
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">動物保護稽查紀錄單</h2>
                                        <p className="text-slate-500 text-sm font-medium">
                                            案件 <span className="font-mono text-slate-600">{caseId}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">處理人員</label>
                                                <TextInput type="text" value={handlerName} onChange={e => setHandlerName(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">識別編號</label>
                                                <TextInput type="text" value={handlerBadge} onChange={e => setHandlerBadge(e.target.value)} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                                {isBee ? '蜂窩數量（巢）' : '出動人數'}
                                            </label>
                                            <TextInput
                                                type="number"
                                                value={vehicleCount}
                                                onChange={e => setVehicleCount(e.target.value)}
                                                placeholder={isBee ? '例：2' : '例：3'}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">處置方式</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(isBee
                                                    ? ['現場摘除', '誘捕籠安置', '藥劑處理', '轉介專業廠商']
                                                    : ['現場處理完畢', '轉送收容所', '轉介醫療', '持續追蹤']
                                                ).map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setProcessingResult(opt)}
                                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                                                            processingResult === opt
                                                                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                                                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-white'
                                                        }`}
                                                    >
                                                        {processingResult === opt && (
                                                            <Check size={10} className="inline mr-1 text-blue-600" />
                                                        )}
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">現場備注</label>
                                            <Textarea
                                                value={note}
                                                onChange={e => setNote(e.target.value)}
                                                placeholder="輸入現場處理情況說明…"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-1">
                                        <button onClick={() => setStep('gps')} className="py-3 px-5 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
                                            上一步
                                        </button>
                                        <button onClick={() => setStep('photo')} className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10">
                                            下一步：上傳現場照片 →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: 現場照片 ──────────────────────────────── */}
                            {step === 'photo' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">步驟 03</div>
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">現場照片</h2>
                                        <p className="text-slate-500 text-sm font-medium">照片將自動壓印 GPS 座標與時間浮水印。</p>
                                    </div>

                                    {!photoMock ? (
                                        <button
                                            type="button"
                                            onClick={() => setPhotoMock(true)}
                                            className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center gap-3 group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all">
                                                <Camera size={28} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">點擊拍照 / 上傳（模擬）</span>
                                        </button>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                                            <div className="aspect-video bg-slate-100 flex items-center justify-center">
                                                <Camera size={48} className="text-slate-300" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-2 flex items-center justify-between">
                                                <span className="text-[10px] font-mono text-emerald-400">
                                                    {gpsCoords?.lat.toFixed(6)}, {gpsCoords?.lng.toFixed(6)}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                                                    <Clock size={10} /> {gpsTime}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setPhotoMock(false)}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep('form')} className="py-3 px-5 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
                                            上一步
                                        </button>
                                        <button
                                            onClick={() => setStep('sign')}
                                            disabled={!photoMock}
                                            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                                        >
                                            下一步：電子簽核 →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 4: 電子簽核 ──────────────────────────────── */}
                            {step === 'sign' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">步驟 04</div>
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">電子簽核</h2>
                                        <p className="text-slate-500 text-sm font-medium">確認資料無誤後輸入姓名完成電子簽核並送出。</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-3 border-b border-slate-200 bg-white">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">回報摘要</span>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            {[
                                                { label: '案件', value: caseItem?.title ?? caseId },
                                                { label: '到場', value: gpsTime },
                                                { label: '地點', value: gpsCoords?.address ?? '-' },
                                                { label: '人員', value: `${handlerName}（${handlerBadge}）` },
                                                { label: '處置', value: processingResult || '（未填）' },
                                                { label: '備注', value: note || '（無）' },
                                            ].map(row => (
                                                <div key={row.label} className="flex gap-3 text-sm">
                                                    <span className="text-slate-400 shrink-0 w-8 text-[10px] font-black uppercase tracking-widest pt-0.5">{row.label}</span>
                                                    <span className="text-slate-700 font-medium leading-snug">{row.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                            簽核人姓名（電子簽核）
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={signName}
                                            onChange={e => setSignName(e.target.value)}
                                            placeholder="輸入姓名以確認送出"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setStep('photo')} className="py-3 px-5 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
                                            上一步
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!signName.trim() || submitting}
                                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                                        >
                                            {submitting
                                                ? <><Loader2 size={16} className="animate-spin" /> 送出中…</>
                                                : <><Shield size={14} /> 確認送出回報</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
