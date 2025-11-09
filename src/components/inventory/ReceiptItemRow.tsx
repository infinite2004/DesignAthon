import { Check, X, Edit2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { ReceiptItem } from './ReceiptItemList';

interface ReceiptItemRowProps {
  item: ReceiptItem;
  onRemove?: () => void;
  onEdit?: () => void;
}

export function ReceiptItemRow({
  item,
  onRemove,
  onEdit,
}: ReceiptItemRowProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border-2 transition-colors touch-target ${
        item.isMapped
          ? 'border-brand-teal bg-brand-teal/5'
          : 'border-slate-200 hover:border-brand-sage'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-slate-900">{item.name}</p>
          {item.isMapped && (
            <Check size={16} className="text-brand-teal flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
          {item.quantity && <span>Qty: {item.quantity}</span>}
          {item.price && (
            <span className="font-semibold text-brand-teal">
              {formatCurrency(item.price)}
            </span>
          )}
          {item.category && (
            <span className="px-2 py-0.5 bg-slate-100 rounded-full">
              {item.category}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-slate-400 hover:text-brand-teal touch-target"
            title="Edit item"
          >
            <Edit2 size={16} />
          </button>
        )}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-slate-400 hover:text-red-500 touch-target"
            title="Remove item"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
