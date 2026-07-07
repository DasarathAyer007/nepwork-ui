import type { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function SubmitButton({
  className,
  children,
  loading = false,
  variant = 'primary',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={clsx(
        'py-3 px-lg rounded-md font-bold text-base shadow-ambient transition-all flex items-center justify-center gap-sm cursor-pointer active:scale-98',
        !className?.includes('w-') && 'w-full',

        variant === 'primary' &&
          'bg-primary text-on-primary hover:opacity-95 disabled:bg-primary/50',

        variant === 'secondary' &&
          'bg-secondary text-on-secondary hover:opacity-95 disabled:bg-secondary/50',

        (disabled || loading) && 'cursor-not-allowed opacity-50',

        className
      )}
      {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
}
