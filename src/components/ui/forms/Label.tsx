import clsx from 'clsx';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        'block text-xs font-bold uppercase tracking-wider text-secondary',
        className
      )}
      {...props}
    />
  );
}
