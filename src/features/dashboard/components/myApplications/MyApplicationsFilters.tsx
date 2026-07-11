import { DropDown } from '@/components/ui/forms';

import type { MyApplicationsFilters as MyApplicationsFiltersType } from '../../myApplicationsTypes';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

type MyApplicationsFiltersProps = {
  filters: MyApplicationsFiltersType;
  onChange: (filters: MyApplicationsFiltersType) => void;
  onReset: () => void;
};

export default function MyApplicationsFilters({
  filters,
  onChange,
  onReset,
}: MyApplicationsFiltersProps) {
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
                status: e.target.value as MyApplicationsFiltersType['status'],
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
