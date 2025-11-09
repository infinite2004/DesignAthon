import { Home, Plus, ChefHat, User, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

import type { LucideIcon } from 'lucide-react';

export type Tab = {
  key: 'feed' | 'create' | 'marketplace' | 'kitchen' | 'profile';
  label: string;
  icon: LucideIcon;
  path: string;
};

export type BottomTabBarProps = {
  currentPath: string;
};

export function BottomTabBar({ currentPath }: BottomTabBarProps) {
  const navigate = useNavigate();

  const tabs: Tab[] = [
    { key: 'feed', label: 'Feed', icon: Home, path: '/feed' },
    { key: 'create', label: 'Create', icon: Plus, path: '/create' },
    { key: 'marketplace', label: 'Marketplace', icon: Store, path: '/marketplace' },
    { key: 'kitchen', label: 'Kitchen', icon: ChefHat, path: '/kitchen' },
    { key: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/feed') {
      return currentPath === '/feed' || currentPath === '/explore';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-bg border-t border-slate-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full touch-target",
                "transition-colors duration-200",
                active ? "text-brand-teal" : "text-slate-500"
              )}
            >
              <Icon
                size={24}
                className={cn("mb-1", active && "scale-110")}
              />
              <span className={cn(
                "text-xs font-medium",
                active && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

