import { cn } from '../../lib/utils';

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  multiline?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  onFocus?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  autoComplete?: string;
};

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  multiline = false,
  error,
  disabled = false,
  className,
  rows = 3,
  onFocus,
  onKeyPress,
  autoComplete,
}: TextFieldProps) {
  const inputStyles = cn(
    "w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-colors",
    error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <InputComponent
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        rows={multiline ? rows : undefined}
        className={inputStyles}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

