import { BadgeCard } from './BadgeCard';
import { EmptyState } from '../ui/EmptyState';
import type { Badge } from '../../types';

interface BadgeListProps {
  badges: Badge[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BadgeList({
  badges,
  emptyTitle,
  emptyDescription,
}: BadgeListProps) {
  if (badges.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No badges yet"}
        description={emptyDescription || "Earn badges by cooking, saving waste, and sharing meals!"}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
