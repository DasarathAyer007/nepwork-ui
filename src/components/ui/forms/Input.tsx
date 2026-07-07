import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  variant?: 'default' | 'auth' | 'profile';
};

export function Input({
  error,
  variant = 'default',
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-md border px-3 py-2 outline-none transition',
        variant === 'default' &&
          'border-border focus-ring',
        variant === 'auth' &&
          'w-full pl-12 pr-3 py-3 bg-surface border border-border rounded-md focus-ring text-text placeholder:text-muted/40',
        variant === 'profile' &&
          'w-full bg-surface-container border border-border px-md py-base rounded-md focus-ring text-text placeholder:text-muted/40',
        error && 'border-error focus:ring-error/20 focus:border-error',
        className
      )}
      {...props}
    />
  );
}
