import React from 'react';

import clsx from 'clsx';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  error?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const defaultId = React.useId();
    const checkboxId = id || defaultId;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-sm">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            className={clsx(
              'w-4 h-4 rounded border-outline-variant text-primary focus-ring cursor-pointer bg-surface-container-low transition-all accent-primary',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm text-on-surface-variant cursor-pointer select-none font-medium">
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
