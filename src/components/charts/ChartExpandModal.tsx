import React from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ChartExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  chartNode: ReactNode;
  columns: string[];
  rows: (string | number)[][];
}

export const ChartExpandModal: React.FC<ChartExpandModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  chartNode,
  columns,
  rows,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-[90vw] h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Chart */}
          <div className="flex-1 flex flex-col justify-center px-6 py-4 border-r border-slate-100 overflow-hidden">
            {chartNode}
          </div>

          {/* Right: Table */}
          <div className="w-[420px] flex flex-col flex-shrink-0">
            <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                資料明細
              </p>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className={`px-4 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-100 ${
                          i === 0 ? 'text-left' : 'text-right'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className={`${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-blue-50/50 transition-colors`}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`px-4 py-2.5 text-xs border-b border-slate-50 ${
                            ci === 0
                              ? 'font-bold text-slate-700 text-left'
                              : 'font-medium text-slate-600 text-right tabular-nums'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
