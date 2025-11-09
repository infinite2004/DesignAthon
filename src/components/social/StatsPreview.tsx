import { formatCurrency } from '../../lib/utils';
import type { Recipe } from '../../types';

interface StatsPreviewProps {
  recipe: Recipe | null;
  showStats: boolean;
}

export function StatsPreview({ recipe, showStats }: StatsPreviewProps) {
  if (!showStats || !recipe) return null;

  return (
    <div className="p-4 bg-brand-bg rounded-xl border border-brand-sage/20">
      <h3 className="font-semibold text-sm mb-3 text-brand-teal">Auto-filled Stats</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Cost per serving:</span>
          <span className="font-semibold text-brand-teal">
            {formatCurrency(recipe.costEstimate || 2.50)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Waste saved:</span>
          <span className="font-semibold text-brand-teal">350g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Expiring items used:</span>
          <span className="font-semibold text-brand-teal">3</span>
        </div>
      </div>
    </div>
  );
}
