import clsx from 'clsx';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({
  className,
  variant = 'default',
  ...props
}: LabelProps) {
  return (
    <label
      className={clsx(
        'block',
        variant === 'default' &&
          'text-sm font-bold uppercase tracking-wider text-secondary',
        className
      )}
      {...props}
    />
  );
}
