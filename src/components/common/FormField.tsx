import React from 'react';

// ─── Base input class (aligned with typography.ts input.light) ────────────────
const inputBase =
  'w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white ' +
  'font-medium text-slate-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 ' +
  'transition-all';

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  hint,
}) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && (
      <p className="text-[11px] font-medium text-slate-400 ml-1">{hint}</p>
    )}
  </div>
);

// ─── TextInput ────────────────────────────────────────────────────────────────

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'light';
}

export const TextInput: React.FC<TextInputProps> = ({
  variant = 'default',
  className = '',
  ...rest
}) => {
  const variantClass =
    variant === 'light' ? 'bg-slate-50 focus:bg-white' : 'bg-white';
  return (
    <input
      className={`${inputBase} ${variantClass} ${className}`}
      {...rest}
    />
  );
};

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  rows = 4,
  className = '',
  ...rest
}) => (
  <textarea
    rows={rows}
    className={`${inputBase} resize-none ${className}`}
    {...rest}
  />
);

// ─── SelectInput ──────────────────────────────────────────────────────────────

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  placeholder,
  className = '',
  ...rest
}) => (
  <select
    className={`${inputBase} appearance-none ${className}`}
    {...rest}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// ─── SearchInput ──────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSearch?: () => void;
  buttonLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = '搜尋...',
  onSearch,
  buttonLabel = '搜尋',
  loading = false,
  disabled,
}) => (
  <div className="relative flex items-center">
    {!onSearch && (
      <div className="absolute left-4 flex-shrink-0 text-slate-400 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full ${onSearch ? 'pr-24 pl-5' : 'pl-10 pr-5'} py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 text-slate-900 font-bold text-sm md:text-base placeholder:text-slate-400 disabled:opacity-50`}
    />
    {onSearch && (
      <button
        onClick={onSearch}
        disabled={!value || loading || disabled}
        className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-40 flex-shrink-0"
      >
        {loading ? '查詢中' : buttonLabel}
      </button>
    )}
  </div>
);
