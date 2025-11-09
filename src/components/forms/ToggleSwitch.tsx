import { cn } from '../../lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = 'md',
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0.5',
    md: checked ? 'translate-x-5' : 'translate-x-0.5',
    lg: checked ? 'translate-x-7' : 'translate-x-0.5',
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2',
          sizeClasses[size],
          checked ? 'bg-brand-teal' : 'bg-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white transition-transform',
            thumbSizeClasses[size],
            translateClasses[size]
          )}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label className="text-sm font-medium text-slate-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
