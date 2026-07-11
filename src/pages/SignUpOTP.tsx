import { useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { SignUpIntro } from '../features/auth';
import SingUpOTPForm from '../features/auth/components/SingUpOTPForm';

type VerifyState = {
  email?: string;
  message?: string;
};

function SignUpOTP() {
  const location = useLocation();
  const state = (location.state || {}) as VerifyState;

  const email = useMemo(
    () => state.email || sessionStorage.getItem('otpEmail') || '',
    [state.email]
  );

  const message = useMemo(
    () => state.message || sessionStorage.getItem('otpMessage') || undefined,
    [state.message]
  );

  if (!email) {
    return (
      <div className="min-h-screen bg-background px-6 py-16 text-on-surface">
        <div className="mx-auto flex min-h-[60vh] flex-col items-start justify-center rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-8 shadow-form">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Verification required
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            We need your signup email first
          </h1>
          <p className="mt-3 text-base leading-7 text-on-surface-variant">
            Start from the signup page so we can send and verify the correct
            code.
          </p>
          <Link
            className="mt-8 inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:brightness-110"
            to="/signup">
            Back to signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-background text-on-surface antialiased">
      <main className="min-h-screen flex flex-col md:flex-row">
        <SignUpIntro />

        <section className="flex flex-1 items-center justify-center px-6 py-12 md:px-10 md:py-20">
          <SingUpOTPForm email={email} message={message} />
        </section>
      </main>
    </div>
  );
}

export default SignUpOTP;
