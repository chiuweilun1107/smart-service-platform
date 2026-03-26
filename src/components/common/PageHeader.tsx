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
        <div className="flex flex-col gap-4 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div>
                <SectionBadge label={badge} color={badgeColor} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                {title}
            </h1>
            {subtitle && (
                <p className={`mt-3 text-base md:text-lg text-slate-500 font-medium border-l-4 pl-5 ${SUBTITLE_BORDER_MAP[subtitleBorderColor]}`}>
                    {subtitle}
                </p>
            )}
            {children && (
                <div className="mt-6 w-full">
                    {children}
                </div>
            )}
        </div>
    );
};
