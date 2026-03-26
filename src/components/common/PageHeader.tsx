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
    layout?: 'stacked' | 'split';
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
    layout = 'stacked',
    children,
}) => {
    if (layout === 'split') {
        return (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                <div className="flex-1 min-w-0">
                    <SectionBadge label={badge} color={badgeColor} />
                    <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className={`mt-3 text-base text-slate-500 font-medium border-l-4 pl-5 ${SUBTITLE_BORDER_MAP[subtitleBorderColor]}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {children && (
                    <div className="w-full lg:w-[520px] flex-shrink-0">
                        {children}
                    </div>
                )}
            </div>
        );
    }

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
