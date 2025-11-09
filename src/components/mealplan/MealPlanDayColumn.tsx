import { Plus } from 'lucide-react';
import type { MealPlanEntry } from '../../types';

interface MealPlanDayColumnProps {
  date: Date;
  meals: MealPlanEntry[];
  onAddMeal: (date: Date) => void;
  onMealClick: (meal: MealPlanEntry) => void;
}

export function MealPlanDayColumn({
  date,
  meals,
  onAddMeal,
  onMealClick,
}: MealPlanDayColumnProps) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = date.getDate();
  const isToday = date.toDateString() === new Date().toDateString();

  const mealsByType = {
    breakfast: meals.filter((m) => m.mealType === 'breakfast'),
    lunch: meals.filter((m) => m.mealType === 'lunch'),
    dinner: meals.filter((m) => m.mealType === 'dinner'),
    snack: meals.filter((m) => m.mealType === 'snack'),
  };

  return (
    <div className="flex flex-col min-w-[140px]">
      {/* Day Header */}
      <div
        className={`text-center p-2 border-b border-slate-200 ${
          isToday ? 'bg-brand-teal text-white' : 'bg-slate-50'
        }`}
      >
        <p className="text-xs font-medium">{dayName}</p>
        <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-900'}`}>
          {dayNumber}
        </p>
      </div>

      {/* Meals */}
      <div className="flex-1 p-2 space-y-2 bg-white border-r border-slate-200">
        {Object.entries(mealsByType).map(([type, typeMeals]) => (
          <div key={type} className="space-y-1">
            {typeMeals.length > 0 && (
              <p className="text-[10px] font-medium text-slate-500 uppercase mb-1">
                {type}
              </p>
            )}
            {typeMeals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onMealClick(meal)}
                className="w-full p-2 bg-brand-bg rounded-lg border border-brand-sage/20 hover:border-brand-sage active:bg-brand-sage/10 transition-colors touch-target text-left"
              >
                <p className="text-xs font-semibold text-brand-teal line-clamp-1">
                  {meal.customTitle || meal.recipe.title}
                </p>
                {meal.imageUrl && (
                  <img
                    src={meal.imageUrl}
                    alt={meal.customTitle || meal.recipe.title}
                    className="w-full h-16 object-cover rounded mt-1"
                  />
                )}
              </button>
            ))}
          </div>
        ))}

        <button
          onClick={() => onAddMeal(date)}
          className="w-full mt-2 p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-brand-sage hover:text-brand-teal transition-colors touch-target flex items-center justify-center gap-1"
        >
          <Plus size={14} />
          <span className="text-xs">Add meal</span>
        </button>
      </div>
    </div>
  );
}
