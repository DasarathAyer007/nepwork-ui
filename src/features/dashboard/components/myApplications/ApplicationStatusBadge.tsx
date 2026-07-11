import type { ApplicationStatus } from '@/features/jobs/jobTypes';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: {
    label: 'Applied',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
  shortlisted: {
    label: 'Shortlisted',
    className: 'bg-blue-500/15 text-blue-700',
  },
  under_review: {
    label: 'Under Review',
    className: 'bg-amber-500/15 text-amber-700',
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    className: 'bg-purple-500/15 text-purple-700',
  },
  interviewed: {
    label: 'Interviewed',
    className: 'bg-purple-500/15 text-purple-700',
  },
  offered: { label: 'Offered', className: 'bg-green-500/15 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-error/15 text-error' },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
};

export default function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
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
