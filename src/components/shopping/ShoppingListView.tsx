import { ShoppingListItemRow } from './ShoppingListItemRow';
import { EmptyState } from '../ui/EmptyState';
import type { GroceryItem } from '../../types';

interface ShoppingListViewProps {
  items: GroceryItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ShoppingListView({
  items,
  onToggle,
  onDelete,
  emptyTitle,
  emptyDescription,
}: ShoppingListViewProps) {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  // Sort categories
  const categoryOrder = ['Produce', 'Meat', 'Dairy', 'Canned', 'Pantry', 'Frozen', 'Other'];
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "Your grocery list is empty"}
        description={emptyDescription || "Add items to get started"}
      />
    );
  }

  return (
    <div className="space-y-4">
      {sortedCategories.map((category) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2 px-1">
            {category}
          </h3>
          <div className="space-y-2">
            {groupedItems[category].map((item: GroceryItem) => (
              <ShoppingListItemRow
                key={item.id}
                item={item}
                onToggle={() => onToggle(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
