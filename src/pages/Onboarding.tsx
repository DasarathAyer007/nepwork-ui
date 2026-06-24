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
        <style>{`
        body {
          font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
          background-color: var(--color-background, #f2fbff);
        }
        .input-focus:focus {
          outline: none;
          border-color: var(--color-primary, #004f60);
          box-shadow: 0 0 0 2px rgba(0, 79, 96, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #bfc8cc; border-radius: 10px; }
        .toggle-active {
          background-color: #ffffff;
          color: var(--color-primary, #004f60);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .social-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid var(--color-outline-variant, #bfc8cc);
          border-radius: 8px;
          box-shadow: 0 12px 30px -6px rgba(36, 103, 122, 0.15);
          z-index: 10;
          display: flex;
          gap: 8px;
          padding: 12px;
        }
        .social-dropdown button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--color-outline-variant, #bfc8cc);
          background: white;
          cursor: pointer;
          transition: 0.2s;
        }
        .social-dropdown button:hover {
          background: var(--color-surface-container-high, #e0eaed);
          border-color: var(--color-primary, #004f60);
        }
      `}</style>

        {/* Full‑page container with responsive padding */}
        <div className="w-full max-w-5xl mx-auto px-6 md:px-10 pt-24 pb-16">
          {/* Heading */}
          <h1 className="text-headline-lg font-bold text-primary mb-2 tracking-headline-lg">
            Complete Your Profile
          </h1>
          <p className="text-on-surface-variant text-body-md mb-10">
            {viewType === 'individual'
              ? 'Tell us about yourself so we can personalise your experience.'
              : 'Set up your company presence and connect with professionals.'}
          </p>

          {/* View Toggle */}
          <div className="mb-12">
            <div className="bg-surface-container-low p-1 rounded-md inline-flex">
              <button
                type="button"
                onClick={() => handleChangeView('individual')}
                className={`py-3 px-6 rounded-md text-sm font-semibold ${
                  viewType === 'individual'
                    ? 'toggle-active'
                    : 'text-on-surface-variant'
                }`}>
                Individual
              </button>

              <button
                type="button"
                onClick={() => handleChangeView('organization')}
                className={`py-3 px-6 rounded-md text-sm font-semibold ${
                  viewType === 'organization'
                    ? 'toggle-active'
                    : 'text-on-surface-variant'
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
          <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                security
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Enterprise Secure
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                verified_user
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Verified Professionals
              </span>
            </div>
            <div className="flex items-center gap-2">
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
          <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

          {/* modal */}
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-container p-6 shadow-xl border border-outline-variant">
            <Dialog.Title className="text-lg font-bold text-on-surface">
              Switch profile type?
            </Dialog.Title>

            <Dialog.Description className="mt-2 text-sm text-on-surface-variant">
              Changing this will switch your form between Individual and
              Organization.
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setPendingType(null);
                }}
                className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant">
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
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold">
                Continue
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
