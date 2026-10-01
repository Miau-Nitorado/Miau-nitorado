import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-teal-100'}`}>
          <AlertTriangle size={28} className={variant === 'danger' ? 'text-red-600' : 'text-teal-600'} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full mt-2">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
