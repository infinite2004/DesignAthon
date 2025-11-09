import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { ChipGroup } from '../../components/forms/ChipGroup';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

const dietOptions = [
  { label: 'None', value: 'none' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Halal', value: 'halal' },
  { label: 'Kosher', value: 'kosher' },
  { label: 'Gluten-free', value: 'gluten-free' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
];

export function OnboardingDietScreen() {
  const navigate = useNavigate();
  const [diets, setDiets] = useState<string[]>(['none']);

  const handleNext = () => {
    localStorage.setItem('user_diet_prefs', JSON.stringify({
      diets: diets.length > 0 ? diets : ['none'],
    }));
    navigate('/onboarding/budget');
  };

  const handleSkip = () => {
    localStorage.setItem('user_diet_prefs', JSON.stringify({
      diets: ['none'],
    }));
    navigate('/onboarding/budget');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal mb-2">Dietary Preferences</h1>
          <p className="text-slate-600">Help us recommend recipes that fit your lifestyle</p>
        </div>

        <ChipGroup
          mode="multi"
          options={dietOptions}
          value={diets}
          onChange={setDiets}
        />

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

