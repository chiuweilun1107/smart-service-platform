import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Camera, FileText, CheckSquare, ArrowLeft, Loader2, Check, Clock, Shield, X } from 'lucide-react';
import type { CaseMarker } from '../../components/map/CaseMap';

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
        // Persist resolved case ID so MapView can read it on re-mount
        const existing = JSON.parse(sessionStorage.getItem('resolved_cases') ?? '[]') as string[];
        if (caseId && !existing.includes(caseId)) existing.push(caseId);
        sessionStorage.setItem('resolved_cases', JSON.stringify(existing));
        setTimeout(() => navigate('/map'), 1500);
    };

    const isBee = caseItem?.type === 'bee';

    const fieldStyle = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all';

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col pt-24 pb-20">

            {/* Page header */}
            <div className="px-4 mb-6">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all shrink-0"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                                外勤回報作業
                            </div>
                            <div className="text-sm font-black text-slate-900 leading-tight truncate">
                                {caseItem?.title ?? `案件 ${caseId}`}
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 shrink-0">
                            步驟 {stepIndex + 1} / {STEPS.length}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex gap-1">
                        {STEPS.map((s, i) => (
                            <div
                                key={s.id}
                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-blue-600' : 'bg-slate-200'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 max-w-lg mx-auto w-full">

                {/* Step labels */}
                <div className="flex gap-4 mb-8 overflow-x-auto">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className={`flex items-center gap-1.5 text-[11px] font-bold shrink-0 transition-colors ${
                            i < stepIndex  ? 'text-emerald-500' :
                            i === stepIndex ? 'text-slate-900'   : 'text-slate-300'
                        }`}>
                            {i < stepIndex ? <Check size={12} /> : s.icon}
                            {s.label}
                        </div>
                    ))}
                </div>

                {/* ── Step 1: GPS 現場簽到 ─────────────────────────────────────── */}
                {step === 'gps' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">現場簽到</h2>
                            <p className="text-slate-500 text-sm">取得當前 GPS 位置，確認已到達案件現場。</p>
                        </div>

                        {gpsStatus !== 'done' ? (
                            <button
                                onClick={handleGpsCapture}
                                disabled={gpsStatus === 'loading'}
                                className="w-full py-10 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 text-slate-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {gpsStatus === 'loading' ? (
                                    <>
                                        <Loader2 size={36} className="animate-spin text-blue-600" />
                                        <span className="text-sm font-bold">定位中，請稍候…</span>
                                    </>
                                ) : (
                                    <>
                                        <MapPin size={36} />
                                        <span className="text-sm font-bold">點擊取得 GPS 位置</span>
                                        <span className="text-[11px] text-slate-400">需要開啟定位與相機權限</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-3">
                                <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                                    <Check size={16} />
                                    到場簽到完成
                                </div>
                                <div className="space-y-2.5">
                                    {[
                                        { label: '地點', value: gpsCoords?.address },
                                        { label: '座標', value: `${gpsCoords?.lat.toFixed(6)}, ${gpsCoords?.lng.toFixed(6)}`, mono: true },
                                        { label: '時間', value: gpsTime },
                                    ].map(row => (
                                        <div key={row.label} className="flex gap-3 text-sm">
                                            <span className="text-slate-400 shrink-0 text-[11px] font-bold uppercase w-10">{row.label}</span>
                                            <span className={`${row.mono ? 'font-mono text-xs text-slate-500' : 'text-slate-700'}`}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setStep('form')}
                            disabled={gpsStatus !== 'done'}
                            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            下一步：填寫稽查紀錄單 →
                        </button>
                    </div>
                )}

                {/* ── Step 2: 動物保護稽查紀錄單 (三聯單) ────────────────────── */}
                {step === 'form' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">動物保護稽查紀錄單</h2>
                            <p className="text-slate-500 text-sm">
                                案件 {caseId} ·{' '}
                                <span className={`font-bold ${isBee ? 'text-orange-500' : 'text-blue-600'}`}>
                                    {isBee ? '捕蜂抓蛇' : '一般救援'}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">處理人員</label>
                                    <input type="text" value={handlerName} onChange={e => setHandlerName(e.target.value)} className={fieldStyle} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">識別編號</label>
                                    <input type="text" value={handlerBadge} onChange={e => setHandlerBadge(e.target.value)} className={fieldStyle} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                    {isBee ? '蜂窩數量（巢）' : '出動人數'}
                                </label>
                                <input
                                    type="number"
                                    value={vehicleCount}
                                    onChange={e => setVehicleCount(e.target.value)}
                                    placeholder={isBee ? '例：2' : '例：3'}
                                    className={fieldStyle}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">處置方式</label>
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
                                                    ? 'bg-blue-50 border-blue-600 text-blue-600'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">現場備注</label>
                                <textarea
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    placeholder="輸入現場處理情況說明…"
                                    rows={3}
                                    className={`${fieldStyle} resize-none`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button onClick={() => setStep('gps')} className="py-3 px-5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-400 transition-all">
                                上一步
                            </button>
                            <button onClick={() => setStep('photo')} className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-95">
                                下一步：上傳現場照片 →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: 現場照片 ──────────────────────────────────────────── */}
                {step === 'photo' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">現場照片</h2>
                            <p className="text-slate-500 text-sm">照片將自動壓印 GPS 座標與時間浮水印。</p>
                        </div>

                        {!photoMock ? (
                            <button
                                type="button"
                                onClick={() => setPhotoMock(true)}
                                className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-600"
                            >
                                <Camera size={36} />
                                <span className="text-sm font-bold">點擊拍照 / 上傳（模擬）</span>
                            </button>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                                    <Camera size={48} className="text-slate-300" />
                                </div>
                                {/* Simulated GPS+time watermark overlay */}
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
                            <button onClick={() => setStep('form')} className="py-3 px-5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-400 transition-all">
                                上一步
                            </button>
                            <button
                                onClick={() => setStep('sign')}
                                disabled={!photoMock}
                                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                下一步：電子簽核 →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 4: 電子簽核 ──────────────────────────────────────────── */}
                {step === 'sign' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 mb-1">電子簽核</h2>
                            <p className="text-slate-500 text-sm">確認資料無誤後輸入姓名完成電子簽核並送出。</p>
                        </div>

                        {/* Summary */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">回報摘要</div>
                            {[
                                { label: '案件',   value: caseItem?.title ?? caseId },
                                { label: '到場',   value: gpsTime },
                                { label: '地點',   value: gpsCoords?.address ?? '-' },
                                { label: '人員',   value: `${handlerName}（${handlerBadge}）` },
                                { label: '處置',   value: processingResult || '（未填）' },
                                { label: '備注',   value: note || '（無）' },
                            ].map(row => (
                                <div key={row.label} className="flex gap-3 text-sm">
                                    <span className="text-slate-400 shrink-0 w-8 text-[11px] font-bold">{row.label}</span>
                                    <span className="text-slate-700 leading-snug">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                簽核人姓名（電子簽核）
                            </label>
                            <input
                                type="text"
                                value={signName}
                                onChange={e => setSignName(e.target.value)}
                                placeholder="輸入姓名以確認送出"
                                className={fieldStyle}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setStep('photo')} className="py-3 px-5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-400 transition-all">
                                上一步
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!signName.trim() || submitting}
                                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    );
};
