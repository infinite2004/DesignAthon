import React from 'react';
import type { InventoryItem } from '../../types';
import { InventoryItemRow } from './InventoryItemRow';
import { EmptyState } from '../ui/EmptyState';

type InventoryListProps = {
  items: InventoryItem[];
  onItemPress?: (item: InventoryItem) => void;
};

export const InventoryList: React.FC<InventoryListProps> = ({ items, onItemPress }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No items here yet"
        description="Add what you have in your fridge, freezer, or pantry."
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <InventoryItemRow
          key={item.id}
          item={item}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
        />
      ))}
    </div>
  );
};

