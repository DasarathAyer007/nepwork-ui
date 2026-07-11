import JobStatusBadge from '@/features/dashboard/components/myJobs/JobStatusBadge';
import { useGetMyJobsQuery } from '@/features/jobs/jobApi';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

export default function RecentJobsCard() {
  const { data } = useGetMyJobsQuery({
    page_size: 3,
    ordering: '-created_at',
  });
  const jobs = data?.results ?? [];

  return (
    <PreviewCard
      title="Recent Jobs"
      viewAllTo="/dashboard/jobs"
      isEmpty={jobs.length === 0}
      emptyMessage="You haven't posted any jobs yet.">
      <ul className="divide-y divide-outline-variant/40">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              to={`/dashboard/jobs/${job.id}`}
              className="flex items-center gap-3 py-2.5 group">
              <div className="size-9 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                {job.thumbnail ? (
                  <img
                    src={job.thumbnail}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase size={16} />
                )}
              </div>
              <span className="flex-1 min-w-0 text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                {job.title}
              </span>
              <JobStatusBadge status={job.status} />
              <span className="text-body-sm text-on-surface-variant shrink-0 w-16 text-right">
                {job.total_applications} app
                {job.total_applications === 1 ? '' : 's'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
