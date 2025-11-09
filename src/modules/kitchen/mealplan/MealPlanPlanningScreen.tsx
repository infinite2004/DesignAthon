import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/ui/Button';
import { NumberStepper } from '../../../components/forms/NumberStepper';
import { ChipGroup } from '../../../components/forms/ChipGroup';
import { useToast } from '../../../components/ui/ToastContext';

export function MealPlanPlanningScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [daysToCook, setDaysToCook] = useState(5);
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [people, setPeople] = useState(2);
  const [mealPrepGoals, setMealPrepGoals] = useState<string[]>([]);

  const mealPrepOptions = [
    { label: 'Batch cooking', value: 'batch-cooking' },
    { label: 'Prep ahead', value: 'prep-ahead' },
    { label: 'Quick meals', value: 'quick-meals' },
    { label: 'Freezer meals', value: 'freezer-meals' },
  ];

  const handleCreatePlan = () => {
    // Save planning preferences
    localStorage.setItem('meal_plan_preferences', JSON.stringify({
      daysToCook,
      mealsPerDay,
      people,
      mealPrepGoals,
    }));

    showToast('Planning preferences saved! 📅', 'success');
    navigate('/kitchen/meal-plan/add');
  };

  return (
    <Screen>
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal mb-2">Plan Your Meals</h1>
          <p className="text-slate-600">Tell us about your cooking goals</p>
        </div>

        <NumberStepper
          label="How many days do you want to cook?"
          value={daysToCook}
          min={1}
          max={7}
          onChange={setDaysToCook}
        />

        <NumberStepper
          label="How many meals per day?"
          value={mealsPerDay}
          min={1}
          max={3}
          onChange={setMealsPerDay}
        />

        <NumberStepper
          label="How many people?"
          value={people}
          min={1}
          max={10}
          onChange={setPeople}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Meal prepping goals
          </label>
          <ChipGroup
            mode="multi"
            value={mealPrepGoals}
            options={mealPrepOptions}
            onChange={setMealPrepGoals}
          />
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCreatePlan}
            className="rounded-2xl"
          >
            Create Meal Plan
          </Button>
        </div>
      </div>
    </Screen>
  );
}

