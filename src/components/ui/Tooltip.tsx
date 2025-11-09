import { useState, useRef, useEffect, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string | ReactNode;
  children?: ReactNode;
  position?: TooltipPosition;
  delay?: number;
  showHelpIcon?: boolean;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-brand-teal',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-brand-teal',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-brand-teal',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-brand-teal',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children || (
        <button
          type="button"
          className="inline-flex items-center justify-center text-slate-400 hover:text-brand-teal transition-colors touch-target"
          aria-label="Help"
        >
          <HelpCircle size={16} />
        </button>
      )}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            'absolute z-50 px-3 py-2 text-xs font-medium text-white bg-brand-teal rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
            positionClasses[position],
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4 border-transparent',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

export function HelpTooltip({ content, position }: { content: string; position?: TooltipPosition }) {
  return <Tooltip content={content} position={position} showHelpIcon />;
}
