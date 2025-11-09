import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { NumberStepper } from '../../components/forms/NumberStepper';
import { SegmentedControl } from '../../components/forms/SegmentedControl';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress';

export function OnboardingBudgetScreen() {
  const navigate = useNavigate();
  const [budgetPeriod, setBudgetPeriod] = useState<'week' | 'month'>('week');
  const [budgetAmount, setBudgetAmount] = useState(100);

  const handleNext = () => {
    // Save budget to localStorage or user preferences
    localStorage.setItem('user_budget', JSON.stringify({
      period: budgetPeriod,
      amount: budgetAmount,
    }));
    navigate('/onboarding/cooking-frequency');
  };

  return (
    <Screen>
      <OnboardingProgress />
      <div className="px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">What's your food budget?</h1>
          <p className="text-slate-600">Set your budget for food expenses</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Budget Period
          </label>
          <SegmentedControl
            value={budgetPeriod}
            onChange={(v) => setBudgetPeriod(v as 'week' | 'month')}
            options={[
              { label: 'Per Week', value: 'week' },
              { label: 'Per Month', value: 'month' },
            ]}
          />
        </div>

        <NumberStepper
          label={`Budget Amount (${budgetPeriod === 'week' ? 'per week' : 'per month'})`}
          value={budgetAmount}
          min={10}
          max={1000}
          step={10}
          onChange={setBudgetAmount}
        />

        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <p className="text-xs text-slate-600">
            💡 We'll track your spending and help you stay within budget by showing cost per serving for recipes.
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

