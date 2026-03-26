import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import type { Case } from '../types/schema';

interface QuickActionButtonsProps {
    caseData?: Case;
    onAuthorize?: () => void;
    onReject?: () => void;
    onSupervise?: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export function QuickActionButtons({
    caseData,
    onAuthorize,
    onReject,
    onSupervise,
    isLoading = false,
    isDisabled = false
}: QuickActionButtonsProps) {
    if (!caseData) {
        return null;
    }

    // 根據案件狀態判斷按鈕是否可用
    const canAuthorize = caseData.status === 'pending' || caseData.status === 'authorized';
    const canReject = caseData.status !== 'resolved' && caseData.status !== 'rejected' && caseData.status !== 'archived';
    const canSupervise = caseData.status === 'processing' || caseData.status === 'overdue';

    return (
        <div className="space-y-2">
            {/* 授理按鈕 */}
            <button
                onClick={onAuthorize}
                disabled={!canAuthorize || isLoading || isDisabled}
                className={`w-full py-3 px-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${
                    canAuthorize
                        ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                {isLoading && <Loader size={16} className="animate-spin" />}
                <CheckCircle size={16} />
                授理
            </button>

            {/* 責撤按鈕 */}
            <button
                onClick={onReject}
                disabled={!canReject || isLoading || isDisabled}
                className={`w-full py-3 px-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${
                    canReject
                        ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                <XCircle size={16} />
                責撤
            </button>

            {/* 督促按鈕 */}
            <button
                onClick={onSupervise}
                disabled={!canSupervise || isLoading || isDisabled}
                className={`w-full py-3 px-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${
                    canSupervise
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                <AlertCircle size={16} />
                督促
            </button>
        </div>
    );
}
