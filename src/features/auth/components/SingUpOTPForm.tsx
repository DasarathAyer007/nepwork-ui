import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { MoveLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { SubmitButton } from '@/components/ui/forms';

import { useResendOtpMutation, useVerifyOtpMutation } from '../api/authApi';
import { setCredentials } from '../authSlice';

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter the 6-digit code sent to your email')
    .regex(/^[0-9]{6}$/, 'OTP must contain only numbers'),
});

type SingUpOTPFormProps = {
  email: string;
  message?: string;
};

function SingUpOTPForm({ email, message }: SingUpOTPFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [formError, setFormError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!inputRefs.current[0]) {
      return;
    }

    inputRefs.current[0].focus();
  }, []);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateDigits = (nextDigits: string[]) => {
    const normalized = nextDigits.slice(0, 6);
    while (normalized.length < 6) {
      normalized.push('');
    }
    setDigits(normalized);
    setFormError(null);
  };

  const handleChange = (index: number, rawValue: string) => {
    const onlyDigits = rawValue.replace(/\D/g, '');

    if (!onlyDigits) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      updateDigits(nextDigits);
      return;
    }

    const nextDigits = [...digits];

    onlyDigits.split('').forEach((digit, offset) => {
      if (index + offset < 6) {
        nextDigits[index + offset] = digit;
      }
    });

    updateDigits(nextDigits);

    const nextIndex = Math.min(index + onlyDigits.length, 5);
    focusInput(nextIndex);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Backspace') {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        updateDigits(nextDigits);
        return;
      }

      if (index > 0) {
        const previousIndex = index - 1;
        const nextDigits = [...digits];
        nextDigits[previousIndex] = '';
        updateDigits(nextDigits);
        focusInput(previousIndex);
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');

    if (!pasted) {
      return;
    }

    const nextDigits = [...digits];

    pasted.split('').forEach((digit, offset) => {
      if (index + offset < 6) {
        nextDigits[index + offset] = digit;
      }
    });

    updateDigits(nextDigits);
    focusInput(Math.min(index + pasted.length, 5));
  };

  const onSubmit = async () => {
    const otp = digits.join('');
    const validation = otpSchema.safeParse({ otp });

    if (!validation.success) {
      setFormError('Enter the 6-digit code sent to your email');
      return;
    }

    try {
      const response = await verifyOtp({ email, otp }).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: response.user,
        })
      );

      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('otpMessage');

      toast.success(response.message || 'Email verified successfully');
      navigate('/onboarding');
    } catch (err: unknown) {
      setFormError(null);
      const errorData = err as {
        data?: { message?: string; detail?: string };
      };
      toast.error(
        errorData?.data?.message ||
          errorData?.data?.detail ||
          'Unable to verify the code right now.'
      );
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    try {
      const response = await resendOtp({ email }).unwrap();

      setDigits(Array(6).fill(''));
      setSecondsLeft(response.cooldown_seconds ?? 60);
      inputRefs.current[0]?.focus();
      toast.success(response.message || 'OTP resent successfully.');
    } catch (err: unknown) {
      const errorData = err as {
        data?: { message?: string; detail?: string };
      };

      toast.error(
        errorData?.data?.message ||
          errorData?.data?.detail ||
          'Unable to resend the code right now.'
      );
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = String(secondsLeft % 60).padStart(2, '0');
  const canResend = secondsLeft === 0;

  return (
    <div className="w-full  rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-form md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verify email
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
            Enter the 6-digit code
          </h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant md:text-base">
            We sent a one-time code to{' '}
            <span className="font-semibold text-on-surface">{email}</span>.
          </p>
        </div>

        <Link
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/60 text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          to="/signup"
          aria-label="Back to signup">
          <MoveLeft className="h-5 w-5" />
        </Link>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm leading-6 text-secondary">
          {message}
        </div>
      )}

      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              aria-label={`OTP digit ${index + 1}`}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              className="h-14 w-11 rounded-2xl border border-outline-variant bg-surface text-center text-xl font-bold tracking-[0.2em] text-on-surface outline-none transition duration-150 placeholder:text-outline-variant focus:border-primary focus:ring-4 focus:ring-primary/10 md:h-16 md:w-12"
              inputMode="numeric"
              maxLength={1}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onFocus={(event) => event.currentTarget.select()}
              placeholder="0"
              type="text"
              value={digit}
            />
          ))}
        </div>

        {formError && (
          <p className="text-center text-sm text-error">{formError}</p>
        )}

        <SubmitButton loading={isLoading} disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </SubmitButton>

        <div className="space-y-3 text-center text-sm text-on-surface-variant">
          <p>Did not receive the code yet?</p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-outline-variant px-5 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-outline-variant disabled:text-on-surface-variant/50"
            onClick={handleResend}
            disabled={!canResend || isResending || isLoading}>
            {canResend
              ? isResending
                ? 'Resending...'
                : 'Resend OTP'
              : `Resend in ${minutes}:${remainingSeconds}`}
          </button>
          <p className="text-xs leading-5 text-on-surface-variant/80">
            You can resend a new code after one minute. Check your spam folder
            while you wait.
          </p>
        </div>
      </form>
    </div>
  );
}

export default SingUpOTPForm;
