import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { BottomSheet } from '../ui/BottomSheet';

interface DemoImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDemo: (imageUrl: string) => void;
}

// Demo images for testing
const demoImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop',
    label: 'Pasta Dish',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop',
    label: 'Pizza',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
    label: 'Grilled Food',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=600&fit=crop',
    label: 'Salad Bowl',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop',
    label: 'Breakfast',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop',
    label: 'Burger',
  },
];

export function DemoImagePicker({ isOpen, onClose, onSelectDemo }: DemoImagePickerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = () => {
    if (selectedId) {
      const selected = demoImages.find(img => img.id === selectedId);
      if (selected) {
        onSelectDemo(selected.url);
        onClose();
      }
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Demo Image"
    >
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Select a demo image to test the post creation flow
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {demoImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                selectedId === image.id
                  ? 'border-brand-teal scale-105'
                  : 'border-gray-200'
              }`}
            >
              <img
                src={image.url}
                alt={image.label}
                className="w-full h-full object-cover"
              />
              {selectedId === image.id && (
                <div className="absolute inset-0 bg-brand-teal/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center">
                    <ImageIcon size={20} className="text-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white font-medium">{image.label}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSelect}
          disabled={!selectedId}
          className="rounded-xl"
        >
          Use This Image
        </Button>
      </div>
    </BottomSheet>
  );
}

