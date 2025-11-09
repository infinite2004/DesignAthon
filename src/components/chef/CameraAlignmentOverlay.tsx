import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

type CameraAlignmentOverlayProps = {
  scanType: 'receipt' | 'fridge';
  onDismiss?: () => void;
};

const alignmentTips = {
  receipt: [
    'Place receipt on a flat surface',
    'Ensure good lighting',
    'Align receipt within the frame',
    'Keep camera steady',
    'Make sure text is clear and readable',
  ],
  fridge: [
    'Open fridge fully',
    'Ensure good lighting inside',
    'Keep camera steady',
    'Capture entire fridge interior',
    'Make items clearly visible',
  ],
};

export function CameraAlignmentOverlay({ scanType, onDismiss }: CameraAlignmentOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Auto-rotate tips every 3 seconds
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % alignmentTips[scanType].length);
    }, 3000);

    return () => clearInterval(interval);
  }, [scanType]);

  if (!isVisible) return null;

  const tips = alignmentTips[scanType];
  const currentTip = tips[currentTipIndex];

  return (
    <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-brand-teal" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {scanType === 'receipt' ? 'Align Receipt' : 'Align Camera'}
            </h3>
          </div>
        </div>

        {/* Frame Guide */}
        <div className="mb-4 relative">
          <div className="aspect-[4/3] border-4 border-brand-teal rounded-xl border-dashed relative overflow-hidden">
            {/* Corner guides */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-teal" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-teal" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-teal" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-teal" />
            
            {/* Center guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-brand-teal font-medium mb-1">
                  {scanType === 'receipt' ? 'Receipt' : 'Fridge Interior'}
                </p>
                <div className="w-16 h-1 bg-brand-teal/30 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Tip */}
        <div className="mb-4 p-3 bg-brand-bg rounded-xl border border-brand-sage/20">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {currentTipIndex + 1}
            </div>
            <p className="text-sm text-slate-700 flex-1">{currentTip}</p>
          </div>
        </div>

        {/* Tip Indicators */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {tips.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentTipIndex
                  ? "w-6 bg-brand-teal"
                  : "w-1.5 bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsVisible(false);
              if (onDismiss) onDismiss();
            }}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-slate-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Got it
          </button>
          <button
            onClick={() => {
              setIsVisible(false);
            }}
            className="px-4 py-2.5 bg-brand-teal text-white rounded-xl font-medium hover:bg-brand-teal/90 transition-colors"
          >
            Start Scanning
          </button>
        </div>
      </div>
    </div>
  );
}

// Default export for compatibility
export default CameraAlignmentOverlay;
