// Onboarding.tsx
import { useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';

import {
  IndividualProfileForm,
  OrganizationProfileForm,
} from '../features/auth';

export default function Onboarding() {
  const [viewType, setViewType] = useState<'individual' | 'organization'>(
    'individual'
  );

  const [pendingType, setPendingType] = useState<
    'individual' | 'organization' | null
  >(null);

  const [open, setOpen] = useState(false);

  const handleChangeView = (type: 'individual' | 'organization') => {
    if (type === viewType) return;

    setPendingType(type);
    setOpen(true);
  };
  return (
    <>
      <main className="min-h-screen bg-background text-on-surface antialiased">
        {/* Full‑page container with responsive padding */}
        <div className="w-full max-w-4xl mx-auto px-6 md:px-10 pt-24 pb-16">
          {/* Heading */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-headline-lg font-bold text-primary mb-2 tracking-headline-lg">
              Complete Your Profile
            </h1>
            <p className="text-on-surface-variant text-body-md">
              {viewType === 'individual'
                ? 'Tell us about yourself so we can personalise your experience.'
                : 'Set up your company presence and connect with professionals.'}
            </p>
          </div>

          {/* View Toggle */}
          <div className="mb-8 flex justify-center md:justify-start">
            <div className="bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/30 inline-flex gap-1">
              <button
                type="button"
                onClick={() => handleChangeView('individual')}
                className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  viewType === 'individual'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}>
                Individual
              </button>

              <button
                type="button"
                onClick={() => handleChangeView('organization')}
                className={`py-2 px-6 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  viewType === 'organization'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}>
                Organization
              </button>
            </div>
          </div>

          {/* Form (no card wrapper) */}
          <div className="w-full">
            {viewType === 'individual' ? (
              <IndividualProfileForm key="individual" />
            ) : (
              <OrganizationProfileForm key="organization" />
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                security
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Enterprise Secure
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                verified_user
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Verified Professionals
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                cloud_done
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Data Encrypted
              </span>
            </div>
          </div>
        </div>
      </main>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* overlay */}
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />

          {/* modal */}
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-container-lowest p-6 shadow-xl border border-outline-variant z-[1001]">
            <Dialog.Title className="text-lg font-bold text-on-surface">
              Switch profile type?
            </Dialog.Title>

            <Dialog.Description className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Changing this will switch your form between Individual and
              Organization.
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setPendingType(null);
                }}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container transition-colors cursor-pointer">
                Cancel
              </button>

              <button
                onClick={() => {
                  if (pendingType) {
                    setViewType(pendingType);
                  }
                  setPendingType(null);
                  setOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:brightness-110 active:scale-98 transition cursor-pointer">
                Continue
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
