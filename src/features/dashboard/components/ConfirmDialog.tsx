import { useEffect, useRef } from 'react';

import { AlertTriangle, Loader2 } from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutSide';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, () => {
    if (!isConfirming) onCancel();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, isConfirming]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title">
      <div
        ref={dialogRef}
        className="bg-surface-container-lowest rounded-xl max-w-3xl w-full shadow-lg border border-outline-variant p-6">
        <div className="size-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
          <AlertTriangle size={22} />
        </div>

        <h2
          id="confirm-dialog-title"
          className="text-title-md font-bold text-on-surface">
          {title}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-error text-on-error font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer">
            {isConfirming && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
