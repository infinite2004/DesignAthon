import { ReceiptItemRow } from './ReceiptItemRow';

export interface ReceiptItem {
  id: string;
  name: string;
  price?: number;
  quantity?: number;
  category?: string;
  isMapped?: boolean;
  mappedIngredientId?: string;
}

interface ReceiptItemListProps {
  items: ReceiptItem[];
  onItemSelect?: (item: ReceiptItem) => void;
  onItemRemove?: (itemId: string) => void;
}

export function ReceiptItemList({
  items,
  onItemSelect,
  onItemRemove,
}: ReceiptItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500">No items found in receipt</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemSelect?.(item)}
          className="cursor-pointer"
        >
          <ReceiptItemRow
            item={item}
            onRemove={() => onItemRemove?.(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
