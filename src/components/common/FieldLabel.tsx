import React from 'react';

interface FieldLabelProps {
    children: React.ReactNode;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ children }) => {
    return (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {children}
        </label>
    );
};
