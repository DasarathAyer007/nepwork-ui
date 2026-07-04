// ServiceFilter.tsx
import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import type { Category, Filters } from '../types';

interface ServiceFilterProps {
  categories: Category[];
  filters: Filters;
  onChange: (newFilters: Filters) => void;
  onReset: () => void;
  mapview: boolean;
}

// Placeholder skills – replace with API (e.g., useGetSkillsQuery)
const SKILLS_LIST = [
  { id: '1', name: 'Plumbing' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'UI/UX Design' },
  { id: '4', name: 'Web Development' },
];

const PRICE_TYPES = ['Any', 'Fixed', 'Hourly'];
const AVAILABILITY_STATUSES = ['Any', 'Available', 'Busy', 'Unavailable'];

const VISIBLE_LIMIT = 2;

type FilterValue = string | boolean | string[] | null;

export default function ServiceFilter({
  categories,
  filters,
  onChange,
  onReset,
  mapview,
}: ServiceFilterProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleChange = (key: keyof Filters, value: FilterValue) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    const updated = filters.category.includes(categoryId)
      ? filters.category.filter((id) => id !== categoryId)
      : [...filters.category, categoryId];
    handleChange('category', updated);
  };

  const toggleSkill = (skillId: string) => {
    const updated = filters.skills.includes(skillId)
      ? filters.skills.filter((id) => id !== skillId)
      : [...filters.skills, skillId];
    handleChange('skills', updated);
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, VISIBLE_LIMIT);
  const visibleSkills = showAllSkills
    ? SKILLS_LIST
    : SKILLS_LIST.slice(0, VISIBLE_LIMIT);

  return (
    <aside
      className={`bg-surface-container-lowest  rounded-lg p-6 space-y-6 
    
    ${mapview ? 'bg-surface-container-lowest/60 border-outline-variant/30 backdrop-blur-sm ' : 'bg-surface-container-lowest border-outline-variant'}
    `}>
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm font-bold text-on-surface">Filters</h2>
        <button
          className="text-body-md font-medium text-primary hover:underline"
          onClick={onReset}>
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Category</h3>
        <div className="space-y-2">
          {visibleCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category.includes(cat.id)}
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Skills */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Skills</h3>
        <div className="space-y-2">
          {visibleSkills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.skills.includes(skill.id)}
                onChange={() => toggleSkill(skill.id)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {skill.name}
              </span>
            </label>
          ))}
        </div>
        {SKILLS_LIST.length > VISIBLE_LIMIT && (
          <button
            type="button"
            onClick={() => setShowAllSkills((prev) => !prev)}
            className="flex items-center gap-1 text-body-md font-medium text-primary hover:underline">
            {showAllSkills
              ? 'Show less'
              : `Show more (${SKILLS_LIST.length - VISIBLE_LIMIT})`}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAllSkills ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      <hr className="border-outline-variant/50" />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => handleChange('priceMin', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => handleChange('priceMax', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      <hr className="border-outline-variant/50" />

      {/* Price Type */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Price Type</h3>
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Availability Status */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">
          Availability Status
        </h3>
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
      </div>

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

      {/* Promo card */}
      <div className="relative overflow-hidden rounded-lg h-48 bg-primary p-6 text-on-primary">
        <div className="relative z-10">
          <h4 className="font-bold text-headline-sm mb-2">Hire Instantly</h4>
          <p className="text-body-md opacity-90 mb-4">
            Get professional help at your doorstep in minutes.
          </p>
          <button className="bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-bold text-label-md hover:brightness-110">
            LEARN MORE
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-30"></div>
      </div>
    </aside>
  );
}
