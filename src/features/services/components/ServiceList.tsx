import type { ServiceResult } from '../types';
import Pagination from './Pagination';
import ServiceCard from './ServiceCard';

interface ServiceListProps {
  services: ServiceResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function ServiceList({
  services,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: ServiceListProps) {
  function handleSaveToggle(serviceId: string) {
    // Implement the logic to toggle save status for the service with the given serviceId
    console.log(`Toggling save for service ID: ${serviceId}`);
  }
  return (
    <div className="flex-grow flex flex-col gap-4">
      {/* <div className="flex justify-between items-center mb-2">
        <p className="text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{totalCount}</span> services
        </p>
      </div> */}

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
