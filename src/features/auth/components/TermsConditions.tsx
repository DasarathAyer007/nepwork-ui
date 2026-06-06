import { useRef, useEffect } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutSide';
import { Handshake ,X } from 'lucide-react';

type TermsConditionsProps = {
  onClose: () => void;
};

const TermsConditions = ({ onClose }: TermsConditionsProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
      aria-labelledby="terms-title"
    >
      <div
        ref={modalRef}
        className="bg-surface-container-lowest rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-lg border border-outline-variant"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4 rounded-t-xl flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tertiary-container rounded-lg flex items-center justify-center">
              
              <Handshake size={30} className="text-on-tertiary-container"/>
            </div>
            <h2
              id="terms-title"
              className="text-headline-sm font-semibold text-on-surface"
            >
              Terms & Conditions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
            aria-label="Close terms and conditions"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="p-4 bg-secondary-container rounded-lg border border-secondary-fixed-dim">
            <p className="text-body-md text-on-secondary-container leading-relaxed">
              Please read these terms carefully before using NepWork. By accessing
              our platform, you agree to be bound by these terms and conditions.
            </p>
          </div>

          <div className="space-y-5">
            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
                Account Responsibility
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                By using NepWork, you agree to provide accurate and complete
                information during registration. You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
                Acceptable Use
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                Users must use the platform responsibly and in compliance with all
                applicable laws and regulations. You agree not to misuse our
                services, interfere with platform operations, or engage in any
                activity that violates the rights of others.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
                Account Suspension
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                NepWork reserves the right to suspend or terminate accounts that
                violate these terms, engage in fraudulent activity, or compromise
                the security and integrity of our platform. We may take such
                actions without prior notice when necessary.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
                Modifications to Terms
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Continued use of the
                platform after modifications constitutes acceptance of the updated
                terms. We encourage you to review these terms periodically.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-label-md text-on-surface-variant">
              Last updated: January 2024
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity text-body-md font-medium shadow-sm"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;