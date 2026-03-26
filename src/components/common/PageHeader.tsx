import React from 'react';
import { SectionBadge } from './SectionBadge';
import type { ReactNode } from 'react';

type BadgeColor = 'blue' | 'emerald' | 'amber' | 'slate' | 'rose';

interface PageHeaderProps {
    badge: string;
    badgeColor?: BadgeColor;
    title: string | ReactNode;
    subtitle?: string;
    subtitleBorderColor?: 'blue' | 'slate';
    children?: ReactNode;
}

const SUBTITLE_BORDER_MAP = {
    blue: 'border-blue-600',
    slate: 'border-slate-200',
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    badge,
    badgeColor = 'blue',
    title,
    subtitle,
    subtitleBorderColor = 'blue',
    children,
}) => {
    return (
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <SectionBadge label={badge} color={badgeColor} />
                </div>
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase">
                    {title}
                </h1>
                {subtitle && (
                    <p className={`mt-8 text-slate-500 text-xl font-medium border-l-4 pl-6 ${SUBTITLE_BORDER_MAP[subtitleBorderColor]}`}>
                        {subtitle}
                    </p>
                )}
            </div>
            {children && (
                <div className="w-full lg:w-96 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
};
