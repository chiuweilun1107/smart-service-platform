import { Calendar, Loader } from 'lucide-react';

interface DateRangeSelectorProps {
  value?: 'today' | 'week' | 'month' | 'quarter';
  onChange?: (range: 'today' | 'week' | 'month' | 'quarter') => void;
  isLoading?: boolean;
}

export function DateRangeSelector({
  value = 'month',
  onChange,
  isLoading = false
}: DateRangeSelectorProps) {
  const ranges = [
    { id: 'today', label: '今日' },
    { id: 'week', label: '本週' },
    { id: 'month', label: '本月' },
    { id: 'quarter', label: '本季' },
  ] as const;

  const handleSelect = (rangeId: 'today' | 'week' | 'month' | 'quarter') => {
    onChange?.(rangeId);
  };

  return (
    <div className="flex gap-3 items-center">
      <Calendar size={18} className="text-slate-400" />
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {ranges.map(range => (
          <button
            key={range.id}
            onClick={() => handleSelect(range.id)}
            disabled={isLoading}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              value === range.id
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-900'
            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading && value === range.id ? (
              <Loader size={12} className="animate-spin" />
            ) : null}
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
