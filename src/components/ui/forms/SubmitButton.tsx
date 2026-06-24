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
        'w-full py-3 px-lg rounded-md font-bold text-base shadow-ambient transition-all flex items-center justify-center gap-sm cursor-pointer active:scale-[0.99]',

        variant === 'primary' &&
          'bg-primary text-on-primary hover:bg-primary-dim disabled:bg-primary/50',

        variant === 'secondary' &&
          'bg-secondary text-on-secondary hover:bg-secondary-dim',

        (disabled || loading) && 'cursor-not-allowed',

        className
      )}
      {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
}
