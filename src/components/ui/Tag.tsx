import { cn } from '../../lib/utils';

type TagProps = {
  label: string;
  variant?: 'default' | 'highlight';
  size?: 'sm' | 'md';
};

export function Tag({ label, variant = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        variant === 'default'
          ? "bg-brand-sage/20 text-brand-teal"
          : "bg-brand-yellow/30 text-brand-brown"
      )}
    >
      {label}
    </span>
  );
}

