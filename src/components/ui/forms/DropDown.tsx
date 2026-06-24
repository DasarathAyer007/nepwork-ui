import type { SelectHTMLAttributes } from 'react';

import clsx from 'clsx';

type Option = {
  label: string;
  value: string;
};

type SelectVariant = 'default' | 'filled' | 'ghost';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  error?: boolean;
  variant?: SelectVariant;
};

export function DropDown({
  options,
  variant = 'default',
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      className={clsx(
        'w-full rounded-md px-3 py-3 text-on-surface outline-none transition cursor-pointer',

        'appearance-none',

        variant === 'default' && [
          'w-full bg-surface-container border border-outline-variant px-md py-base  rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40',
        ],

        variant === 'filled' && [
          'w-full bg-surface-container border border-transparent px-md py-base  rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40',
        ],

        variant === 'ghost' && [
          'bg-transparent',
          'border border-transparent',
          'hover:bg-surface-container-low',
          'focus:ring-2 focus:ring-primary',
        ],

        error && ['border-error', 'focus:ring-error'],

        className
      )}
      {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
