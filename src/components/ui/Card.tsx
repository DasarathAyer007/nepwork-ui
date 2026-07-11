import React from 'react';

import clsx from 'clsx';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'flat' | 'elevated' | 'interactive';
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl border border-border bg-card transition-all duration-300',
          variant === 'default' && 'shadow-sm',
          variant === 'elevated' && 'shadow-md bg-surface-container-lowest',
          variant === 'flat' && 'shadow-none border-border/50',
          variant === 'interactive' &&
            'shadow-sm hover:shadow-md hover:border-primary/30 cursor-pointer',
          className
        )}
        {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
