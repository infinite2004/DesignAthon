import { CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface CaptureSuccessModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onRetake: () => void;
}

export function CaptureSuccessModal({ isOpen, onContinue, onRetake }: CaptureSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 safe-area-top safe-area-bottom">
      <div className="mx-4 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-brand-teal" />
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Photo Captured!</h2>
            <p className="text-sm text-gray-600">
              Ready to create your post
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={onRetake}
              className="rounded-xl"
            >
              Retake
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={onContinue}
              className="rounded-xl"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

