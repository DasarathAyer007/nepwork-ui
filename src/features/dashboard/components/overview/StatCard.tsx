import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subLabel?: string;
  to?: string;
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  to,
}: StatCardProps) {
  const content = (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-start gap-3 h-full transition-all hover:border-primary/30 hover:shadow-sm">
      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-headline-sm font-bold text-on-surface leading-tight">
          {value}
        </p>
        <p className="text-body-sm text-on-surface-variant truncate">{label}</p>
        {subLabel && (
          <p className="text-label-md text-primary font-medium mt-0.5">
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
