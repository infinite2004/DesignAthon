import { useState, useMemo } from 'react';
import { Plus, Camera, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { Screen } from '../../../components/layout/Screen';
import { InventoryList } from '../../../components/inventory/InventoryList';
import { EmptyState } from '../../../components/ui/EmptyState';
import { MediaPicker, type SelectedMedia } from '../../../components/media/MediaPicker';
import { Modal } from '../../../components/ui/Modal';

export function InventoryScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const updateInventoryItem = useAppStore((state) => state.updateInventoryItem);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fridge' | 'freezer' | 'pantry'>('all');
  const [showFridgePhotoModal, setShowFridgePhotoModal] = useState(false);
  const [fridgePhoto, setFridgePhoto] = useState<SelectedMedia | null>(null);
  const inventory = useAppStore((state) => state.inventory);
  
  // Filter inventory by category
  const filteredInventory = useMemo(() => {
    if (selectedCategory === 'all') {
      return inventory;
    }
    return inventory.filter((item) => item.category === selectedCategory || item.location === selectedCategory);
  }, [inventory, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'fridge', label: 'Fridge' },
    { id: 'freezer', label: 'Freezer' },
    { id: 'pantry', label: 'Pantry' },
  ];

  const expiringSoon = useMemo(() => {
    return inventory.filter((item) => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.floor(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
    });
  }, [inventory]);

  return (
    <Screen>

      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-orange-900">
              {expiringSoon.length} item{expiringSoon.length > 1 ? 's' : ''} expiring soon
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Use these items in your next meal to reduce waste
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap touch-target ${
                selectedCategory === cat.id
                  ? 'bg-brand-teal text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/kitchen/inventory/add')}
            className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium touch-target"
          >
            <Plus size={18} />
            Add Item
          </button>
          <button
            onClick={() => navigate('/kitchen/inventory/receipt/camera')}
            className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium touch-target"
          >
            <Camera size={18} />
            Scan Receipt
          </button>
        </div>
        {/* Fridge Photo Option */}
        {(selectedCategory === 'all' || selectedCategory === 'fridge') && (
          <button
            onClick={() => setShowFridgePhotoModal(true)}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-brand-sage rounded-lg text-sm font-medium text-brand-teal bg-brand-bg touch-target"
          >
            <ImageIcon size={18} />
            Take Fridge Photo
          </button>
        )}
      </div>

      {/* Inventory List */}
      <div className="px-4 py-4">
        {filteredInventory.length === 0 ? (
          <EmptyState
            title="No items here yet"
            description={
              selectedCategory === 'all'
                ? 'Start tracking your pantry, fridge, and freezer items to get personalized recipe suggestions!'
                : `No items in ${selectedCategory}. Add some items to get started!`
            }
            actionLabel="Add Your First Item"
            onAction={() => navigate('/kitchen/inventory/add')}
            icon="📦"
          />
        ) : (
          <InventoryList items={filteredInventory} />
        )}
      </div>
      
      {/* Fridge Photo Modal */}
      <Modal
        isOpen={showFridgePhotoModal}
        onClose={() => {
          setShowFridgePhotoModal(false);
          setFridgePhoto(null);
        }}
        title="Take Fridge Photo"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Capture a photo of your fridge to help track your inventory visually.
          </p>
          
          <MediaPicker
            label="Fridge Photo"
            media={fridgePhoto}
            onChange={setFridgePhoto}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowFridgePhotoModal(false);
                setFridgePhoto(null);
              }}
              className="flex-1 px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-sm font-medium touch-target"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (fridgePhoto) {
                  // Save fridge photo to all fridge items or create a special inventory entry
                  const fridgeItems = inventory.filter(
                    (item) => item.category === 'fridge' || item.location === 'fridge'
                  );
                  
                  if (fridgeItems.length > 0) {
                    // Update all fridge items with the photo
                    fridgeItems.forEach((item) => {
                      updateInventoryItem(item.id, { imageUrl: fridgePhoto.url });
                    });
                    showToast('Fridge photo saved! 📸', 'success');
                  } else {
                    // Create a special inventory entry for the fridge photo
                    const addInventoryItem = useAppStore.getState().addInventoryItem;
                    addInventoryItem({
                      id: crypto.randomUUID(),
                      name: 'Fridge Photo',
                      category: 'fridge',
                      quantity: 1,
                      unit: 'photo',
                      location: 'fridge',
                      imageUrl: fridgePhoto.url,
                    });
                    showToast('Fridge photo saved! 📸', 'success');
                  }
                  
                  setShowFridgePhotoModal(false);
                  setFridgePhoto(null);
                } else {
                  showToast('Please take a photo first', 'error');
                }
              }}
              className="flex-1 px-4 py-2 rounded-2xl bg-brand-teal text-white text-sm font-medium touch-target"
            >
              Save Photo
            </button>
          </div>
        </div>
      </Modal>

      {/* FAB */}
      <button
        onClick={() => navigate('/kitchen/inventory/add')}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-brand-teal text-white shadow-lg flex items-center justify-center touch-target z-40 safe-area-bottom"
        aria-label="Add item"
      >
        <Plus size={24} />
      </button>
    </Screen>
  );
}

