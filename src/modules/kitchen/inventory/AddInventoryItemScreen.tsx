import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/ui/Button';
import { MediaPicker, type SelectedMedia } from '../../../components/media/MediaPicker';
import { ArrowLeft } from 'lucide-react';
import type { InventoryItem } from '../../../types';

const LOCATIONS = ['fridge', 'freezer', 'pantry'] as const;

export const AddInventoryItemScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const addInventoryItem = useAppStore((state) => state.addInventoryItem);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('pcs');
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]>('fridge');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [itemPhoto, setItemPhoto] = useState<SelectedMedia | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }

    const item: InventoryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      quantity,
      unit,
      category: location,
      location,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      imageUrl: itemPhoto?.url,
    };

    addInventoryItem(item);
    showToast('Item added to inventory! 📦', 'success');
    navigate(-1);
  }

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Add item</h1>
          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 px-4 pb-6 pt-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Name</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-700">Quantity</label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="w-24">
              <label className="mb-1 block text-xs font-medium text-slate-700">Unit</label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Location</label>
            <div className="flex gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-xs capitalize touch-target ${
                    location === loc
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Expiry date</label>
            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          
          {/* Item Photo */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Item Photo (Optional)</label>
            <MediaPicker
              media={itemPhoto}
              onChange={setItemPhoto}
              label=""
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-4 rounded-2xl"
          >
            Save item
          </Button>
        </form>
      </main>
    </Screen>
  );
};

