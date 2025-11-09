import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';
import { useToast } from '../../components/ui/ToastContext';
import { ToggleSwitch } from '../../components/forms/ToggleSwitch';

const commonItems = [
  { id: 'rice', label: 'Rice' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'canned-beans', label: 'Canned beans' },
  { id: 'onions', label: 'Onions' },
  { id: 'garlic', label: 'Garlic' },
  { id: 'olive-oil', label: 'Olive oil' },
  { id: 'salt', label: 'Salt & pepper' },
];

export function OnboardingInventoryBootstrapScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setSelectedItems((prev: Record<string, boolean>) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFinish = () => {
    const items = Object.entries(selectedItems)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    localStorage.setItem('user_initial_pantry', JSON.stringify(items));
    localStorage.setItem('onboarding_complete', 'true');
    
    showToast('Welcome to Cook\'d! 🎉', 'success');
    navigate('/home', { replace: true });
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal mb-2">Starting Pantry</h1>
          <p className="text-slate-600">What do you usually have on hand?</p>
        </div>

        <div className="space-y-3">
          {commonItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
            >
              <span className="font-medium text-slate-900">{item.label}</span>
              <ToggleSwitch
                checked={selectedItems[item.id] || false}
                onChange={() => handleToggle(item.id)}
              />
            </div>
          ))}
        </div>

        <div className="p-4 bg-beige rounded-2xl border border-sage/20">
          <p className="text-xs text-slate-600">
            💡 You can always add more items later from your Chef tab
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleFinish}
            className="rounded-2xl"
          >
            Get Started
          </Button>
        </div>
      </div>
    </Screen>
  );
}

