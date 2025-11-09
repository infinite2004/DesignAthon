import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  loading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const variantColors = {
    danger: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-brand-teal',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={24}
            className={`flex-shrink-0 mt-0.5 ${variantColors[variant]}`}
          />
          <p className="text-sm text-slate-700">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={loading}
            className="rounded-xl"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className="rounded-xl"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
