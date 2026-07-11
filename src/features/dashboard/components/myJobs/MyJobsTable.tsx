import type { JobResult } from '@/features/jobs/jobTypes';
import { Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import JobStatusBadge from './JobStatusBadge';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const WORK_MODE_LABELS: Record<string, string> = {
  remote: 'Remote',
  onsite: 'On-site',
  hybrid: 'Hybrid',
};

type MyJobsTableProps = {
  jobs: JobResult[];
  page: number;
  pageSize: number;
};

export default function MyJobsTable({
  jobs,
  page,
  pageSize,
}: MyJobsTableProps) {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
            <th className="px-4 py-3 w-12">S.N.</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Job Type</th>
            <th className="px-4 py-3">Work Mode</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Applications</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={job.id}
              className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors">
              <td className="px-4 py-3 text-body-md text-on-surface-variant">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/dashboard/jobs/${job.id}`}
                  className="flex items-center gap-3 min-w-0 group">
                  <div className="size-10 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                    {job.thumbnail ? (
                      <img
                        src={job.thumbnail}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Briefcase size={18} />
                    )}
                  </div>
                  <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
              </td>
              <td className="px-4 py-3">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {job.category?.name ?? '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link
                  to={`/dashboard/jobs/${job.id}/applications`}
                  className="inline-flex items-center gap-1.5 text-body-md font-medium text-on-surface hover:text-primary transition-colors">
                  <Users size={15} className="text-on-surface-variant" />
                  {job.total_applications}
                  <span className="text-label-md font-semibold text-primary underline underline-offset-2">
                    View
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
