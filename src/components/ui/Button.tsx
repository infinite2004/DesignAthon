import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  children,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 touch-target disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-md";
  
  const variantStyles = {
    primary: "bg-brand-teal text-white hover:bg-brand-teal/90 active:bg-brand-teal/80 hover:shadow-brand-teal/20",
    secondary: "bg-brand-sage text-white hover:bg-brand-sage/90 active:bg-brand-sage/80 hover:shadow-brand-sage/20",
    ghost: "bg-transparent text-brand-brown hover:bg-brand-bg active:bg-brand-sage/10",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 hover:shadow-red-600/20",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[52px]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="animate-spin mr-2" />
          Loading...
        </>
      ) : (
        <>
          {iconLeft && <span className="mr-2">{iconLeft}</span>}
          {children}
          {iconRight && <span className="ml-2">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

