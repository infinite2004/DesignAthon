import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { ChipGroup } from '../../components/forms/ChipGroup';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

const goals = [
  { label: 'Eat cheaper', value: 'eat-cheaper' },
  { label: 'Waste less food', value: 'waste-less' },
  { label: 'Learn to cook', value: 'learn-cook' },
  { label: 'Meal prep', value: 'meal-prep' },
  { label: 'Try new recipes', value: 'try-recipes' },
  { label: 'Track nutrition', value: 'track-nutrition' },
];

export function OnboardingGoalsScreen() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleNext = async () => {
    if (selectedGoals.length === 0) {
      return; // Require at least one goal
    }

    // Save goals to user preferences
    localStorage.setItem('user_goals', JSON.stringify(selectedGoals));
    
    navigate('/onboarding/diet');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal mb-2">Why are you here?</h1>
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

