import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useToast } from '../../components/ui/ToastContext';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';
import { SegmentedControl } from '../../components/forms/SegmentedControl';

type DetectedItem = {
  name: string;
  confidence: number;
};

export function FridgeVisionReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const addInventoryItem = useAppStore((state) => state.addInventoryItem);
  
  const imageUri = location.state?.imageUri as string | undefined;
  
  const [detectedItems, setDetectedItems] = useState<Array<DetectedItem & { selected: boolean; category: 'fridge' | 'freezer' | 'pantry'; name: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      // Mock detected items
      const mockDetected: DetectedItem[] = [
        { name: 'Milk', confidence: 0.95 },
        { name: 'Eggs', confidence: 0.88 },
        { name: 'Cheese', confidence: 0.82 },
        { name: 'Yogurt', confidence: 0.75 },
      ];

      setDetectedItems(
        mockDetected.map(item => ({
          ...item,
          selected: true,
          category: 'fridge' as const,
          name: item.name,
        }))
      );
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const handleToggle = (index: number) => {
    setDetectedItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleNameChange = (index: number, newName: string) => {
    setDetectedItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, name: newName } : item
      )
    );
  };

  const handleCategoryChange = (index: number, category: 'fridge' | 'freezer' | 'pantry') => {
    setDetectedItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, category } : item
      )
    );
  };

  const handleAddItems = () => {
    const selected = detectedItems.filter(item => item.selected);
    
    selected.forEach(item => {
      addInventoryItem({
        id: crypto.randomUUID(),
        name: item.name,
        category: item.category,
        quantity: 1,
        unit: 'piece',
        location: item.category,
      });
    });

    showToast(`Added ${selected.length} items to pantry! 📦`, 'success');
    navigate('/chef');
  };

  if (isAnalyzing) {
    return (
      <Screen>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Analyzing your fridge...</p>
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
          <h1 className="text-sm font-semibold text-teal">Review Items</h1>
          <div className="w-8" />
        </div>
      </header>

      {imageUri && (
        <div className="w-full aspect-video bg-gray-100">
          <img
            src={imageUri}
            alt="Fridge photo"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-4 py-4 space-y-3">
        {detectedItems.map((item, index) => (
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
                <TextField
                  value={item.name}
                  onChange={(v) => handleNameChange(index, v)}
                  placeholder="Item name"
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round(item.confidence * 100)}%
              </span>
            </div>

            <SegmentedControl
              value={item.category}
              onChange={(v) => handleCategoryChange(index, v as 'fridge' | 'freezer' | 'pantry')}
              options={[
                { label: 'Fridge', value: 'fridge' },
                { label: 'Freezer', value: 'freezer' },
                { label: 'Pantry', value: 'pantry' },
              ]}
            />
          </div>
        ))}
      </div>

      <div className="px-4 pb-6">
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddItems}
          disabled={detectedItems.filter(i => i.selected).length === 0}
          className="rounded-2xl"
        >
          Add {detectedItems.filter(i => i.selected).length} items to pantry
        </Button>
      </div>
    </Screen>
  );
}

