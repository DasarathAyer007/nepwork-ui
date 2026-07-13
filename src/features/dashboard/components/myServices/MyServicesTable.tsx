import type { ServiceResult } from '@/features/services/types';
import { Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

import ServiceStatusBadge from './ServiceStatusBadge';

const PRICE_TYPE_LABELS: Record<string, string> = {
  fixed: 'Fixed Price',
  hourly: 'Hourly Rate',
};

type MyServicesTableProps = {
  services: ServiceResult[];
  page: number;
  pageSize: number;
};

export default function MyServicesTable({
  services,
  page,
  pageSize,
}: MyServicesTableProps) {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-outline-variant text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
            <th className="px-4 py-3 w-12">S.N.</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Pricing</th>
            <th className="px-4 py-3">Availability</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Requests</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr
              key={service.id}
              className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors">
              <td className="px-4 py-3 text-body-md text-on-surface-variant">
                {startIndex + index + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  to={`/dashboard/services/${service.id}`}
                  className="flex items-center gap-3 min-w-0 group">
                  <div className="size-10 rounded-md overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center text-outline">
                    {service.thumbnail ? (
                      <img
                        src={service.thumbnail}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench size={18} />
                    )}
                  </div>
                  <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {service.title}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {service.price
                  ? `${service.currency} ${service.price}${
                      service.price_type === 'hourly' ? '/hr' : ''
                    }`
                  : (PRICE_TYPE_LABELS[service.price_type] ??
                    service.price_type)}
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap capitalize">
                {service.availability_status}
              </td>
              <td className="px-4 py-3">
                <ServiceStatusBadge status={service.status} />
              </td>
              <td className="px-4 py-3 text-body-md text-on-surface-variant whitespace-nowrap">
                {service.category?.name ?? '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link
                  to={`/dashboard/services/${service.id}/requests`}
                  className="inline-flex items-center gap-1.5 text-body-md font-medium text-on-surface hover:text-primary transition-colors">
                  <Users size={15} className="text-on-surface-variant" />
                  {service.total_applies}
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
