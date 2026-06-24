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
          'border-gray-300 focus:ring-2 focus:ring-blue-500',
        variant === 'auth' &&
          'w-full pl-12 pr-3 py-3  bg-surface border border-outline-variant rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40',
        variant === 'profile' &&
          'w-full bg-surface-container border border-outline-variant px-md py-base  rounded-md focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/40',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  );
}
