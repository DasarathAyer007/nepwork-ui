import { useEffect, useRef, useState } from 'react';

import { Loader2, Mail, MessageSquare } from 'lucide-react';

import { useClickOutside } from '@/hooks/useClickOutSide';

import CoverLetterEditor from './CoverLetterEditor';

type StatusChangeDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  onConfirm: (
    message: string,
    sendMessage: boolean,
    sendEmail: boolean
  ) => void;
  onCancel: () => void;
};

function isMessageEmpty(html: string) {
  return html.replace(/<[^>]*>/g, '').trim().length === 0;
}

export default function StatusChangeDialog({
  title,
  description,
  confirmLabel = 'Change',
  isSubmitting = false,
  onConfirm,
  onCancel,
}: StatusChangeDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sendMessage, setSendMessage] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  useClickOutside(dialogRef, () => {
    if (!isSubmitting) onCancel();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, isSubmitting]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const messageEmpty = isMessageEmpty(message);

  const handleConfirm = () => {
    const shouldSend = composerOpen && !messageEmpty;
    onConfirm(
      shouldSend ? message : '',
      shouldSend && sendMessage,
      shouldSend && sendEmail
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-change-dialog-title">
      <div
        ref={dialogRef}
        className="bg-surface-container-lowest rounded-xl max-w-2xl w-full shadow-lg border border-outline-variant p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="status-change-dialog-title"
          className="text-title-md font-bold text-on-surface">
          {title}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
          {description}
        </p>

        {!composerOpen ? (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-medium text-sm hover:bg-surface-container transition-all cursor-pointer">
            <MessageSquare size={16} />
            Send Message
          </button>
        ) : (
          <div className="mt-4">
            <label className="block text-label-md font-semibold text-on-surface-variant mb-1.5">
              Message to applicant
            </label>
            <CoverLetterEditor
              value={message}
              onChange={setMessage}
              placeholder="Write a message to let the applicant know about this update..."
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <label className="flex items-center gap-2 text-body-md text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendMessage}
                  onChange={(e) => setSendMessage(e.target.checked)}
                  className="size-4 accent-primary cursor-pointer"
                />
                <MessageSquare size={16} className="text-on-surface-variant" />
                Message
              </label>
              <label className="flex items-center gap-2 text-body-md text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="size-4 accent-primary cursor-pointer"
                />
                <Mail size={16} className="text-on-surface-variant" />
                Email
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-medium text-sm hover:bg-surface-container transition-all disabled:opacity-50 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
