import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { SelectField } from '../../components/forms/SelectField';
import { NumberStepper } from '../../components/forms/NumberStepper';

type ReceiptLineItem = {
  rawText: string;
  mappedName: string;
  category: string;
  quantity: number;
  unit: string;
  price?: number;
  selected: boolean;
};

export function ReceiptReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const addInventoryItem = useAppStore((state) => state.addInventoryItem);
  
  const imageUri = location.state?.imageUri as string | undefined;
  
  const [lineItems, setLineItems] = useState<ReceiptLineItem[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate OCR scanning
    setTimeout(() => {
      // Mock OCR results
      const mockItems: ReceiptLineItem[] = [
        {
          rawText: 'HEB CHICKEN THIGH 1.2lb',
          mappedName: 'Chicken thigh',
          category: 'Meat',
          quantity: 1.2,
          unit: 'lb',
          price: 8.99,
          selected: true,
        },
        {
          rawText: 'TOMATOES 2lb',
          mappedName: 'Tomatoes',
          category: 'Produce',
          quantity: 2,
          unit: 'lb',
          price: 3.49,
          selected: true,
        },
        {
          rawText: 'MILK GALLON',
          mappedName: 'Milk',
          category: 'Dairy',
          quantity: 1,
          unit: 'gallon',
          price: 4.99,
          selected: true,
        },
      ];

      setLineItems(mockItems);
      setIsScanning(false);
    }, 2000);
  }, []);

  const handleToggle = (index: number) => {
    setLineItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAddItems = () => {
    const selected = lineItems.filter(item => item.selected);
    
    selected.forEach(item => {
      // Map category to pantry category
      let pantryCategory: 'fridge' | 'freezer' | 'pantry' = 'pantry';
      if (['Dairy', 'Meat', 'Produce'].includes(item.category)) {
        pantryCategory = 'fridge';
      }

      addInventoryItem({
        id: crypto.randomUUID(),
        name: item.mappedName,
        category: pantryCategory,
        quantity: item.quantity,
        unit: item.unit,
        purchasePrice: item.price,
        purchaseDate: new Date(),
        location: pantryCategory,
      });
    });

    showToast(`Added ${selected.length} items to pantry! 📦`, 'success');
    navigate('/chef');
  };

  if (isScanning) {
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Scanning receipt...</p>
        </div>
      </Screen>
    );
  }

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
          <h1 className="text-sm font-semibold text-teal">Review Receipt</h1>
          <div className="w-8" />
        </div>
      </header>

      {imageUri && (
        <div className="w-full aspect-video bg-gray-100">
          <img
            src={imageUri}
            alt="Receipt"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="px-4 py-4 space-y-3">
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(index)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center touch-target ${
                  item.selected
                    ? 'bg-teal border-teal'
                    : 'border-gray-300'
                }`}
              >
                {item.selected && <Check size={16} className="text-white" />}
              </button>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{item.rawText}</p>
                <TextField
                  value={item.mappedName}
                  onChange={(v) => {
                    setLineItems(prev =>
                      prev.map((it, i) =>
                        i === index ? { ...it, mappedName: v } : it
                      )
                    );
                  }}
                  placeholder="Item name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SelectField
                label="Category"
                value={item.category}
                onChange={(v) => {
                  setLineItems(prev =>
                    prev.map((it, i) =>
                      i === index ? { ...it, category: v } : it
                    )
                  );
                }}
                options={[
                  { label: 'Produce', value: 'Produce' },
                  { label: 'Meat', value: 'Meat' },
                  { label: 'Dairy', value: 'Dairy' },
                  { label: 'Pantry', value: 'Pantry' },
                  { label: 'Frozen', value: 'Frozen' },
                ]}
              />
              <NumberStepper
                label="Qty"
                value={item.quantity}
                onChange={(v) => {
                  setLineItems(prev =>
                    prev.map((it, i) =>
                      i === index ? { ...it, quantity: v } : it
                    )
                  );
                }}
                min={0.1}
                step={0.1}
              />
              <TextField
                label="Unit"
                value={item.unit}
                onChange={(v) => {
                  setLineItems(prev =>
                    prev.map((it, i) =>
                      i === index ? { ...it, unit: v } : it
                    )
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-6">
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddItems}
          disabled={lineItems.filter(i => i.selected).length === 0}
          className="rounded-2xl"
        >
          Add {lineItems.filter(i => i.selected).length} items to pantry
        </Button>
      </div>
    </Screen>
  );
}

