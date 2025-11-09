import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSwitcherProps {
  currentWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function WeekSwitcher({
  currentWeek,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekSwitcherProps) {
  const startOfWeek = new Date(currentWeek);
  startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // Sunday
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const isCurrentWeek = () => {
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setDate(today.getDate() - today.getDay());
    return startOfWeek.toDateString() === todayStart.toDateString();
  };

  const formatWeekRange = () => {
    const monthStart = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const monthEnd = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${monthStart} - ${monthEnd}`;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={onPreviousWeek}
        className="p-2 text-slate-600 hover:text-brand-teal touch-target"
        aria-label="Previous week"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors touch-target ${
            isCurrentWeek()
              ? 'bg-brand-teal text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Today
        </button>
        <span className="font-semibold text-sm text-slate-900">
          {formatWeekRange()}
        </span>
      </div>

      <button
        onClick={onNextWeek}
        className="p-2 text-slate-600 hover:text-brand-teal touch-target"
        aria-label="Next week"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
