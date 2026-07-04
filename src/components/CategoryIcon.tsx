import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  iconname: string | undefined | null;
  size?: number;
  color?: string;
}

export default function CategoryIcon({
  iconname,
  size = 20,
  color = 'white',
}: Props) {
  if (!iconname) return <Icons.CircleHelp size={size}  />;
  const Icon = Icons[iconname as keyof typeof Icons] as LucideIcon;

  return Icon ? (
    <Icon size={size}  />
  ) : (
    <Icons.CircleHelp size={size} />
  );
}
