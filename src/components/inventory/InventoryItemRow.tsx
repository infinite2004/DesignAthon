import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../ui/ToastContext';
import type { InventoryItem } from '../../types';

type InventoryItemRowProps = {
  item: InventoryItem;
  onPress?: () => void;
};

function daysUntil(dateStr: Date | null | undefined): number | null {
  if (!dateStr) return null;
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const InventoryItemRow: React.FC<InventoryItemRowProps> = ({ item, onPress }) => {
  const { showToast } = useToast();
  const deleteInventoryItem = useAppStore((state) => state.deleteInventoryItem);
  
  const days = daysUntil(item.expiryDate);
  const expiryLabel =
    days == null ? 'No expiry' : days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`;
  const expiryColor =
    days == null
      ? 'bg-slate-200'
      : days < 0
      ? 'bg-red-500'
      : days <= 2
      ? 'bg-orange-400'
      : 'bg-emerald-500';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${item.name} from inventory?`)) {
      deleteInventoryItem(item.id);
      showToast(`${item.name} removed from inventory`, 'success');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPress}
        className="flex-1 flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm active:bg-gray-50 touch-target"
      >
        {/* Item Photo */}
        {item.imageUrl && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-medium text-slate-900 truncate w-full">{item.name}</span>
            <span className="text-xs text-slate-500">
              {item.quantity} {item.unit} · {item.location}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-slate-500">{expiryLabel}</span>
            <span className={`h-2 w-2 rounded-full ${expiryColor}`} />
          </div>
        </div>
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg touch-target"
        title="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

