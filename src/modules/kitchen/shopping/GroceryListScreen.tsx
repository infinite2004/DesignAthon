import { Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { formatCurrency } from '../../../lib/utils';
import { Screen } from '../../../components/layout/Screen';
import { EmptyState } from '../../../components/ui/EmptyState';

export function GroceryListScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const groceryList = useAppStore((state) => state.groceryList);
  const toggleGroceryItem = useAppStore((state) => state.toggleGroceryItem);
  const deleteGroceryItem = useAppStore((state) => state.deleteGroceryItem);

  const items = groceryList;

  // Group items by category and sort categories
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Sort categories in a logical order
  const categoryOrder = ['Produce', 'Meat', 'Dairy', 'Canned', 'Pantry', 'Frozen', 'Other'];
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const checkedCount = items.filter((item) => item.isChecked).length;

  return (
    <Screen>

      {/* Stats */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-lg font-bold">
              {checkedCount} / {items.length} items
            </p>
          </div>
          {totalEstimated > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated total</p>
              <p className="text-lg font-bold">{formatCurrency(totalEstimated)}</p>
            </div>
          )}
        </div>
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-teal transition-all"
            style={{ width: items.length > 0 ? `${(checkedCount / items.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Grocery List */}
      <div className="px-4 py-4 space-y-4">
        {items.length === 0 ? (
          <EmptyState
            title="Your grocery list is empty"
            description="Items are automatically added when you plan meals or save recipes. You can also add items manually!"
            actionLabel="Add Items Manually"
            onAction={() => navigate('/kitchen/grocery-list/add')}
            icon="🛒"
          />
        ) : (
          sortedCategories.map((category) => {
            const categoryItems = groupedItems[category];
            return (
            <div key={category}>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">{category}</h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3"
                  >
                    <button
                      onClick={() => toggleGroceryItem(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center touch-target ${
                        item.isChecked
                          ? 'bg-brand-teal border-brand-teal'
                          : 'border-gray-300'
                      }`}
                    >
                      {item.isChecked && <Check size={16} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          item.isChecked ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    {item.estimatedPrice && (
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.estimatedPrice)}
                      </p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Remove ${item.name} from grocery list?`)) {
                          deleteGroceryItem(item.id);
                          showToast(`${item.name} removed`, 'success');
                        }
                      }}
                      className="p-2 text-red-400 hover:text-red-600 touch-target"
                      title="Delete item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-6">
        <div className="bg-brand-yellow/20 p-4 rounded-xl border border-brand-yellow/40">
          <p className="text-xs text-brand-brown">
            💡 Items are automatically added when you plan meals or save recipes from the feed.
            The list respects what you already have in your inventory.
          </p>
        </div>
      </div>
    </Screen>
  );
}

