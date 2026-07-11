import type { BasicJobCategory } from '@/features/jobs/jobTypes';
import { Search } from 'lucide-react';

import { DropDown, Input } from '@/components/ui/forms';

import type { MyJobsFilters as MyJobsFiltersType } from '../../myJobsTypes';

const JOB_TYPE_OPTIONS = [
  { value: '', label: 'All Job Types' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

const WORK_MODE_OPTIONS = [
  { value: '', label: 'All Work Modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
];

type MyJobsFiltersProps = {
  filters: MyJobsFiltersType;
  categories: BasicJobCategory[];
  onChange: (filters: MyJobsFiltersType) => void;
  onReset: () => void;
};

export default function MyJobsFilters({
  filters,
  categories,
  onChange,
  onReset,
}: MyJobsFiltersProps) {
  const handleChange = <K extends keyof MyJobsFiltersType>(
    key: K,
    value: MyJobsFiltersType[K]
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
            placeholder="Search by job title..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-9"
          />
        </div>

        <DropDown
          options={JOB_TYPE_OPTIONS}
          value={filters.jobType}
          onChange={(e) =>
            handleChange(
              'jobType',
              e.target.value as MyJobsFiltersType['jobType']
            )
          }
        />

        <DropDown
          options={WORK_MODE_OPTIONS}
          value={filters.workMode}
          onChange={(e) =>
            handleChange(
              'workMode',
              e.target.value as MyJobsFiltersType['workMode']
            )
          }
        />

        <DropDown
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) =>
            handleChange(
              'status',
              e.target.value as MyJobsFiltersType['status']
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
