import React, { useState } from 'react';
import { Screen } from '../../../components/layout/Screen';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { SegmentedControl } from '../../../components/forms/SegmentedControl';
import { DatePicker } from '../../../components/forms/DatePicker';
import { NumberStepper } from '../../../components/forms/NumberStepper';
import { TextField } from '../../../components/forms/TextField';
import { MediaPicker, type SelectedMedia } from '../../../components/media/MediaPicker';
import { Button } from '../../../components/ui/Button';
import type { Recipe, MealPlanEntry, GroceryItem } from '../../../types';

export const MealPlanEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const addMealPlanEntry = useAppStore((state) => state.addMealPlanEntry);
  
  // Get recipe from location state if coming from recipe detail or planning screen
  const recipeFromState = location.state?.recipe as Recipe | undefined;
  const recipeIdFromState = location.state?.recipeId as string | undefined;
  
  // Get planning preferences if coming from planning screen
  const planningPrefs = JSON.parse(localStorage.getItem('meal_plan_preferences') || '{}');
  
  // Mock recipe if not provided
  const baseRecipe: Recipe = recipeFromState || {
    id: recipeIdFromState || '1',
    title: 'Chickpea Spinach Curry',
    description: 'A delicious and budget-friendly curry',
    ingredients: [
      { id: '1', name: 'Chickpeas', amount: 1, unit: 'can' },
      { id: '2', name: 'Spinach', amount: 200, unit: 'g' },
    ],
    steps: ['Step 1', 'Step 2'],
    servings: 4,
    prepTime: 10,
    cookTime: 15,
    costEstimate: 2.50,
    tags: [],
    reCookCount: 0,
    createdAt: new Date(),
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');
  const [servings, setServings] = useState(planningPrefs.people || 4);
  const [isEditing, setIsEditing] = useState(false);
  // Initialize with recipe values
  const [mealTitle, setMealTitle] = useState(baseRecipe.title);
  const [mealDescription, setMealDescription] = useState(baseRecipe.description);
  const [mealPhoto, setMealPhoto] = useState<SelectedMedia | null>(null);

  // Update fields if recipe changes (e.g., navigating from different recipe)
  React.useEffect(() => {
    if (recipeFromState) {
      setMealTitle(recipeFromState.title);
      setMealDescription(recipeFromState.description);
    }
  }, [recipeFromState?.id]);

  const handleSave = () => {
    // Validate required fields
    if (!mealTitle || mealTitle.trim() === '') {
      showToast('Please enter a meal name', 'error');
      return;
    }

    const addGroceryItem = useAppStore.getState().addGroceryItem;
    const inventory = useAppStore.getState().inventory;
    
    // Use edited values or fall back to recipe defaults
    const finalTitle = mealTitle.trim() || baseRecipe.title;
    const finalDescription = mealDescription.trim() || baseRecipe.description;
    
    // Create updated recipe with custom fields
    const updatedRecipe: Recipe = {
      ...baseRecipe,
      title: finalTitle,
      description: finalDescription,
    };

    const entry: MealPlanEntry = {
      id: crypto.randomUUID(),
      date: new Date(selectedDate),
      mealType,
      recipeId: baseRecipe.id,
      recipe: updatedRecipe,
      isCooked: false,
      imageUrl: mealPhoto?.url,
      // Save custom fields if they differ from original recipe
      customTitle: finalTitle !== baseRecipe.title ? finalTitle : undefined,
      customDescription: finalDescription !== baseRecipe.description ? finalDescription : undefined,
    };

    addMealPlanEntry(entry);
    
    // Automatically add ingredients to grocery list (respecting inventory)
    if (updatedRecipe.ingredients && updatedRecipe.ingredients.length > 0) {
      let addedCount = 0;
      
      updatedRecipe.ingredients.forEach((ing) => {
        // Check if ingredient is already in inventory (case-insensitive name match)
        const inInventory = inventory.some(
          (invItem) => invItem.name.toLowerCase() === ing.name.toLowerCase()
        );
        
        // Only add to grocery list if not in inventory
        if (!inInventory) {
          // Determine category based on ingredient name (simple heuristic)
          let category = 'Produce';
          const nameLower = ing.name.toLowerCase();
          if (nameLower.includes('can') || nameLower.includes('jar') || nameLower.includes('bottle')) {
            category = 'Canned';
          } else if (nameLower.includes('frozen') || nameLower.includes('ice')) {
            category = 'Frozen';
          } else if (nameLower.includes('spice') || nameLower.includes('flour') || nameLower.includes('sugar') || nameLower.includes('oil')) {
            category = 'Pantry';
          } else if (nameLower.includes('milk') || nameLower.includes('cheese') || nameLower.includes('yogurt') || nameLower.includes('butter')) {
            category = 'Dairy';
          } else if (nameLower.includes('meat') || nameLower.includes('chicken') || nameLower.includes('beef') || nameLower.includes('fish')) {
            category = 'Meat';
          }
          
          const groceryItem: GroceryItem = {
            id: crypto.randomUUID(),
            name: ing.name,
            quantity: ing.amount * servings, // Multiply by servings
            unit: ing.unit,
            category,
            isChecked: false,
            recipeId: baseRecipe.id,
          };
          
          addGroceryItem(groceryItem);
          addedCount++;
        }
      });
      
      if (addedCount > 0) {
        showToast(`Added ${finalTitle} to meal plan and ${addedCount} items to grocery list! 📅`, 'success');
      } else {
        showToast(`Added ${finalTitle} to your meal plan! 📅 (All ingredients already in inventory)`, 'success');
      }
    } else {
      showToast(`Added ${finalTitle} to your meal plan! 📅`, 'success');
    }
    
    navigate('/kitchen/meal-plan');
  };

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-brand-bg border-b border-slate-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-brand-teal" />
          </button>
          <h1 className="text-sm font-semibold text-brand-teal">Add meal to plan</h1>
          <div className="w-8" />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Recipe Info - Editable */}
        <div className="p-4 bg-brand-bg rounded-2xl border border-brand-sage/20">
          <div className="flex items-start justify-between mb-2">
            <h2 className="font-semibold text-sm text-brand-teal">Meal Details</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg touch-target transition-colors ${
                isEditing 
                  ? 'bg-brand-teal text-white' 
                  : 'text-brand-teal hover:bg-brand-sage/10'
              }`}
              title={isEditing ? 'Done editing' : 'Edit meal'}
            >
              <Edit2 size={16} />
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <TextField
                label="Meal Name"
                value={mealTitle}
                onChange={setMealTitle}
                placeholder="Enter meal name"
              />
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  placeholder="Enter meal description"
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent text-xs"
                  maxLength={500}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {mealDescription.length}/500 characters
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-sm mb-1 text-slate-900">
                {mealTitle || baseRecipe.title}
              </h3>
              <p className="text-xs text-slate-600 whitespace-pre-wrap">
                {mealDescription || baseRecipe.description}
              </p>
            </div>
          )}
        </div>

        {/* Photo Picker */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Add Photo (Optional)
          </label>
          <MediaPicker
            media={mealPhoto}
            onChange={setMealPhoto}
            label=""
          />
        </div>

        {/* Date Picker */}
        <DatePicker
          label="Date"
          value={selectedDate}
          onChange={setSelectedDate}
        />

        {/* Meal Type Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Meal Type</label>
          <SegmentedControl
            value={mealType}
            onChange={(v) => setMealType(v as typeof mealType)}
            options={[
              { label: 'Breakfast', value: 'breakfast' },
              { label: 'Lunch', value: 'lunch' },
              { label: 'Dinner', value: 'dinner' },
              { label: 'Snack', value: 'snack' },
            ]}
          />
        </div>

        {/* Servings */}
        <NumberStepper
          label="Servings"
          value={servings}
          min={1}
          max={20}
          onChange={setServings}
        />

        {/* Save Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            className="rounded-2xl"
          >
            Add to Meal Plan
          </Button>
        </div>
      </div>
    </Screen>
  );
};
