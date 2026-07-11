import type { JobApplicationResult } from '@/features/jobs/jobTypes';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import ApplicationStatusBadge from './ApplicationStatusBadge';

type MyApplicationsTableProps = {
  applications: JobApplicationResult[];
  page: number;
  pageSize: number;
};

export default function MyApplicationsTable({
  applications,
  page,
  pageSize,
}: MyApplicationsTableProps) {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
            <th className="px-4 py-3 w-12">S.N.</th>
            <th className="px-4 py-3">Job</th>
            <th className="px-4 py-3">Applied On</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Expected Salary</th>
            <th className="px-4 py-3">Experience</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <tr
              key={application.id}
              className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors">
              <td className="px-4 py-3 text-body-md text-on-surface-variant">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/dashboard/my-applications/${application.id}`}
                  className="flex items-center gap-3 min-w-0 group">
                  <div className="size-10 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                    {application.job.thumbnail ? (
                      <img
                        src={application.job.thumbnail}
                        alt={application.job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Briefcase size={18} />
                    )}
                  </div>
                  <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {application.job.title}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {new Date(application.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <ApplicationStatusBadge status={application.status} />
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {application.expected_salary ?? '—'}
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {application.years_of_experience != null
                  ? `${application.years_of_experience} yrs`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
