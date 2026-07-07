import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  variant?: 'default' | 'auth';
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
        'w-full rounded-lg border px-4 py-2 text-md outline-none transition duration-150 ease-in-out',
        variant === 'default' &&
          'bg-surface-container-low border-outline-variant focus-ring text-on-surface placeholder:text-outline-variant/60',
        variant === 'auth' &&
          'w-full pl-12 pr-3 py-3 bg-surface border border-border rounded-md focus-ring text-text placeholder:text-muted/40',
        error && 'border-error focus:ring-error/20 focus:border-error',
        className
      )}
      {...props}
    />
  );
}
