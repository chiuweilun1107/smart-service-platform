import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FormSection, FieldLabel, PhotoUpload } from '../../components/common';
import { typo, input, btn } from '../../utils/typography';

export const Report: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isBee = searchParams.get('type') === 'bee';
    const isEmergency = searchParams.get('emergency') === 'true';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-filled Form Data
    const [region, setRegion] = useState('新北市 - 板橋區');
    const [address, setAddress] = useState('四川路一段 157 巷口 7-11 前');
    const [description, setDescription] = useState('發現一隻橘色浪貓，左前腳似乎受傷跛行，但在路邊坐著不動，希望能派員協助救援。');
    const [contactName, setContactName] = useState('王小明');
    const [phone, setPhone] = useState('0912-345-678');
    const [photos, setPhotos] = useState<File[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionSuccess, setDetectionSuccess] = useState(false);

    const handleGeoDetect = async () => {
        setIsDetecting(true);
        setDetectionSuccess(false);

        // Mock geolocation detection (simulating GPS + Geocoding)
        setTimeout(() => {
            // Mock detected location data
            const mockLocations = [
                { region: '新北市 - 板橋區', address: '四川路一段 157 巷口 7-11 前' },
                { region: '新北市 - 板橋區', address: '縣民大道二段 7 號附近' },
                { region: '新北市 - 新莊區', address: '中正路 516 號前' },
                { region: '新北市 - 板橋區', address: '文化路一段 188 巷 5 弄口' },
            ];
            const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

            setRegion(randomLocation.region);
            setAddress(randomLocation.address);
            setIsDetecting(false);
            setDetectionSuccess(true);

            // Hide success indicator after 2 seconds
            setTimeout(() => setDetectionSuccess(false), 2000);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/status?id=ANS-20231120001');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white pb-40 overflow-hidden">
            {/* Emergency Alert Banner */}
            {isEmergency && (
                <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 shadow-2xl animate-in slide-in-from-top-5">
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl animate-pulse">
                            !!!
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-lg tracking-tight">緊急案件快速通道</h3>
                            <p className="text-sm text-white/90 font-medium">此案件已標記為高優先級，將優先處理並立即派遣</p>
                        </div>
                        <div className="px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                            PRIORITY: URGENT
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 px-6" style={{ paddingTop: isEmergency ? '8rem' : '6rem' }}>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl font-black text-xl ${isEmergency
                            ? 'bg-red-600 animate-pulse'
                            : isBee
                                ? 'bg-orange-500'
                                : 'bg-slate-900'
                            }`}>
                            {isEmergency ? '!!!' : isBee ? 'B' : 'A'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 mb-4">
                                {isEmergency ? '緊急案件通道' : isBee ? '蜂蛇移除通報' : '一般案件通報'}
                            </div>
                            <h1 className={`${typo.h1} lg:text-5xl font-black tracking-tighter text-slate-900 uppercase mb-4`}>
                                {isEmergency ? '緊急案件' : isBee ? '蜂蛇移除' : '一般案件'}<br />
                                <span className={isEmergency ? 'text-red-600' : isBee ? 'text-orange-500' : 'text-blue-600'}>通報程序系統</span>
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {isEmergency
                                    ? '此為高優先級緊急案件，系統將優先調度並立即派遣最近單位處置。'
                                    : '請提供詳細資訊，系統將自動分析並指派最合適的勤務單位進行處置。'
                                }
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {/* Section 01: Location */}
                        <FormSection
                            number="01"
                            title="地理座標數據"
                            headerRight={
                                <button
                                    type="button"
                                    onClick={handleGeoDetect}
                                    disabled={isDetecting}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDetecting
                                        ? 'bg-blue-600 text-white cursor-wait'
                                        : detectionSuccess
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                                        }`}
                                >
                                    {isDetecting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            定位中...
                                        </>
                                    ) : detectionSuccess ? (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            定位成功
                                        </>
                                    ) : (
                                        '定址偵測'
                                    )}
                                </button>
                            }
                        >
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <FieldLabel>通報區域</FieldLabel>
                                        <select
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            className={`${input.base} ${input.light} font-bold`}
                                        >
                                            <option>新北市 - 板橋區</option>
                                            <option>新北市 - 新莊區</option>
                                            <option>新北市 - 中和區</option>
                                            <option>新北市 - 永和區</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <FieldLabel>精確地址</FieldLabel>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="例如：四川路一段 157 巷口..."
                                            className={`${input.base} ${input.light} font-bold placeholder:text-slate-300`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        {/* Section 02: Description */}
                        <FormSection number="02" title="案件詳情簡述">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <FieldLabel>具體情況描述</FieldLabel>
                                    <textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="請描述現場動物狀況、數量、種類，或蜂巢概略位置高度..."
                                        className={`${input.base} ${input.light} font-bold placeholder:text-slate-300`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <FieldLabel>聯絡人姓名 (選填)</FieldLabel>
                                        <input
                                            type="text"
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            className={`${input.base} ${input.light} font-bold`}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <FieldLabel>手機聯絡電話</FieldLabel>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`${input.base} ${input.light} font-bold`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </FormSection>

                        {/* Section 03: Photo Upload */}
                        <FormSection
                            number="03"
                            title="視覺影像上傳"
                            headerRight={
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    ENCRYPTED CHANNEL
                                </span>
                            }
                        >
                            <PhotoUpload
                                photos={photos}
                                onChange={setPhotos}
                            />
                        </FormSection>

                        {/* Submit Button */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-10">
                            <Link to="/smart-guide" className={`w-full ${btn.lg} rounded-xl bg-white border border-slate-200 text-slate-600 uppercase tracking-[0.2em] flex items-center justify-center hover:border-slate-400 transition-all`}>
                                STEP BACK
                            </Link>

                            <button
                                type="submit"
                                disabled={isSubmitting || (isBee ? false : photos.length === 0)}
                                className={`md:col-span-2 w-full ${btn.lg} rounded-xl uppercase tracking-[0.2em] text-white shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all
                                    ${isSubmitting
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : isBee
                                            ? 'bg-orange-600 hover:bg-orange-500'
                                            : 'bg-slate-900 hover:bg-blue-600'
                                    }`}
                            >
                                {isSubmitting ? '正在提交...' : '發送正式通報單'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-20 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                            End-to-End Encryption Secured • Citizens Protection Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
