// 字體 Scale
export const typo = {
  hero:    'text-3xl sm:text-5xl lg:text-7xl leading-tight',
  h1:      'text-2xl sm:text-4xl lg:text-5xl leading-tight',
  h2:      'text-xl sm:text-2xl lg:text-3xl leading-snug',
  h3:      'text-base sm:text-lg lg:text-xl leading-snug',
  body:    'text-sm sm:text-base leading-relaxed',
  caption: 'text-xs leading-normal',
  badge:   'text-[10px] font-black uppercase tracking-widest',
} as const;

// 輸入欄位 Scale
export const input = {
  base:    'w-full px-4 py-3 md:px-5 md:py-4 text-sm md:text-base rounded-2xl outline-none transition-all',
  light:   'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600',
  dark:    'bg-white/5 border border-white/10 focus:bg-white/10 focus:border-blue-400 text-white placeholder:text-slate-500',
} as const;

// 按鈕 Scale
export const btn = {
  primary: 'px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-black rounded-2xl transition-all active:scale-[0.98]',
  lg:      'px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-black rounded-2xl transition-all active:scale-[0.98]',
} as const;
