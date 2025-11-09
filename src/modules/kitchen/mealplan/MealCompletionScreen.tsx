import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';

export const MealCompletionScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const mealPlan = useAppStore((state) => state.mealPlan);
  const updateMealPlanEntry = useAppStore((state) => state.updateMealPlanEntry);

  const meal = mealPlan.find(m => m.id === id);

  const handleComplete = () => {
    if (!meal) {
      showToast('Meal not found', 'error');
      navigate('/kitchen/meal-plan');
      return;
    }

    // Mark meal as cooked
    updateMealPlanEntry(id!, {
      isCooked: true,
      cookedAt: new Date(),
    });

    // Update sustainability tracking
    try {
      const stored = localStorage.getItem('sustainability_tracking');
      const tracking = stored ? JSON.parse(stored) : {
        daysCooked: 0,
        daysGoal: 5,
        moneySaved: 0,
        wasteSaved: 0,
        newRecipesLearned: 0,
        mealsShared: 0,
      };
      
      // Increment days cooked if this is the first meal of the day
      const today = new Date().toDateString();
      const lastCookedDate = localStorage.getItem('last_cooked_date');
      if (lastCookedDate !== today) {
        tracking.daysCooked = (tracking.daysCooked || 0) + 1;
        localStorage.setItem('last_cooked_date', today);
      }
      
      // Update money saved (estimate $10 per meal vs eating out)
      tracking.moneySaved = (tracking.moneySaved || 0) + 10;
      
      localStorage.setItem('sustainability_tracking', JSON.stringify(tracking));
    } catch (error) {
      console.error('Error updating sustainability tracking:', error);
    }

    showToast('Meal marked as cooked 🎉', 'success');
    
    // Optionally navigate to create post
    setTimeout(() => {
      navigate('/kitchen/meal-plan');
    }, 1000);
  };

  if (!meal) {
    return (
      <div className="flex min-h-screen flex-col bg-brand-bg px-4 py-6">
        <h1 className="mb-4 text-sm font-semibold text-slate-900">Meal not found</h1>
        <button
          onClick={() => navigate('/kitchen/meal-plan')}
          className="w-full rounded-2xl bg-brand-teal px-3 py-3 text-xs font-semibold text-white shadow-md touch-target"
        >
          Back to Meal Plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg px-4 py-6">
      <h1 className="mb-4 text-sm font-semibold text-slate-900">How did it go?</h1>
      
      {/* Recipe Summary */}
      <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200">
        <h2 className="font-semibold text-sm mb-1 text-brand-teal">{meal.recipe.title}</h2>
        <p className="text-xs text-slate-600 mb-2">{meal.recipe.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{meal.mealType}</span>
          <span>·</span>
          <span>{new Date(meal.date).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="mb-6 text-xs text-slate-600">
        This will mark the meal as cooked and update your meal plan. You can share it on your feed with stats!
      </p>

      <button
        onClick={handleComplete}
        className="mb-3 w-full rounded-2xl bg-brand-teal px-3 py-3 text-xs font-semibold text-white shadow-md touch-target"
      >
        Mark meal as cooked
      </button>
      <button
        onClick={() => navigate(-1)}
        className="w-full rounded-2xl bg-white px-3 py-3 text-xs font-medium text-slate-700 shadow-sm touch-target"
      >
        Cancel
      </button>
    </div>
  );
};

