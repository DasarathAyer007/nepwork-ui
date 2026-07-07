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
        'py-2.5 px-6 rounded-lg font-semibold text-sm shadow-sm transition-all duration-150 ease-in-out flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]',
        !className?.includes('w-') && 'w-full',

        variant === 'primary' &&
          'bg-primary text-on-primary hover:brightness-110 disabled:bg-primary/50',

        variant === 'secondary' &&
          'bg-secondary text-on-secondary hover:brightness-110 disabled:bg-secondary/50',

        (disabled || loading) && 'cursor-not-allowed opacity-60',

        className
      )}
      {...props}>
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}
