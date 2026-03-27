import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FormSection, FieldLabel, PhotoUpload, PageHeader, TextInput, Textarea, SelectInput } from '../../components/common';
import { btn } from '../../utils/typography';

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
        <div className="min-h-screen bg-slate-50 overflow-hidden">
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
                            優先級：緊急
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 pt-20 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <PageHeader
                        badge={isEmergency ? '緊急案件通道' : isBee ? '蜂蛇移除通報' : '一般案件通報'}
                        badgeColor={isEmergency ? 'rose' : isBee ? 'amber' : 'blue'}
                        title={isEmergency ? '緊急案件通報' : isBee ? '蜂蛇移除通報' : '一般案件通報'}
                        subtitle={isEmergency
                            ? '此為高優先級緊急案件，系統將優先調度並立即派遣最近單位處置。'
                            : '請提供詳細資訊，系統將自動分析並指派最合適的勤務單位進行處置。'
                        }
                    />

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
                                        <SelectInput
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            options={[
                                                { value: '新北市 - 板橋區', label: '新北市 - 板橋區' },
                                                { value: '新北市 - 新莊區', label: '新北市 - 新莊區' },
                                                { value: '新北市 - 中和區', label: '新北市 - 中和區' },
                                                { value: '新北市 - 永和區', label: '新北市 - 永和區' },
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <FieldLabel>精確地址</FieldLabel>
                                        <TextInput
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="例如：四川路一段 157 巷口..."
                                            variant="light"
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
                                    <Textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="請描述現場動物狀況、數量、種類，或蜂巢概略位置高度..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <FieldLabel>聯絡人姓名 (選填)</FieldLabel>
                                        <TextInput
                                            type="text"
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            variant="light"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <FieldLabel>手機聯絡電話</FieldLabel>
                                        <TextInput
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            variant="light"
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
                                    加密上傳通道
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
                                返回上一步
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
                            端對端加密保護 • 市民保護協定
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
