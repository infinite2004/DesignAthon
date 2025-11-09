import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

const budgetOptions = [
  { label: 'Cheap & cheerful', value: 'cheap' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'I spoil myself', value: 'premium' },
];

export function OnboardingBudgetScreen() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('balanced');

  const handleNext = () => {
    localStorage.setItem('user_budget', JSON.stringify({ level: budget }));
    navigate('/onboarding/inventory');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal mb-2">Budget Preference</h1>
          <p className="text-slate-600">How do you like to spend on food?</p>
        </div>

        <SegmentedControl
          value={budget}
          onChange={setBudget}
          options={budgetOptions}
        />

        <div className="p-4 bg-beige rounded-2xl border border-sage/20">
          <p className="text-xs text-slate-600">
            💡 We'll show you recipes that match your budget preference
          </p>
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

