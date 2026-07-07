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
        'w-full rounded-md p-3 text-text outline-none transition resize-none',
        variant === 'default' &&
          'bg-surface-container border border-border focus-ring',
        variant === 'filled' &&
          'bg-surface-container border border-transparent focus-ring',
        variant === 'ghost' &&
          'bg-transparent border border-transparent hover:bg-surface-container-low focus-ring',
        error && 'border-error focus:ring-error/20 focus:border-error',
        className
      )}
      {...props}
    />
  );
}
