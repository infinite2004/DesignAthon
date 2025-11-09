import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { NumberStepper } from '../../components/forms/NumberStepper';
import { ChipGroup } from '../../components/forms/ChipGroup';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingCookingFrequencyScreen() {
  const navigate = useNavigate();
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [proteinGoals, setProteinGoals] = useState<string[]>([]);

  const proteinOptions = [
    { label: 'High protein', value: 'high-protein' },
    { label: 'Moderate protein', value: 'moderate-protein' },
    { label: 'Plant-based', value: 'plant-based' },
    { label: 'No preference', value: 'no-preference' },
  ];

  const handleNext = () => {
    // Save preferences to localStorage
    localStorage.setItem('user_cooking_prefs', JSON.stringify({
      daysPerWeek,
      proteinGoals,
    }));
    navigate('/onboarding/diet');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">How often do you cook?</h1>
          <p className="text-slate-600">Help us personalize your experience</p>
        </div>

        <NumberStepper
          label="How many days a week do you want to cook?"
          value={daysPerWeek}
          min={1}
          max={7}
          onChange={setDaysPerWeek}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Meal prep for protein goals
          </label>
          <ChipGroup
            mode="multi"
            value={proteinGoals}
            options={proteinOptions}
            onChange={setProteinGoals}
          />
        </div>

        <div className="pt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
            className="rounded-2xl"
          >
            Continue
          </Button>
        </div>
      </div>
    </Screen>
  );
}

