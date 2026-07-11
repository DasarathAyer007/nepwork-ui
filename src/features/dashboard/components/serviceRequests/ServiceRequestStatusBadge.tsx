import type { ServiceRequestStatus } from '@/features/services/types';

const STATUS_CONFIG: Record<
  ServiceRequestStatus,
  { label: string; className: string }
> = {
  open: {
    label: 'Open',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-amber-500/15 text-amber-700',
  },
  accepted: { label: 'Accepted', className: 'bg-blue-500/15 text-blue-700' },
  rejected: { label: 'Rejected', className: 'bg-error/15 text-error' },
  in_progress: {
    label: 'In Progress',
    className: 'bg-purple-500/15 text-purple-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-500/15 text-green-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
};

export default function ServiceRequestStatusBadge({
  status,
}: {
  status: ServiceRequestStatus;
}) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-surface-container-high text-on-surface-variant',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-md font-semibold whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  );
}
