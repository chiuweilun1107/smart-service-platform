import React from 'react';
import type { ReactNode } from 'react';

interface FormSectionProps {
    number: string;
    title: string;
    children: ReactNode;
    headerRight?: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
    number,
    title,
    children,
    headerRight,
}) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300">
            <div className="h-1 bg-blue-600 w-full"></div>
            <div className="p-8 md:p-12">
                <div className={`flex items-center ${headerRight ? 'justify-between' : ''} gap-4 mb-8`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {number}
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                            {title}
                        </h2>
                    </div>
                    {headerRight && (
                        <div className="shrink-0">
                            {headerRight}
                        </div>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
