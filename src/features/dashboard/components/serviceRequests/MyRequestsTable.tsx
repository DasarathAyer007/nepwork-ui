import type { ServiceRequestResult } from '@/features/services/types';
import { User, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

import ServiceRequestStatusBadge from './ServiceRequestStatusBadge';

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

type MyRequestsTableProps = {
  requests: ServiceRequestResult[];
  page: number;
  pageSize: number;
};

export default function MyRequestsTable({
  requests,
  page,
  pageSize,
}: MyRequestsTableProps) {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
            <th className="px-4 py-3 w-12">S.N.</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Budget</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Requested On</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr
              key={request.id}
              className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors">
              <td className="px-4 py-3 text-body-md text-on-surface-variant">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/dashboard/my-requests/${request.id}`}
                  className="flex items-center gap-3 min-w-0 group">
                  <div className="size-10 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                    {request.service.thumbnail ? (
                      <img
                        src={request.service.thumbnail}
                        alt={request.service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench size={18} />
                    )}
                  </div>
                  <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {request.service.title}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {request.service.user.profile_picture ? (
                    <img
                      src={request.service.user.profile_picture}
                      alt={request.service.user.username}
                      className="size-5 rounded-full object-cover"
                    />
                  ) : (
                    <User size={14} className="text-outline" />
                  )}
                  {request.service.user.full_name ||
                    request.service.user.username}
                </div>
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap capitalize">
                {PRIORITY_LABELS[request.priority] ?? request.priority}
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {request.budget ? `${request.currency} ${request.budget}` : '—'}
              </td>
              <td className="px-4 py-3">
                <ServiceRequestStatusBadge status={request.status} />
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {new Date(request.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
