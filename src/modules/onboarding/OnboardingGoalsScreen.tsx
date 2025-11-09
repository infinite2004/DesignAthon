import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { ChipGroup } from '../../components/forms/ChipGroup';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingGoalsScreen() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { label: 'Reduce food waste', value: 'reduce-waste' },
    { label: 'Save money', value: 'save-money' },
    { label: 'Eat healthier', value: 'eat-healthier' },
    { label: 'Meal prep', value: 'meal-prep' },
    { label: 'Try new recipes', value: 'try-recipes' },
    { label: 'Track nutrition', value: 'track-nutrition' },
  ];

  const handleNext = () => {
    // Save goals to localStorage or user preferences
    if (selectedGoals.length > 0) {
      localStorage.setItem('user_goals', JSON.stringify(selectedGoals));
    }
    navigate('/onboarding/budget');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">What are your goals?</h1>
          <p className="text-slate-600">Select all that apply</p>
        </div>

        <ChipGroup
          mode="multi"
          value={selectedGoals}
          options={goals}
          onChange={setSelectedGoals}
        />

        <div className="pt-6">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
            disabled={selectedGoals.length === 0}
            className="rounded-2xl"
          >
            Continue
          </Button>
        </div>
      </div>
    </Screen>
  );
}

