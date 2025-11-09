import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { NumberStepper } from '../../components/forms/NumberStepper';
import { SelectField } from '../../components/forms/SelectField';
import { DatePicker } from '../../components/forms/DatePicker';
import { IngredientAutocompleteField } from '../../components/chef/IngredientAutocompleteField';

const units = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'piece', 'bunch'];

export function AddItemManualScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const addInventoryItem = useAppStore((state) => state.addInventoryItem);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fridge' | 'freezer' | 'pantry'>('fridge');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('piece');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }

    addInventoryItem({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      quantity,
      unit,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      purchasePrice: purchasePrice || undefined,
      location: category,
    });

    showToast(`${name} added to pantry! 📦`, 'success');
    navigate(-1);
  };

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 touch-target"
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-teal">Add Item</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        <IngredientAutocompleteField
          label="Item name"
          value={name}
          onChange={setName}
          placeholder="e.g., Chicken breast, Tomatoes..."
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <SegmentedControl
            value={category}
            onChange={(v) => setCategory(v as 'fridge' | 'freezer' | 'pantry')}
            options={[
              { label: 'Fridge', value: 'fridge' },
              { label: 'Freezer', value: 'freezer' },
              { label: 'Pantry', value: 'pantry' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberStepper
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            min={0.1}
            max={1000}
            step={0.1}
          />

          <SelectField
            label="Unit"
            value={unit}
            onChange={setUnit}
            options={units.map(u => ({ label: u, value: u }))}
          />
        </div>

        <DatePicker
          label="Expiry date (optional)"
          value={expiryDate}
          onChange={setExpiryDate}
        />

        <NumberStepper
          label="Purchase price (optional)"
          value={purchasePrice || 0}
          onChange={(v) => setPurchasePrice(v > 0 ? v : null)}
          min={0}
          max={1000}
          step={0.01}
        />

        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-2xl"
          >
            Add to Pantry
          </Button>
        </div>
      </div>
    </Screen>
  );
}

