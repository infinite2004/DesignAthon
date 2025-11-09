import { formatCurrency } from '../../lib/utils';

type CostPillProps = {
  cost: number;
  size?: 'sm' | 'md';
};

export function CostPill({ cost, size = 'md' }: CostPillProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-mustard/20 text-brown font-semibold ${sizeClasses[size]}`}
    >
      {formatCurrency(cost)} / serving
    </span>
  );
}

