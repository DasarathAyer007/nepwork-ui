import clsx from 'clsx';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  iconname: string | undefined | null;
  size?: number;
  color?: string;
  className?: string;
}

function toPascalCase(name: string) {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export default function CategoryIcon({
  className,
  iconname,
  size = 20,
  color = 'primary',
}: Props) {
  if (!iconname) {
    return (
      <Icons.CircleHelp
        size={size}
        className={clsx(`text-${color}`, className)}
      />
    );
  }

  const Icon = Icons[
    toPascalCase(iconname) as keyof typeof Icons
  ] as LucideIcon;
  const style = color ? { color } : undefined;

  return Icon ? (
    <span className={` text-${color}`}>
      <Icon
        size={size}
        className={clsx(`text-${color}`, className)}
        style={style}
      />
    </span>
  ) : (
    <Icons.CircleHelp
      size={size}
      className={clsx(`text-${color}`, className)}
    />
  );
}
