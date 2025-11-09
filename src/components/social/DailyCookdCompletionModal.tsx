import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Flame, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDailyCookd } from '../../hooks/useDailyCookd';

interface DailyCookdCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyCookdCompletionModal({ isOpen, onClose }: DailyCookdCompletionModalProps) {
  const navigate = useNavigate();
  const { streak } = useDailyCookd();

  useEffect(() => {
    // Auto-close after 5 seconds
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 safe-area-top safe-area-bottom">
      <div className="mx-4 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-sage to-brand-teal p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center">Daily Cook'd Complete!</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-center text-gray-700">
            You've shared your cooking today! 🎉
          </p>

          {streak > 0 && (
            <div className="flex items-center justify-center gap-2 p-4 bg-brand-bg rounded-xl border border-brand-sage/20">
              <Flame size={24} className="text-brand-yellow" />
              <div>
                <p className="text-lg font-bold text-brand-teal">{streak} day streak</p>
                <p className="text-xs text-gray-600">Keep it going! 🔥</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={onClose}
              className="rounded-xl"
            >
              View Feed
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                onClose();
                navigate('/profile');
              }}
              className="rounded-xl"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

