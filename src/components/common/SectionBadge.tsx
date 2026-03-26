import React from 'react';

type BadgeColor = 'blue' | 'emerald' | 'amber' | 'slate' | 'rose';

interface SectionBadgeProps {
    label: string;
    color?: BadgeColor;
}

const COLOR_MAP: Record<BadgeColor, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
};

export const SectionBadge: React.FC<SectionBadgeProps> = ({ label, color = 'blue' }) => {
    return (
        <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${COLOR_MAP[color]}`}
        >
            {label}
        </div>
    );
};
