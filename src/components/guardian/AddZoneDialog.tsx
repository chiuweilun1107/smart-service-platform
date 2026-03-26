import React, { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';

interface AddZoneDialogProps {
  pendingCenter: [number, number] | null;
  onConfirm: (name: string, radius: 500 | 1000 | 2000) => void;
  onCancel: () => void;
}

const RADIUS_OPTIONS: { value: 500 | 1000 | 2000; label: string }[] = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
];

export const AddZoneDialog: React.FC<AddZoneDialogProps> = ({
  pendingCenter,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [radius, setRadius] = useState<500 | 1000 | 2000>(1000);

  const handleSubmit = () => {
    if (!name.trim() || !pendingCenter) return;
    onConfirm(name.trim(), radius);
    setName('');
    setRadius(1000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl w-[300px] overflow-hidden">
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <MapPin size={18} />
          </div>
          <h3 className="text-sm font-black text-white tracking-tight">
            新增守護範圍
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {!pendingCenter ? (
          <div className="text-center py-6">
            <div className="relative mx-auto w-12 h-12 mb-3">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-dashed border-blue-500/40">
                <MapPin size={20} className="text-blue-400" />
              </div>
            </div>
            <p className="text-sm font-bold text-white">點擊地圖以設定守護中心</p>
            <p className="text-[10px] text-slate-400 mt-1">
              選擇您想守護的位置
            </p>
          </div>
        ) : (
          <>
            {/* Location confirmed */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
              <Check size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                已選定位置 ({pendingCenter[0].toFixed(4)},{' '}
                {pendingCenter[1].toFixed(4)})
              </span>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                守護範圍名稱
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：我家、小孩學校"
                maxLength={20}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Radius selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                守護半徑
              </label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRadius(opt.value)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      radius === opt.value
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-400 bg-white/5 hover:bg-white/10 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  name.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-600/20'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                確認新增
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
