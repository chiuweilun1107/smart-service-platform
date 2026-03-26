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
