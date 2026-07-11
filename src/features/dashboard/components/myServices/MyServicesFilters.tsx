import type { Category } from '@/features/services/types';
import { Search } from 'lucide-react';

import { DropDown, Input } from '@/components/ui/forms';

import type { MyServicesFilters as MyServicesFiltersType } from '../../myServicesTypes';

const PRICE_TYPE_OPTIONS = [
  { value: '', label: 'All Pricing' },
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
];

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'All Availability' },
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'break', label: 'On Break' },
  { value: 'holiday', label: 'Holiday' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
];

type MyServicesFiltersProps = {
  filters: MyServicesFiltersType;
  categories: Category[];
  onChange: (filters: MyServicesFiltersType) => void;
  onReset: () => void;
};

export default function MyServicesFilters({
  filters,
  categories,
  onChange,
  onReset,
}: MyServicesFiltersProps) {
  const handleChange = <K extends keyof MyServicesFiltersType>(
    key: K,
    value: MyServicesFiltersType[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="text"
            placeholder="Search by service title..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-9"
          />
        </div>

        <DropDown
          options={PRICE_TYPE_OPTIONS}
          value={filters.priceType}
          onChange={(e) =>
            handleChange(
              'priceType',
              e.target.value as MyServicesFiltersType['priceType']
            )
          }
        />

        <DropDown
          options={AVAILABILITY_OPTIONS}
          value={filters.availabilityStatus}
          onChange={(e) =>
            handleChange(
              'availabilityStatus',
              e.target.value as MyServicesFiltersType['availabilityStatus']
            )
          }
        />

        <DropDown
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) =>
            handleChange(
              'status',
              e.target.value as MyServicesFiltersType['status']
            )
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="w-full sm:w-56">
          <DropDown
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
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
