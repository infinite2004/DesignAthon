import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Search } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/forms/TextField';

export function WhatDoYouWantToEatScreen() {
  const navigate = useNavigate();
  const pantry = useAppStore((state) => state.inventory);
  const [manualInput, setManualInput] = useState('');

  const handleSurpriseMe = () => {
    // Navigate to AI recipes with "surprise me" flag and unique key to force regeneration
    navigate('/chef/ai-recipes', {
      state: { 
        surpriseMe: true,
        surpriseKey: Date.now(), // Unique key ensures new recipes each time
      },
    });
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      navigate('/chef/ai-recipes', {
        state: { 
          manualInput: manualInput.trim(),
          recipeQuery: manualInput.trim(),
        },
      });
    }
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
          <h1 className="text-sm font-semibold text-brand-teal">What do you want to eat?</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 py-8 space-y-6">
        {/* Surprise Me Button */}
        <div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleSurpriseMe}
            iconLeft={<Sparkles size={20} />}
            className="rounded-2xl py-6"
          >
            Surprise Me!
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Get an AI-generated recipe from your available ingredients
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Manual Input */}
        <div className="space-y-4">
          <TextField
            label="What would you like to cook?"
            placeholder="e.g., Chicken Fried Rice, Pasta, Curry..."
            value={manualInput}
            onChange={setManualInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualInput();
              }
            }}
          />
          <Button
            variant="secondary"
            fullWidth
            onClick={handleManualInput}
            iconLeft={<Search size={18} />}
            disabled={!manualInput.trim()}
            className="rounded-xl"
          >
            Find Recipe
          </Button>
        </div>

        {/* Pantry Info */}
        {pantry.length > 0 && (
          <div className="mt-8 p-4 bg-brand-bg rounded-xl border border-brand-sage/20">
            <p className="text-sm font-medium text-brand-teal mb-1">
              Your Pantry
            </p>
            <p className="text-xs text-gray-600">
              {pantry.length} items available • {pantry.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length} expiring soon
            </p>
          </div>
        )}
      </div>
    </Screen>
  );
}

