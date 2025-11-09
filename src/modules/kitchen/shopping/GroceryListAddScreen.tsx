import React from 'react';
import { Screen } from '../../../components/layout/Screen';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GroceryListAddScreen: React.FC = () => {
  const navigate = useNavigate();

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
          <h1 className="text-sm font-semibold text-slate-900">Add to Grocery List</h1>
          <div className="w-8" />
        </div>
      </header>
      <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-6">
        <p className="text-xs text-slate-500">
          TODO: Implement manual grocery item addition form
        </p>
      </div>
    </Screen>
  );
};

