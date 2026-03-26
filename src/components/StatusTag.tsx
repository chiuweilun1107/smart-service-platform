import { AlertCircle, CheckCircle, Clock, X, Zap, Archive } from 'lucide-react';
import type { CaseStatus, CasePriority } from '../types/schema';

interface StatusTagProps {
    status: CaseStatus | CasePriority;
    type?: 'status' | 'priority';
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<CaseStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    'pending': {
        label: '待處理',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: <Clock size={14} />
    },
    'authorized': {
        label: '已授理',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        icon: <CheckCircle size={14} />
    },
    'assigned': {
        label: '已分派',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
        icon: <Zap size={14} />
    },
    'processing': {
        label: '處理中',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        icon: <Clock size={14} />
    },
    'transferred': {
        label: '轉移中',
        color: 'text-pink-700',
        bgColor: 'bg-pink-100',
        icon: <Zap size={14} />
    },
    'completed': {
        label: '已完成',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: <CheckCircle size={14} />
    },
    'resolved': {
        label: '已結案',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: <CheckCircle size={14} />
    },
    'rejected': {
        label: '責撤',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: <X size={14} />
    },
    'overdue': {
        label: '超期',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: <AlertCircle size={14} />
    },
    'archived': {
        label: '歸檔',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        icon: <Archive size={14} />
    }
};

const priorityConfig: Record<CasePriority, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    'critical': {
        label: '最緊急',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: <AlertCircle size={14} />
    },
    'high': {
        label: '高',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: <AlertCircle size={14} />
    },
    'medium': {
        label: '普通',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        icon: <Clock size={14} />
    },
    'low': {
        label: '低',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        icon: <Clock size={14} />
    }
};

const sizeClasses = {
    'sm': 'px-2 py-1 text-xs',
    'md': 'px-3 py-1.5 text-sm',
    'lg': 'px-4 py-2 text-base'
};

export function StatusTag({ status, type = 'status', size = 'md' }: StatusTagProps) {
    const config = type === 'status' ? statusConfig[status as CaseStatus] : priorityConfig[status as CasePriority];

    if (!config) {
        return null;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${config.bgColor} ${config.color} ${sizeClasses[size]}`}
        >
            {config.icon}
            {config.label}
        </span>
    );
}

export function StatusTagGroup({ status, priority, size = 'md' }: { status: CaseStatus; priority: CasePriority; size?: 'sm' | 'md' | 'lg' }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <StatusTag status={status} type="status" size={size} />
            <StatusTag status={priority} type="priority" size={size} />
        </div>
    );
}
