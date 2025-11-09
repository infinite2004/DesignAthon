import { ArrowLeft, Sparkles, Settings, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type AppHeaderProps = {
  title?: string;
  rightIcon?: 'explore' | 'settings' | 'notifications' | 'search' | null;
  onRightIconPress?: () => void;
  showBackButton?: boolean;
};

export function AppHeader({ 
  title, 
  rightIcon, 
  onRightIconPress, 
  showBackButton = false 
}: AppHeaderProps) {
  const navigate = useNavigate();

  const getRightIcon = () => {
    switch (rightIcon) {
      case 'explore':
        return <Sparkles size={20} />;
      case 'settings':
        return <Settings size={20} />;
      case 'search':
        return <Search size={20} />;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-bg border-b border-slate-200 safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 touch-target"
            >
              <ArrowLeft size={24} className="text-brand-teal" />
            </button>
          )}
          {title && (
            <h1 className={cn(
              "text-xl font-bold text-brand-teal",
              showBackButton && "text-lg font-semibold"
            )}>
              {title === 'Cookd' ? (
                <span 
                  style={{ 
                    fontFamily: '"Madimi One", cursive',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#FFD07B',
                  }}
                >
                  Cookd
                </span>
              ) : (
                title
              )}
            </h1>
          )}
        </div>
        {rightIcon && (
          <button
            onClick={onRightIconPress}
            className="p-2 text-brand-teal hover:bg-brand-sage/10 rounded-full touch-target"
            aria-label={rightIcon}
          >
            {getRightIcon()}
          </button>
        )}
      </div>
    </header>
  );
}

