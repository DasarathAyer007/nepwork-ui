import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AtSign,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserRound,
  UserRoundPlus,
} from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { Input, Label, SubmitButton } from '@/components/ui/forms';

import { handleApiErrors } from '../../../utils/handleApiErrors';
import { useLoginMutation, useSignupMutation } from '../api/authApi';
import { setCredentials } from '../authSlice';
import {
  getPasswordStrength,
  getStrengthLabel,
  getStrengthPercent,
} from '../utils/passwordStrength';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsConditions';
import { SpinnerLoader } from '@/components/loaders/SpinnerLoader';

const signUpSchema = z
  .object({
    account_type: z.enum(['personal', 'organization'], {
      message: 'Please select an account type',
    }),

    full_name: z
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
      .min(3, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .refine((val) => val.trim().length > 0, {
        message: 'Password cannot be empty or spaces only',
      }),

    confirm_password: z.string(),

    terms: z.literal(true, {
      message: 'You must accept the Terms and Conditions',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      account_type: 'personal',
    },
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log('Sign up data:', data);

    const payload = {
      full_name: data.full_name,
      email: data.email,
      username: data.username,
      password: data.password,
      account_type: data.account_type,
      confirm_password: data.confirm_password,
    };

    try {
      await signup(payload).unwrap();

      const loginPayload = {
        username: data.username,
        password: data.password,
      };

      const loginRes = await login(loginPayload).unwrap();

      dispatch(
        setCredentials({
          accessToken: loginRes.access_token,
          refreshToken: loginRes.refresh_token,
          user: loginRes.user,
        })
      );

      navigate('/onboarding');
    } catch (err: unknown) {
      handleApiErrors(err, setError, toast);

      // if (errorData && typeof errorData === 'object') {
      //   Object.entries(errorData).forEach(([field, messages]) => {
      //     if (field in data) {
      //       setError(field as keyof SignUpSchemaType, {
      //         type: 'server',
      //         message: (messages as string[])[0],
      //       });
      //     } else {
      //       toast.error((messages as string[])[0]);
      //     }
      //   });
      //   return;
      // }
      // toast.error(errorData?.detail || 'Something went wrong');
    }
  };

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const selectedAccountType = useWatch({
    control,
    name: 'account_type',
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
        <Label className="mb-1">Sign Up As</Label>
        <div className="grid grid-cols-2 gap-md">
          {/* Personal */}
          <label
            className={`cursor-pointer flex flex-col items-center justify-center p-md border rounded-2xl transition-all text-center h-full
      ${
        selectedAccountType === 'personal'
          ? 'border-primary bg-primary/10'
          : 'border-outline-variant hover:border-primary'
      }
    `}>
            <input
              type="radio"
              value="personal"
              {...register('account_type')}
              className="hidden"
            />

            <span className="material-symbols-outlined text-primary mb-xs">
              <User />
            </span>

            <span className="font-label-md text-label-xl ">Personal</span>
          </label>

          {/* Organization */}
          <label
            className={`cursor-pointer flex flex-col items-center justify-center p-md border rounded-2xl transition-all text-center h-full
      ${
        selectedAccountType === 'organization'
          ? 'border-primary bg-primary/10'
          : 'border-outline-variant hover:border-primary'
      }
    `}>
            <input
              type="radio"
              value="organization"
              {...register('account_type')}
              className="hidden"
            />

            <span className="material-symbols-outlined text-primary mb-xs">
              <Building2 />
            </span>

            <span className="font-label-md text-label-xl">Organization</span>
          </label>
        </div>

        {errors.account_type && (
          <p className="text-error text-sm">{errors.account_type.message}</p>
        )}
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="full_name">
            {selectedAccountType === 'personal'
              ? 'Full Name'
              : 'Organization Name'}
          </Label>
          <div className="relative">
            <UserRound className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              variant="auth"
              id="full_name"
              placeholder="John Doe"
              type="text"
              {...register('full_name')}
            />
          </div>
          {errors.full_name && (
            <p className="text-error text-sm">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              variant="auth"
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
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <AtSign className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              variant="auth"
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              variant="auth"
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              variant="auth"
              id="confirmPassword"
              placeholder="••••••••"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirm_password')}
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
          {errors.confirm_password && (
            <p className="text-error text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-sm">
          <div className="flex items-center h-5">
            <Input
              variant="auth"
              id="terms"
              type="checkbox"
              {...register('terms')}
            />
          </div>
          <span className="text-sm font-medium text-on-surface-variant cursor-pointer select-none">
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
          </span>
        </div>
        {errors.terms && (
          <p className="text-error text-sm">{errors.terms.message}</p>
        )}

        <SubmitButton
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
          <UserRoundPlus strokeWidth={2.75} />
        </SubmitButton>
      </form>
      <SpinnerLoader show={isSigningUp || isLoggingIn} />
    </>
  );
}

export default SignUpForm;
