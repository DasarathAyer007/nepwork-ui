import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Input, Label, SubmitButton } from '@/components/ui/forms';

import { handleApiErrors } from '../../../utils/handleApiErrors';
import { useLoginMutation } from '../api/authApi';
import { setCredentials } from '../authSlice';

// import {
//   getPasswordStrength,
//   getStrengthLabel,
//   getStrengthPercent,
// } from '../utils/passwordStrength';

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  password: z
    .string()
    .min(3, 'Password must be at least 3 characters')
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
    setError,
    // control,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // const password = useWatch({
  //   control,
  //   name: 'password',
  //   defaultValue: '',
  // });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const res = await login(data).unwrap();

      console.log('Login successful:', res);
      dispatch(
        setCredentials({
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          user: res.user,
        })
      );

      navigate('/');
    } catch (err: unknown) {
      handleApiErrors(err, setError, toast);
    }
  };

  // const score = getPasswordStrength(password);
  // const strength = getStrengthLabel(score);
  // const percent = getStrengthPercent(score);

  return (
    <>
      <form
        className="space-y-lg"
        id="signInForm"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />

            <Input
              variant="auth"
              id="username"
              placeholder="Enter your username"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <a
              className="text-xs font-bold text-primary hover:text-primary-dim transition-colors"
              href="#">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/50" />

            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              variant="auth"
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

          {/* <div className="h-2 w-full bg-surface-container rounded overflow-hidden">
            <div
              className={`h-full transition-all ${strength.color}`}
              style={{ width: `${percent}%` }}
            />
          </div> */}

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
        <SubmitButton
          type="submit"
          loading={isSubmitting || isLoggingIn}
          disabled={isSubmitting || isLoggingIn}>
          {isSubmitting || isLoggingIn ? 'Signing In...' : 'Sign In'}
          <span className="material-symbols-outlined text-[18px]">
            <LogIn strokeWidth={2.75} />
          </span>
        </SubmitButton>
      </form>
    </>
  );
}

export default LoginForm;
