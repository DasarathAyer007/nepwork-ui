import Pagination from '../../../components/Pagination';
import type { ServiceResult } from '../types';
import ServiceCard from './ServiceCard';

const SERVICE_SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  // avg_rating ordering is disabled until the backend annotates it.
  // { value: '-avg_rating', label: 'Highest Rated' },
  // { value: 'avg_rating', label: 'Lowest Rated' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-total_applies', label: 'Most Popular' },
  { value: 'available_from', label: 'Earliest Availability' },
];

interface ServiceListProps {
  services: ServiceResult[];
  totalCount?: number;
  currentPage: number;
  totalPages: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
}

export default function ServiceList({
  services,
  totalCount,
  currentPage,
  totalPages,
  sortBy,
  onSortChange,
  onPageChange,
}: ServiceListProps) {
  const displayCount = totalCount ?? services.length;
  function handleSaveToggle(serviceId: string) {
    // Implement the logic to toggle save status for the service with the given serviceId
    console.log(`Toggling save for service ID: ${serviceId}`);
  }
  return (
    <div className="grow flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-on-surface-variant">
          Showing{' '}
          <span className="font-bold text-on-surface">{displayCount}</span>{' '}
          services
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="service-sort-by"
            className="text-body-md text-on-surface-variant">
            Sort by
          </label>
          <select
            id="service-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 border border-outline-variant/50 bg-surface-container-lowest rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer">
            {SERVICE_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          data={service}
          onSaveToggle={handleSaveToggle}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
