import { useNavigate } from 'react-router-dom';
import { Package, Sparkles, Calendar, ShoppingCart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Screen } from '../../components/layout/Screen';

interface KitchenTile {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export function KitchenScreen() {
  const navigate = useNavigate();

  const tiles: KitchenTile[] = [
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track what you have',
      icon: Package,
      path: '/kitchen/inventory',
      color: 'bg-blue-500',
    },
    {
      id: 'ai-recipes',
      title: 'AI Recipes',
      description: 'Generate recipes from your inventory',
      icon: Sparkles,
      path: '/kitchen/ai-recipes',
      color: 'bg-purple-500',
    },
    {
      id: 'meal-plan',
      title: 'Meal Plan',
      description: 'Plan your week',
      icon: Calendar,
      path: '/kitchen/meal-plan',
      color: 'bg-green-500',
    },
    {
      id: 'grocery-list',
      title: 'Grocery List',
      description: 'Shopping made easy',
      icon: ShoppingCart,
      path: '/kitchen/grocery-list',
      color: 'bg-orange-500',
    },
  ];

  return (
    <Screen>

      {/* Tiles Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => navigate(tile.path)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl text-white",
                "active:scale-95 transition-transform touch-target",
                tile.color
              )}
            >
              <Icon size={32} className="mb-3" />
              <h2 className="font-semibold text-lg mb-1">{tile.title}</h2>
              <p className="text-sm opacity-90 text-center">{tile.description}</p>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-semibold text-sm mb-3 text-gray-700">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-600 mt-1">Items in stock</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-600 mt-1">Expiring soon</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">7</p>
              <p className="text-xs text-gray-600 mt-1">Meals planned</p>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

