import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
};

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <Card
      variant="flat"
      className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon size={26} />
      </div>
      <h3 className="text-title-md font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1.5 text-body-md text-on-surface-variant ">
          {description}
        </p>
      )}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95">
          {actionLabel}
        </Link>
      )}
    </Card>
  );
}
