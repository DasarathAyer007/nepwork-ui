import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import SkillFilterInput from '@/components/SkillFilterInput';

import type { Category, Filters } from '../types';

interface ServiceFilterProps {
  categories: Category[];
  filters: Filters;
  onChange: (newFilters: Filters) => void;
  onReset: () => void;
  mapview: boolean;
}

// Matches backend `Service.PriceType`
const PRICE_TYPES = ['Any', 'Fixed', 'Hourly'];
// Matches backend `Service.AvailabilityStatus`
const AVAILABILITY_STATUSES = [
  'Any',
  'Available',
  'Unavailable',
  'Break',
  'Holiday',
];

const VISIBLE_LIMIT = 5;

const inputClass =
  'w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none';

type FilterValue = string | boolean | string[] | null;

function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.category) count++;
  count += filters.skills.length;
  if (filters.priceMin) count++;
  if (filters.priceMax) count++;
  if (filters.priceType) count++;
  if (filters.availabilityStatus) count++;
  if (filters.availableNow) count++;
  if (filters.hasLocation !== null) count++;
  if (filters.radiusMin) count++;
  if (filters.radiusMax) count++;
  if (filters.availableFrom) count++;
  if (filters.availableTo) count++;
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

export default function ServiceFilter({
  categories,
  filters,
  onChange,
  onReset,
  mapview,
}: ServiceFilterProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleChange = (key: keyof Filters, value: FilterValue) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    handleChange('category', filters.category === categoryId ? '' : categoryId);
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, VISIBLE_LIMIT);

  const activeCount = countActiveFilters(filters);

  return (
    <aside
      className={`bg-surface-container-lowest  rounded-lg p-6 space-y-6
    ${mapview ? 'bg-surface-container-lowest/60 border-outline-variant/30 backdrop-blur-sm ' : 'bg-surface-container-lowest  border border-outline-variant '}
    `}>
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

      {/* Skills */}
      <FilterSection title="Skills">
        <SkillFilterInput
          value={filters.skills}
          onChange={(skills) => handleChange('skills', skills)}
          selectBy="id"
          placeholder="Search skills, e.g. Plumbing"
          skillType="service"
        />
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => handleChange('priceMin', e.target.value)}
            className={inputClass}
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => handleChange('priceMax', e.target.value)}
            className={inputClass}
          />
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Price Type */}
      <FilterSection title="Price Type">
        <div className="space-y-2">
          {PRICE_TYPES.map((type) => {
            const value = type === 'Any' ? '' : type.toLowerCase();
            return (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  value={value}
                  checked={filters.priceType === value}
                  onChange={(e) => handleChange('priceType', e.target.value)}
                  className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
                />
                <span className="text-body-md text-on-surface-variant">
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Availability Status */}
      <FilterSection title="Availability Status">
        <div className="space-y-2">
          {AVAILABILITY_STATUSES.map((status) => {
            const value = status === 'Any' ? '' : status.toLowerCase();
            return (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availabilityStatus"
                  value={value}
                  checked={filters.availabilityStatus === value}
                  onChange={(e) =>
                    handleChange('availabilityStatus', e.target.value)
                  }
                  className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
                />
                <span className="text-body-md text-on-surface-variant">
                  {status}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Service Radius (km) */}
      <FilterSection title="Service Radius (km)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.radiusMin}
            onChange={(e) => handleChange('radiusMin', e.target.value)}
            className={inputClass}
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.radiusMax}
            onChange={(e) => handleChange('radiusMax', e.target.value)}
            className={inputClass}
          />
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Available Time Window */}
      <FilterSection title="Available Time Window">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-body-sm text-on-surface-variant">From</label>
            <input
              type="time"
              value={filters.availableFrom}
              onChange={(e) => handleChange('availableFrom', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="text-body-sm text-on-surface-variant">To</label>
            <input
              type="time"
              value={filters.availableTo}
              onChange={(e) => handleChange('availableTo', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </FilterSection>

      <hr className="border-outline-variant/50" />

      {/* Toggles */}
      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-body-md text-on-surface">Available Now</span>
          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filters.availableNow}
              onChange={(e) => handleChange('availableNow', e.target.checked)}
            />
            <span className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </span>
        </label>

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
