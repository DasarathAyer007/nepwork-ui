import ApplicationStatusBadge from '@/features/dashboard/components/myApplications/ApplicationStatusBadge';
import { useGetJobApplicationsQuery } from '@/features/jobs/jobApi';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

export default function RecentApplicationsCard() {
  const { data } = useGetJobApplicationsQuery({
    scope: 'applied',
    page_size: 3,
    ordering: '-created_at',
  });
  const applications = data?.results ?? [];

  return (
    <PreviewCard
      title="Recent Applications"
      viewAllTo="/dashboard/my-applications"
      isEmpty={applications.length === 0}
      emptyMessage="You haven't applied to any jobs yet.">
      <ul className="divide-y divide-outline-variant/40">
        {applications.map((application) => (
          <li key={application.id}>
            <Link
              to={`/dashboard/my-applications/${application.id}`}
              className="flex items-center gap-3 py-2.5 group">
              <div className="size-9 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                {application.job.thumbnail ? (
                  <img
                    src={application.job.thumbnail}
                    alt={application.job.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                  {application.job.title}
                </p>
                {application.job.posted_by_name && (
                  <p className="text-label-md text-on-surface-variant truncate">
                    {application.job.posted_by_name}
                  </p>
                )}
              </div>
              <ApplicationStatusBadge status={application.status} />
            </Link>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
