import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

type DashboardPageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  actionIcon?: LucideIcon;
};

export default function DashboardPageHeader({
  title,
  description,
  actionLabel,
  actionTo,
  actionIcon: ActionIcon = Plus,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">{title}</h1>
        {description && (
          <p className="mt-1 text-body-md text-on-surface-variant max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95">
          <ActionIcon size={18} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
