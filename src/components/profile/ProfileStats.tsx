import type { User } from '../../types';

interface ProfileStatsProps {
  user: User;
  postsCount: number;
  wasteSaved: number;
  sustainability?: {
    daysCooked: number;
    daysGoal: number;
    moneySaved: number;
  };
}

export function ProfileStats({
  user,
  postsCount,
  wasteSaved,
  sustainability,
}: ProfileStatsProps) {
  const wasteSavedKg = (wasteSaved / 1000).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Basic Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-lg font-bold text-brand-teal">{postsCount}</p>
          <p className="text-xs text-slate-600">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-brand-teal">{user.followers || 0}</p>
          <p className="text-xs text-slate-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-brand-teal">{user.following || 0}</p>
          <p className="text-xs text-slate-600">Following</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-brand-teal">{wasteSavedKg}kg</p>
          <p className="text-xs text-slate-600">Waste Saved</p>
        </div>
      </div>

      {/* Sustainability Tracking */}
      {sustainability && (
        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <h3 className="font-semibold text-sm mb-3 text-brand-teal">
            Sustainability Tracking
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-600">Days Cooked</p>
              <p className="font-bold text-brand-teal text-lg">
                {sustainability.daysCooked}/{sustainability.daysGoal}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Money Saved</p>
              <p className="font-bold text-brand-teal text-lg">
                ${sustainability.moneySaved.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
