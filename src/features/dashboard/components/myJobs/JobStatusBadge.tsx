import type { JobStatus } from '@/features/jobs/jobTypes';

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-green-500/15 text-green-700' },
  paused: { label: 'Paused', className: 'bg-amber-500/15 text-amber-700' },
  closed: { label: 'Closed', className: 'bg-error/15 text-error' },
  draft: {
    label: 'Draft',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
};

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = STATUS_CONFIG[status] ?? {
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
