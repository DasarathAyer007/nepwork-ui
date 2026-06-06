import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  getPasswordStrength,
  getStrengthLabel,
  getStrengthPercent,
} from '../utils/passwordStrength';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .refine((val) => val.trim().length > 0, {
      message: 'Password cannot be empty or spaces only',
    }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const password = watch('password') || '';

  const onSubmit = async (data: LoginSchemaType) => {
    console.log('Login data:', data);
  };

  const score = getPasswordStrength(password);
  const strength = getStrengthLabel(score);
  const percent = getStrengthPercent(score);

  return (
    <>
      <form
        className="space-y-lg"
        id="signInForm"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />

            <input
              className="w-full pl-12 pr-md py-3 bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="email"
              placeholder="name@company.com"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <a
              className="text-xs font-bold text-primary hover:text-primary-dim transition-colors"
              href="#">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />

            <input
              className="w-full pl-12 pr-3 py-3  bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />

            <button
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
              type="button"
              onClick={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOff className="material-symbols-outlined" />
              ) : (
                <Eye className="material-symbols-outlined" />
              )}
            </button>
          </div>

          <div className="h-2 w-full bg-surface-container rounded overflow-hidden">
            <div
              className={`h-full transition-all ${strength.color}`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center gap-sm">
          <input
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
            id="remember"
            type="checkbox"
          />
          <label
            className="text-sm font-medium text-on-surface-variant cursor-pointer select-none"
            htmlFor="remember">
            Remember me for 30 days
          </label>
        </div>
        <button
          className="w-full bg-primary text-on-primary py-3 px-lg rounded-md font-bold text-base shadow-ambient hover:bg-primary-dim active:scale-[0.99] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined text-[18px]">
            <LogIn strokeWidth={2.75} />
          </span>
        </button>
      </form>
    </>
  );
}

export default LoginForm;
