import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { ChipGroup } from '../../components/forms/ChipGroup';
import { useToast } from '../../components/ui/ToastContext';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingDietScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [diets, setDiets] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const dietOptions = [
    { label: 'Vegan', value: 'vegan' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Pescatarian', value: 'pescatarian' },
    { label: 'Keto', value: 'keto' },
    { label: 'Paleo', value: 'paleo' },
    { label: 'Halal', value: 'halal' },
    { label: 'Kosher', value: 'kosher' },
    { label: 'No restrictions', value: 'none' },
  ];

  const allergyOptions = [
    { label: 'Peanuts', value: 'peanuts' },
    { label: 'Tree nuts', value: 'tree-nuts' },
    { label: 'Dairy', value: 'dairy' },
    { label: 'Eggs', value: 'eggs' },
    { label: 'Soy', value: 'soy' },
    { label: 'Wheat/Gluten', value: 'gluten' },
    { label: 'Fish', value: 'fish' },
    { label: 'Shellfish', value: 'shellfish' },
    { label: 'Sesame', value: 'sesame' },
  ];

  const handleNext = () => {
    // Save diet preferences to localStorage
    localStorage.setItem('user_diet_prefs', JSON.stringify({
      diets: diets.length > 0 ? diets : ['none'],
      allergies,
    }));
    showToast('Diet preferences saved! 🥗', 'success');
    navigate('/onboarding/friends');
  };

  const handleSkip = () => {
    // Set default: no restrictions
    localStorage.setItem('user_diet_prefs', JSON.stringify({
      diets: ['none'],
      allergies: [],
    }));
    navigate('/onboarding/friends');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">Dietary Preferences</h1>
          <p className="text-slate-600">Help us recommend recipes that fit your lifestyle</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dietary restrictions (select all that apply)
          </label>
          <ChipGroup
            mode="multi"
            options={dietOptions}
            value={diets}
            onChange={setDiets}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Allergies (select all that apply)
          </label>
          <ChipGroup
            mode="multi"
            options={allergyOptions}
            value={allergies}
            onChange={setAllergies}
          />
        </div>

        <div className="pt-4 space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
            className="rounded-2xl"
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSkip}
            className="rounded-2xl"
          >
            Skip
          </Button>
        </div>
      </div>
    </Screen>
  );
}

