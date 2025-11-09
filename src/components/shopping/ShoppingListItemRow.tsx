import { Check, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { GroceryItem } from '../../types';

interface ShoppingListItemRowProps {
  item: GroceryItem;
  onToggle: () => void;
  onDelete: () => void;
}

export function ShoppingListItemRow({
  item,
  onToggle,
  onDelete,
}: ShoppingListItemRowProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border-2 transition-colors ${
        item.isChecked
          ? 'border-brand-teal bg-brand-teal/5'
          : 'border-slate-200 hover:border-brand-sage'
      }`}
    >
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors touch-target ${
          item.isChecked
            ? 'border-brand-teal bg-brand-teal'
            : 'border-slate-300 hover:border-brand-teal'
        }`}
      >
        {item.isChecked && <Check size={14} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm ${
            item.isChecked
              ? 'text-slate-500 line-through'
              : 'text-slate-900'
          }`}
        >
          {item.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
          <span>
            {item.quantity} {item.unit}
          </span>
          {item.estimatedPrice && (
            <>
              <span>•</span>
              <span className="font-semibold text-brand-teal">
                {formatCurrency(item.estimatedPrice)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-2 text-slate-400 hover:text-red-500 touch-target"
        title="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
