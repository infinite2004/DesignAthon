import { Award } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import type { Badge } from '../../types';

interface BadgeCardProps {
  badge: Badge;
  compact?: boolean;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
          {badge.icon ? (
            <span className="text-2xl">{badge.icon}</span>
          ) : (
            <Award size={24} className="text-brand-teal" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 mb-1">
            {badge.name}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {badge.description}
          </p>
          {badge.earnedAt && (
            <p className="text-[10px] text-slate-500">
              Earned {formatTimeAgo(badge.earnedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
