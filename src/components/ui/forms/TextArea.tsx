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
        'w-full rounded-md p-3 text-on-surface outline-none transition resize-none',
        variant === 'default' &&
          'bg-surface-container border border-outline-variant input-focus text-on-surface',

        error && ['border border-error', 'focus:ring-error'],
        className
      )}
      {...props}
    />
  );
}
