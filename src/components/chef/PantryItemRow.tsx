import { Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import type { PantryItem } from '../../types/chef';

type PantryItemRowProps = {
  item: PantryItem;
};

export function PantryItemRow({ item }: PantryItemRowProps) {
  const { showToast } = useToast();
  const deleteInventoryItem = useAppStore((state) => state.deleteInventoryItem);

  const daysUntilExpiry = item.expiryDate
    ? Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleDelete = () => {
    if (window.confirm(`Remove ${item.name} from pantry?`)) {
      deleteInventoryItem(item.id);
      showToast(`${item.name} removed`, 'success');
    }
  };

  return (
    <div className="p-4 flex items-center gap-3">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-600">
            {item.quantity} {item.unit}
          </p>
          {daysUntilExpiry !== null && (
            <>
              <span className="text-xs text-gray-400">·</span>
              <p
                className={`text-xs font-medium ${
                  daysUntilExpiry < 0
                    ? 'text-red-600'
                    : daysUntilExpiry <= 3
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}
              >
                {daysUntilExpiry < 0
                  ? 'Expired'
                  : daysUntilExpiry === 0
                  ? 'Expires today'
                  : `${daysUntilExpiry} days left`}
              </p>
            </>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="p-2 text-red-400 hover:text-red-600 touch-target"
        aria-label="Delete item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

