import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { Screen } from '../../../components/layout/Screen';
import { formatTimeAgo } from '../../../lib/utils';
import type { MealPlanEntry } from '../../../types';

export function MealPlanScreen() {
  const navigate = useNavigate();
  const mealPlan = useAppStore((state) => state.mealPlan);

  // Get current week dates
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDayLabel = (date: Date) => {
    const dayIndex = date.getDay();
    return weekDays[dayIndex];
  };

  const getDateNumber = (date: Date) => {
    return date.getDate();
  };

  // Sort meals by date
  const sortedMeals = [...mealPlan].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  return (
    <Screen>

      {/* Week View */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <h2 className="font-semibold text-sm mb-3 text-slate-700">This Week</h2>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((dayName, index) => {
              const date = new Date(startOfWeek);
              date.setDate(startOfWeek.getDate() + index);
              const dateNum = getDateNumber(date);
              const mealsForDay = sortedMeals.filter(m => {
                const mealDate = new Date(m.date);
                return mealDate.toDateString() === date.toDateString();
              });
              
              return (
                <div key={dayName} className="text-center">
                  <p className="text-xs text-slate-600 mb-1">{dayName}</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                    mealsForDay.length > 0 ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <span className="text-xs font-semibold">{dateNum}</span>
                  </div>
                  {mealsForDay.length > 0 && (
                    <p className="text-[10px] text-brand-teal mt-1">{mealsForDay.length}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Planned Meals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-700">Planned Meals</h3>
            <button
              onClick={() => navigate('/kitchen/meal-plan/add')}
              className="px-3 py-1.5 bg-brand-teal text-white rounded-full text-xs font-medium touch-target"
            >
              + Add Meal
            </button>
          </div>
          {sortedMeals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 mb-4">No meals planned yet</p>
              <button
                onClick={() => navigate('/kitchen/meal-plan/add')}
                className="px-6 py-3 bg-brand-teal text-white rounded-full font-semibold touch-target"
              >
                Plan Your First Meal
              </button>
            </div>
          ) : (
            sortedMeals.map((meal: MealPlanEntry) => {
              const mealDate = new Date(meal.date);
              const dayLabel = getDayLabel(mealDate);
              const dateLabel = `${dayLabel} ${getDateNumber(mealDate)}`;
              const displayTitle = meal.customTitle || meal.recipe.title;
              const displayDescription = meal.customDescription || meal.recipe.description;
              
              return (
                <div
                  key={meal.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    {/* Meal Photo */}
                    {meal.imageUrl && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={meal.imageUrl}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-brand-sage/20 text-brand-teal rounded-full font-medium">
                              {dateLabel}
                            </span>
                            <span className="text-xs text-slate-600 capitalize">{meal.mealType}</span>
                          </div>
                          <h4 className="font-semibold text-slate-900">{displayTitle}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{displayDescription}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!meal.isCooked) {
                              navigate(`/kitchen/meal-plan/complete/${meal.id}`);
                            }
                          }}
                          className={`ml-2 flex-shrink-0 p-2 rounded-lg touch-target ${
                            meal.isCooked
                              ? 'bg-brand-sage text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Check size={20} className={meal.isCooked ? 'fill-current' : ''} />
                        </button>
                      </div>
                      {meal.isCooked && meal.cookedAt && (
                        <p className="text-xs text-slate-500 mt-2">
                          Cooked {formatTimeAgo(meal.cookedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Add */}
        <div className="mt-6 p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <h3 className="font-semibold text-sm mb-2 text-brand-teal">
            💡 Tip: Plan meals from your inventory
          </h3>
          <p className="text-xs text-slate-700 mb-3">
            When you mark a meal as cooked, the app will automatically update your inventory
            and prompt you to share it on your feed with stats!
          </p>
          <button
            onClick={() => navigate('/kitchen/ai-recipes')}
            className="text-sm text-brand-teal font-medium touch-target"
          >
            Generate recipes from inventory →
          </button>
        </div>
      </div>
    </Screen>
  );
}

