import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PantryOverviewScreen } from '../chef/PantryOverviewScreen';
import { Screen } from '../../components/layout/Screen';

export function PantryShortcutScreen() {
  const navigate = useNavigate();

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
          <h1 className="text-sm font-semibold text-teal">Pantry</h1>
          <div className="w-8" />
        </div>
      </header>
      <PantryOverviewScreen />
    </Screen>
  );
}

