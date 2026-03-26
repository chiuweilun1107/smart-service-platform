import { useState, useEffect } from 'react';
import { X, Phone, MapPin, User, Calendar, Tag, FileText, AlertCircle } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { QuickActionButtons } from './QuickActionButtons';
import type { Case } from '../types/schema';

interface CaseDetailPanelProps {
    caseId?: string;
    onClose?: () => void;
}

const statusLabels: Record<string, string> = {
    'pending': '待處理',
    'authorized': '已授理',
    'assigned': '已分派',
    'processing': '處理中',
    'transferred': '轉移中',
    'completed': '已完成',
    'resolved': '已結案',
    'rejected': '責撤',
    'overdue': '超期',
    'archived': '歸檔',
};

const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'authorized': 'bg-blue-100 text-blue-800',
    'assigned': 'bg-indigo-100 text-indigo-800',
    'processing': 'bg-purple-100 text-purple-800',
    'transferred': 'bg-pink-100 text-pink-800',
    'completed': 'bg-green-100 text-green-800',
    'resolved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'overdue': 'bg-orange-100 text-orange-800',
    'archived': 'bg-gray-100 text-gray-800',
};

const priorityLabels: Record<string, string> = {
    'critical': '最緊急',
    'high': '高',
    'medium': '普通',
    'low': '低',
};

const priorityColors: Record<string, string> = {
    'critical': 'bg-red-100 text-red-800',
    'high': 'bg-orange-100 text-orange-800',
    'medium': 'bg-blue-100 text-blue-800',
    'low': 'bg-gray-100 text-gray-800',
};

const typeLabels: Record<string, string> = {
    'general': '一般案件',
    'bee': '蜂蛇案件',
    '1999': '1999 通報',
    '1959': '1959 救援',
};

export function CaseDetailPanel({ caseId, onClose }: CaseDetailPanelProps) {
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (caseId) {
            loadCaseDetail();
        }
    }, [caseId]);

    const loadCaseDetail = async () => {
        if (!caseId) return;
        try {
            setLoading(true);
            const detail = await mockApi.getCaseById(caseId);
            setCaseData(detail);
        } catch (error) {
            console.error('Failed to load case detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!caseId) {
        return null;
    }

    return (
        <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">
            {/* 頭部 */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white z-10">
                <h2 className="text-lg font-black text-slate-900">案件詳情</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <X size={18} className="text-slate-600" />
                </button>
            </div>

            {/* 內容 */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="text-slate-400">載入中...</div>
                </div>
            ) : caseData ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* 案件標題 */}
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                            {caseData.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">{caseData.id}</p>
                    </div>

                    {/* 基本信息 */}
                    <div className="space-y-3">
                        {/* 案件類型 */}
                        <div className="flex items-center gap-3">
                            <Tag size={18} className="text-slate-400 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-slate-500">案件類型</div>
                                <div className="font-semibold text-slate-900">
                                    {typeLabels[caseData.type]}
                                </div>
                            </div>
                        </div>

                        {/* 狀態 */}
                        <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-slate-400 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="text-xs text-slate-500 mb-1">狀態</div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[caseData.status]}`}>
                                        {statusLabels[caseData.status]}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[caseData.priority]}`}>
                                        {priorityLabels[caseData.priority]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 地點 */}
                        {caseData.location && (
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs text-slate-500">地點</div>
                                    <div className="font-semibold text-slate-900">
                                        {caseData.location}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 日期 */}
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-slate-400 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-slate-500">通報日期</div>
                                <div className="font-semibold text-slate-900">
                                    {new Date(caseData.date).toLocaleDateString('zh-TW')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 分隔線 */}
                    <hr className="border-slate-200" />

                    {/* 通報人信息 */}
                    <div>
                        <h4 className="font-black text-slate-900 text-sm mb-3">通報人信息</h4>
                        <div className="space-y-3">
                            {caseData.reporterName && (
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-slate-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-slate-500">姓名</div>
                                        <div className="font-semibold text-slate-900">
                                            {caseData.reporterName}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {caseData.reporterPhone && (
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-slate-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-slate-500">聯絡電話</div>
                                        <div className="font-semibold text-slate-900">
                                            {caseData.reporterPhone}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 案件描述 */}
                    {caseData.description && (
                        <div>
                            <h4 className="font-black text-slate-900 text-sm mb-2">案件描述</h4>
                            <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                                {caseData.description}
                            </div>
                        </div>
                    )}

                    {/* 備註 */}
                    {caseData.notes && (
                        <div>
                            <h4 className="font-black text-slate-900 text-sm mb-2">備註</h4>
                            <div className="flex gap-2">
                                <FileText size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {caseData.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 時間戳記 */}
                    <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                        <div className="flex justify-between">
                            <span>建立時間：</span>
                            <span>{new Date(caseData.createdAt).toLocaleString('zh-TW')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>更新時間：</span>
                            <span>{new Date(caseData.updatedAt).toLocaleString('zh-TW')}</span>
                        </div>
                        {caseData.signedAt && (
                            <div className="flex justify-between">
                                <span>簽收時間：</span>
                                <span>{new Date(caseData.signedAt).toLocaleString('zh-TW')}</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-40">
                    <div className="text-slate-400">無法加載案件信息</div>
                </div>
            )}

            {/* 快速操作按鈕 */}
            {caseData && (
                <div className="border-t border-slate-200 p-4 bg-white">
                    <QuickActionButtons
                        caseData={caseData}
                        onAuthorize={() => console.log('Authorize case:', caseData.id)}
                        onReject={() => console.log('Reject case:', caseData.id)}
                        onSupervise={() => console.log('Supervise case:', caseData.id)}
                    />
                </div>
            )}
        </div>
    );
}
