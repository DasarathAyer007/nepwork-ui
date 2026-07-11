import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import SkillFilterInput from '@/components/SkillFilterInput';

import type { BasicJobCategory, JobFilters } from '../jobTypes';

interface JobFiltersProps {
  categories: BasicJobCategory[];
  filters: JobFilters;
  onChange: (newFilters: JobFilters) => void;
  onReset: () => void;
  mapview?: boolean;
}

// Job types matching backend `Job.JobType`
const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

// Work modes matching backend `Job.WorkMode`
const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Experience levels matching backend `Job.ExperienceLevel`
const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
];

const VISIBLE_LIMIT = 5;

const inputClass =
  'w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none';

function countActiveFilters(filters: JobFilters): number {
  let count = 0;
  if (filters.category) count++;
  if (filters.jobType) count++;
  if (filters.workMode) count++;
  if (filters.experienceLevel) count++;
  if (filters.experienceYears) count++;
  count += filters.skills.length;
  if (filters.salaryMin) count++;
  if (filters.salaryMax) count++;
  if (filters.currency) count++;
  if (filters.city) count++;
  if (filters.state) count++;
  if (filters.country) count++;
  if (filters.postalCode) count++;
  if (filters.hasLocation !== null) count++;
  if (filters.deadlineBefore) count++;
  if (filters.deadlineAfter) count++;
  return count;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-body-lg font-bold text-on-surface">{title}</h3>
      {children}
    </div>
  );
}

export default function JobFilters({
  categories,
  filters,
  onChange,
  onReset,
  mapview = false,
}: JobFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    handleChange('category', filters.category === categoryId ? '' : categoryId);
  };

  const toggleJobType = (type: string) => {
    handleChange('jobType', filters.jobType === type ? '' : type);
  };

  const toggleWorkMode = (mode: string) => {
    handleChange('workMode', filters.workMode === mode ? '' : mode);
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, VISIBLE_LIMIT);

  const activeCount = countActiveFilters(filters);

  return (
    <aside
      className={`bg-surface-container-lowest rounded-lg p-6 space-y-6
      ${
        mapview
          ? 'bg-surface-container-lowest/60 border-outline-variant/30 backdrop-blur-sm'
          : 'border border-outline-variant'
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-headline-sm font-bold text-on-surface">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="bg-primary text-on-primary text-body-sm font-medium rounded-full px-2 py-0.5">
              {activeCount}
            </span>
          )}
        </div>
        <button
          className="text-body-md font-medium text-primary hover:underline disabled:opacity-40 disabled:hover:no-underline"
          disabled={activeCount === 0}
          onClick={onReset}>
          Clear All
        </button>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {visibleCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === cat.id}
                onChange={() => toggleCategory(cat.id)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
        {categories.length > VISIBLE_LIMIT && (
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="flex items-center gap-1 text-body-md font-medium text-primary hover:underline">
            {showAllCategories
              ? 'Show less'
              : `Show more (${categories.length - VISIBLE_LIMIT})`}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAllCategories ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Job Type */}
      <FilterSection title="Job Type">
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.jobType === type.value}
                onChange={() => toggleJobType(type.value)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        <div className="space-y-2">
          {WORK_MODES.map((mode) => (
            <label
              key={mode.value}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.workMode === mode.value}
                onChange={() => toggleWorkMode(mode.value)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {mode.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Experience Level */}
      <FilterSection title="Experience Level">
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="experienceLevel"
                value={level.value}
                checked={filters.experienceLevel === level.value}
                onChange={(e) =>
                  handleChange('experienceLevel', e.target.value)
                }
                className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Experience Years */}
      <FilterSection title="Max Experience (Years)">
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={filters.experienceYears || 0}
            onChange={(e) =>
              handleChange('experienceYears', Number(e.target.value))
            }
            className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Any</span>
            <span>up to {filters.experienceYears || 0} years</span>
          </div>
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Skills */}
      <FilterSection title="Skills">
        <SkillFilterInput
          value={filters.skills}
          onChange={(skills) => handleChange('skills', skills)}
          selectBy="name"
          placeholder="Search skills, e.g. React"
          skillType="job"
        />
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Salary Range */}
      <FilterSection title="Salary Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            className={inputClass}
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Currency (e.g. NPR, USD)"
          value={filters.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          className={inputClass}
        />
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Deadline */}
      <FilterSection title="Application Deadline">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-body-sm text-on-surface-variant">
              After
            </label>
            <input
              type="date"
              value={filters.deadlineAfter}
              onChange={(e) => handleChange('deadlineAfter', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="text-body-sm text-on-surface-variant">
              Before
            </label>
            <input
              type="date"
              value={filters.deadlineBefore}
              onChange={(e) => handleChange('deadlineBefore', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Location Filters */}
      <FilterSection title="Location">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="State"
            value={filters.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Country"
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={filters.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={inputClass}
          />
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Toggle: Has Location */}
      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-body-md text-on-surface">Has Location</span>
          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filters.hasLocation === true}
              onChange={(e) =>
                handleChange('hasLocation', e.target.checked ? true : null)
              }
            />
            <span className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </span>
        </label>
      </div>
    </aside>
  );
}
