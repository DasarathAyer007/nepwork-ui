import { useEffect, useRef } from 'react';

import { ShieldCheck, X } from 'lucide-react';

import { useClickOutside } from '../../../hooks/useClickOutSide';

type PrivacyPolicyProps = {
  onClose: () => void;
};

const PrivacyPolicy = ({ onClose }: PrivacyPolicyProps) => {
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
      aria-labelledby="privacy-title">
      <div
        ref={modalRef}
        className="bg-surface-container-lowest rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-lg border border-outline-variant">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4 rounded-t-xl flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
              <ShieldCheck size={30} className=" text-primary" />
            </div>
            <h2
              id="privacy-title"
              className="text-headline-sm font-semibold text-on-surface">
              Privacy Policy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
            aria-label="Close privacy policy">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="p-4 bg-primary-container rounded-lg border border-primary-fixed-dim">
            <p className="text-body-md text-on-primary-fixed leading-relaxed">
              Your privacy is important to us. This policy outlines how we
              collect, use, and protect your personal information.
            </p>
          </div>

          <div className="space-y-5">
            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Information We Collect
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                NepWork collects only the information necessary to provide and
                improve our services. This may include your name, email address,
                profile information, and usage data to enhance your experience.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Data Security
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                Your personal information is kept secure using industry-standard
                encryption and security measures. We never sell your data to
                third parties. Access to your information is strictly limited to
                authorized personnel.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Your Rights & Consent
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                By using NepWork, you consent to the collection and use of your
                data as described in this policy. You have the right to access,
                modify, or delete your personal data at any time through your
                account settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Contact Us
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed pl-4">
                If you have any questions or concerns about this Privacy Policy,
                please reach out to our support team at{' '}
                <a
                  href="mailto:privacy@nepwork.com"
                  className="text-primary hover:underline">
                  privacy@nepwork.com
                </a>
                .
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
              className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity text-body-md font-medium shadow-sm">
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
