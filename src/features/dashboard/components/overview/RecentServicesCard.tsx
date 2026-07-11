import ServiceStatusBadge from '@/features/dashboard/components/myServices/ServiceStatusBadge';
import { useGetMyServicesQuery } from '@/features/services/serviceApi';
import { Star, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

import PreviewCard from './PreviewCard';

export default function RecentServicesCard() {
  const { data } = useGetMyServicesQuery({
    page_size: 3,
    ordering: '-created_at',
  });
  const services = data?.results ?? [];

  return (
    <PreviewCard
      title="Recent Services"
      viewAllTo="/dashboard/services"
      isEmpty={services.length === 0}
      emptyMessage="You haven't posted any services yet.">
      <ul className="divide-y divide-outline-variant/40">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              to={`/dashboard/services/${service.id}`}
              className="flex items-center gap-3 py-2.5 group">
              <div className="size-9 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                {service.thumbnail ? (
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Wrench size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                  {service.title}
                </p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-label-md text-on-surface-variant">
                    {(service.avg_rating ?? 0).toFixed(1)}
                  </span>
                </div>
              </div>
              <ServiceStatusBadge status={service.status} />
              <span className="text-body-sm text-on-surface-variant shrink-0 w-20 text-right">
                {service.total_applies} req
                {service.total_applies === 1 ? '' : 's'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PreviewCard>
  );
}
