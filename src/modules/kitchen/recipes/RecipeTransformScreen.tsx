import React, { useState } from 'react';
import { Screen } from '../../../components/layout/Screen';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { TransformOptions } from '../../../components/recipe/TransformOptions';
import { useAppStore } from '../../../store/appStore';
import { useToast } from '../../../components/ui/ToastContext';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export const RecipeTransformScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const posts = useAppStore((state) => state.posts);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);

  // Find recipe from posts
  const post = posts.find((p) => p.recipeId === id);
  const recipe = post?.recipe;

  const handleTransform = async () => {
    if (selectedOptions.length === 0) {
      showToast('Please select at least one transformation option', 'error');
      return;
    }

    setIsTransforming(true);
    
    // Simulate AI transformation (2s delay)
      setTimeout(() => {
        setIsTransforming(false);
        showToast('Recipe transformed! 🎉', 'success');
        // In a real app, this would navigate to the transformed recipe
        // For now, just show success and navigate back
        setTimeout(() => {
          if (id) {
            navigate(`/recipe/${id}`);
          }
        }, 1000);
      }, 2000);
  };

  if (!recipe) {
    return (
      <Screen>
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="p-2 -ml-2 touch-target" 
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-sm font-semibold text-slate-900">Remix Recipe</h1>
            <div className="w-8" />
          </div>
        </header>
        <div className="flex min-h-screen flex-col bg-slate-50 px-4 py-6">
          <p className="text-xs text-slate-500">
            Recipe not found
          </p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Remix Recipe</h1>
          <div className="w-8" />
        </div>
      </header>
      
      <div className="px-4 py-6">
        {isTransforming ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-sm text-slate-600">
              Transforming recipe with AI...
            </p>
          </div>
        ) : (
          <TransformOptions
            selectedOptions={selectedOptions}
            onChange={setSelectedOptions}
            onTransform={handleTransform}
          />
        )}
      </div>
    </Screen>
  );
};

