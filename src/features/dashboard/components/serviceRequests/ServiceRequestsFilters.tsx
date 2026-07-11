import { DropDown } from '@/components/ui/forms';

import type { ServiceRequestsFilters as ServiceRequestsFiltersType } from '../../myServiceRequestsTypes';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

type ServiceRequestsFiltersProps = {
  filters: ServiceRequestsFiltersType;
  onChange: (filters: ServiceRequestsFiltersType) => void;
  onReset: () => void;
};

export default function ServiceRequestsFilters({
  filters,
  onChange,
  onReset,
}: ServiceRequestsFiltersProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-64">
          <DropDown
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as ServiceRequestsFiltersType['status'],
              })
            }
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-body-md font-medium text-primary hover:underline">
          Clear All
        </button>
      </div>
    </div>
  );
}
