import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, ChefHat, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/kitchen', icon: ChefHat, label: 'Kitchen' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/feed') {
      return location.pathname === '/feed' || location.pathname === '/explore';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-20 safe-area-top">
        <Outlet />
      </main>
      
      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full touch-target",
                  "transition-colors duration-200",
                  active
                    ? "text-brand-teal"
                    : "text-gray-500"
                )}
              >
                <Icon
                  size={24}
                  className={cn(
                    "mb-1",
                    active && "scale-110"
                  )}
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
    </div>
  );
}

