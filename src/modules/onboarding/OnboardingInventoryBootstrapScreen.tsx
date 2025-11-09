import { useNavigate } from 'react-router-dom';
import { Camera, Plus } from 'lucide-react';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/ToastContext';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingInventoryBootstrapScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleScanReceipt = () => {
    showToast('Receipt scanning coming soon! 📸', 'info');
    // Navigate to receipt camera
    navigate('/kitchen/inventory/receipt/camera');
  };

  const handleAddManually = () => {
    // Navigate to add inventory item
    navigate('/kitchen/inventory/add');
  };

  const handleSkip = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding_complete', 'true');
    showToast('Welcome to Cookd! 🎉', 'success');
    navigate('/feed', { replace: true });
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">Set Up Your Inventory</h1>
          <p className="text-slate-600">Get started by adding items to your digital pantry</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleScanReceipt}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-sage active:bg-gray-50 transition-colors touch-target"
          >
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
              <Camera size={24} className="text-brand-teal" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Scan Your Last Receipt</p>
              <p className="text-xs text-slate-600">Quickly add items from your grocery receipt</p>
            </div>
          </button>

          <button
            onClick={handleAddManually}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-sage active:bg-gray-50 transition-colors touch-target"
          >
            <div className="w-12 h-12 rounded-full bg-brand-sage/10 flex items-center justify-center">
              <Plus size={24} className="text-brand-sage" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Add Items Manually</p>
              <p className="text-xs text-slate-600">Add a few staples by hand</p>
            </div>
          </button>
        </div>

        <div className="pt-4">
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSkip}
            className="rounded-2xl"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </Screen>
  );
}

