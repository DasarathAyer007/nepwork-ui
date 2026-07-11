import { formatRelativeTime } from '@/features/dashboard/utils/overviewHelpers';
import { useGetServiceRequestsQuery } from '@/features/services/serviceApi';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

export default function ServiceRequestsPreviewCard() {
  const { data } = useGetServiceRequestsQuery({
    scope: 'received',
    status: 'open',
    page_size: 3,
    ordering: '-created_at',
  });
  const requests = data?.results ?? [];

  return (
    <PreviewCard
      title="Service Requests"
      viewAllTo="/dashboard/requests-received"
      isEmpty={requests.length === 0}
      emptyMessage="No pending service requests.">
      <ul className="divide-y divide-outline-variant/40">
        {requests.map((request) => (
          <li key={request.id}>
            <Link
              to={`/dashboard/requests-received/${request.id}`}
              className="flex items-center gap-3 py-2.5 group">
              <div className="size-9 rounded-full overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                {request.user.profile_picture ? (
                  <img
                    src={request.user.profile_picture}
                    alt={request.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                  {request.user.full_name || request.user.username}
                </p>
                <p className="text-label-md text-on-surface-variant truncate">
                  {request.service.title}
                </p>
              </div>
              <span className="text-label-md text-on-surface-variant/70 shrink-0">
                {formatRelativeTime(request.created_at)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
