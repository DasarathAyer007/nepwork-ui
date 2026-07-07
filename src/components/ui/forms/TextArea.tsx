import type { TextareaHTMLAttributes } from 'react';

import clsx from 'clsx';

type TextAreaVariant = 'default' | 'filled' | 'ghost';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  variant?: TextAreaVariant;
};

export function TextArea({
  className,
  variant = 'default',
  error,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg px-4 py-2.5 text-sm text-on-surface outline-none transition resize-none duration-150 ease-in-out',
        variant === 'default' &&
          'bg-surface-container-low border border-outline-variant focus-ring placeholder:text-outline-variant/60',
        variant === 'filled' &&
          'bg-surface-container-low border border-transparent focus-ring placeholder:text-outline-variant/60',
        variant === 'ghost' &&
          'bg-transparent border border-transparent hover:bg-surface-container-low focus-ring px-4 py-2.5 placeholder:text-outline-variant/60',
        error && 'border-error focus:ring-error/20 focus:border-error',
        className
      )}
      {...props}
    />
  );
}
