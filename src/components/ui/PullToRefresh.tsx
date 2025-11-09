import { useEffect, useRef, useState, ReactNode } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  useEffect(() => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at the top of the scrollable area
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      
      if (distance > 0 && element.scrollTop === 0) {
        const limitedDistance = Math.min(distance, MAX_PULL);
        setPullDistance(limitedDistance);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
      
      setIsPulling(false);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, isRefreshing, onRefresh, disabled]);

  const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const shouldShowIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div ref={elementRef} className="relative w-full h-full overflow-y-auto">
      {/* Pull to refresh indicator */}
      {shouldShowIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 transition-opacity pointer-events-none"
          style={{
            height: `${Math.min(pullDistance, MAX_PULL)}px`,
            opacity: Math.min(pullProgress * 1.2, 1),
          }}
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{
              transform: `translateY(${Math.min(pullDistance, MAX_PULL) / 2 - 20}px)`,
            }}
          >
            {isRefreshing ? (
              <>
                <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-brand-teal font-medium">Refreshing...</span>
              </>
            ) : (
              <>
                <div
                  className="w-6 h-6 border-2 border-brand-teal rounded-full flex items-center justify-center transition-transform"
                  style={{ transform: `rotate(${pullProgress * 180}deg)` }}
                >
                  <svg
                    className="w-4 h-4 text-brand-teal"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                {pullDistance >= PULL_THRESHOLD && (
                  <span className="text-xs text-brand-teal font-medium">Release to refresh</span>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div style={{ paddingTop: shouldShowIndicator && isRefreshing ? '60px' : '0' }}>
        {children}
      </div>
    </div>
  );
}

