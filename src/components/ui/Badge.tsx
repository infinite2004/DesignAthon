import { cn } from '../../lib/utils';

export type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-brand-yellow text-brand-brown',
    success: 'bg-brand-sage text-white',
    warning: 'bg-brand-yellow text-brand-brown',
    danger: 'bg-red-100 text-red-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {children}
    </span>
  );
}

