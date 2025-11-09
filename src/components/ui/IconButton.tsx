import { cn } from '../../lib/utils';

export type IconButtonProps = {
  icon: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'primary';
  disabled?: boolean;
  className?: string;
  'aria-label': string;
};

export function IconButton({
  icon,
  onClick,
  size = 'md',
  variant = 'default',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  const sizeStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantStyles = {
    default: 'text-slate-600 hover:bg-slate-100',
    ghost: 'text-slate-600 hover:bg-brand-bg',
    primary: 'text-brand-teal hover:bg-brand-sage/10',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'rounded-full transition-colors touch-target disabled:opacity-50',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon}
    </button>
  );
}

