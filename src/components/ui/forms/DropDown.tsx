import type { SelectHTMLAttributes } from 'react';

import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

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
    <div className="relative w-full">
      <select
        className={clsx(
          'w-full rounded-md text-text outline-none transition cursor-pointer appearance-none pr-10',

          variant === 'default' && [
            'bg-surface-container border border-border px-md py-base focus-ring',
          ],

          variant === 'filled' && [
            'bg-surface-container border border-transparent px-md py-base focus-ring',
          ],

          variant === 'ghost' && [
            'bg-transparent border border-transparent hover:bg-surface-container-low focus-ring',
          ],

          error && ['border-error', 'focus:ring-error/20', 'focus:border-error'],

          className
        )}
        {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
