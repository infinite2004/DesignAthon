import { Outlet } from 'react-router-dom';
import { BottomTabBar } from '../components/layout/BottomTabBar';
import { AppHeader } from '../components/layout/AppHeader';
import { useLocation, useNavigate } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine header based on route
  const getHeaderConfig = () => {
    const path = location.pathname;
    
        if (path === '/feed' || path === '/') {
          return { title: 'Cookd', showBack: false, rightIcon: 'search' as const };
        }
    if (path.startsWith('/create')) {
      return { title: 'Create Post', showBack: true, rightIcon: null };
    }
    if (path.startsWith('/marketplace')) {
      return { title: 'Marketplace', showBack: false, rightIcon: null };
    }
    if (path.startsWith('/kitchen')) {
      return { title: 'Kitchen Hub', showBack: path !== '/kitchen', rightIcon: null };
    }
    if (path.startsWith('/profile')) {
      return { title: 'Profile', showBack: path !== '/profile', rightIcon: 'settings' as const };
    }
    if (path.startsWith('/explore')) {
      return { title: 'Explore', showBack: true, rightIcon: null };
    }
    if (path.startsWith('/post/') || path.startsWith('/recipe/') || path.startsWith('/user/') || path.startsWith('/search')) {
      return { title: '', showBack: true, rightIcon: null };
    }
    
        return { title: 'Cookd', showBack: false, rightIcon: null };
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {headerConfig.title && (
        <AppHeader
          title={headerConfig.title}
          showBackButton={headerConfig.showBack}
          rightIcon={headerConfig.rightIcon}
          onRightIconPress={() => {
            const icon = headerConfig.rightIcon;
            if (icon === 'settings') {
              navigate('/profile/edit');
            } else if (icon === 'search') {
              navigate('/search');
            }
          }}
        />
      )}
      <main className="flex-1 overflow-y-auto pb-20 safe-area-top">
        <Outlet />
      </main>
      <BottomTabBar currentPath={location.pathname} />
    </div>
  );
}

