type ServiceStatus = 'draft' | 'active' | 'paused' | 'closed';

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; className: string }
> = {
  active: { label: 'Active', className: 'bg-green-500/15 text-green-700' },
  paused: { label: 'Paused', className: 'bg-amber-500/15 text-amber-700' },
  closed: { label: 'Closed', className: 'bg-error/15 text-error' },
  draft: {
    label: 'Draft',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
};

export default function ServiceStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as ServiceStatus] ?? {
    label: status,
    className: 'bg-surface-container-high text-on-surface-variant',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-md font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
