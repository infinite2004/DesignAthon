import { useNavigate } from 'react-router-dom';
import { Clock, Flame, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDailyCookd } from '../../hooks/useDailyCookd';

export function DailyDropBanner() {
  const navigate = useNavigate();
  const { hasPostedToday, streak, timeRemaining } = useDailyCookd();

  // Don't show if user hasn't posted and time has expired
  if (!hasPostedToday && timeRemaining !== null && timeRemaining <= 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleStartPost = () => {
    // Navigate to capture with daily flag
    navigate('/post/capture', {
      state: { isDailyCookd: true },
    });
  };

  // Show completion state if posted today
  if (hasPostedToday) {
    return (
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-brand-sage to-brand-teal rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={20} className="text-white" />
              <span className="text-lg font-bold text-white">Daily Cook'd Complete!</span>
            </div>
            <p className="text-sm text-white/90 mb-2">
              You've shared your cooking today 🎉
            </p>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Flame size={14} className="text-brand-yellow" />
                <span>{streak} day streak</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4 p-4 bg-brand-teal rounded-2xl text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white">Daily Cook'd</span>
            <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs font-medium text-white">
              BeReal style
            </span>
          </div>
          <p className="text-sm text-white mb-2">
            Share what you're cooking today!
          </p>
          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className="flex items-center gap-1 text-xs text-white">
                <Clock size={14} />
                <span>{formatTime(timeRemaining)} left</span>
              </div>
            )}
            {streak > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Flame size={14} className="text-brand-yellow" />
                <span>{streak} day streak</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleStartPost}
          className="bg-white text-brand-teal hover:bg-white/90 font-semibold"
        >
          Post Now
        </Button>
      </div>
    </div>
  );
}

