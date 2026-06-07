import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AtSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserRound,
  UserRoundPlus,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  getPasswordStrength,
  getStrengthLabel,
  getStrengthPercent,
} from '../utils/passwordStrength';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsConditions';

const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name is too long'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address')
      .max(254, 'Email is too long'),

    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores'
      ),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .refine((val) => val.trim().length > 0, {
        message: 'Password cannot be empty or spaces only',
      }),

    confirmPassword: z.string(),

    terms: z.literal(true, {
      message: 'You must accept the Terms and Conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpSchemaType = z.infer<typeof signUpSchema>;

function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log('Sign up data:', data);
  };

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const score = getPasswordStrength(password);
  const strength = getStrengthLabel(score);
  const percent = getStrengthPercent(score);

  return (
    <>
      {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} />}

      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      <form
        className="space-y-lg"
        id="signUpForm"
        onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
          <div className="relative">
            <UserRound className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              className="w-full pl-12 pr-md py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="fullName"
              placeholder="John Doe"
              type="text"
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-error text-sm">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              className="w-full pl-12 pr-md py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="email"
              placeholder="john@example.com"
              type="email"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <AtSign className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              className="w-full pl-12 pr-md py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="username"
              placeholder="JohnDoe123"
              type="text"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              className="w-full pl-12 pr-12 py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <EyeOff className="material-symbols-outlined" />
              ) : (
                <Eye className="material-symbols-outlined" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}

          <div className="h-2 w-full bg-surface-container rounded overflow-hidden">
            <div
              className={`h-full transition-all ${strength.color}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              className="w-full pl-12 pr-12 py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="confirmPassword"
              placeholder="••••••••"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
            />
            <button
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? (
                <EyeOff className="material-symbols-outlined" />
              ) : (
                <Eye className="material-symbols-outlined" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-error text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-sm">
          <div className="flex items-center h-5">
            <input
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
              id="terms"
              type="checkbox"
              {...register('terms')}
            />
          </div>
          <label
            className="text-sm font-medium text-on-surface-variant cursor-pointer select-none"
            htmlFor="terms">
            I agree to the{' '}
            <button
              className="text-primary hover:underline font-semibold"
              type="button"
              onClick={() => setShowTerms(true)}>
              Terms and Conditions
            </button>{' '}
            and{' '}
            <button
              className="text-primary hover:underline font-semibold"
              type="button"
              onClick={() => setShowPrivacy(true)}>
              Privacy Policy
            </button>
            .
          </label>
        </div>
        {errors.terms && (
          <p className="text-error text-sm">{errors.terms.message}</p>
        )}

        <button
          className="w-full bg-primary text-on-primary py-3 px-lg rounded-md font-bold text-base shadow-ambient hover:bg-primary-dim active:scale-[0.99] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
          <UserRoundPlus strokeWidth={2.75} />
        </button>
      </form>
    </>
  );
}

export default SignUpForm;
