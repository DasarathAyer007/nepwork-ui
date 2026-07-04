import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";



interface Props {
  iconname: string;
}

export default function CategoryIcon({ iconname }: Props) {
  const Icon = Icons[iconname as keyof typeof Icons] as LucideIcon;

  return Icon ? <Icon size={20} /> : <Icons.CircleHelp size={20} />;
}