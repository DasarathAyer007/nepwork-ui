// import { ChevronDown, MapPin } from 'lucide-react';
// interface JobFiltersProps {
//   selectedJobTypes: string[];
//   setSelectedJobTypes: (types: string[]) => void;
//   selectedLocation: string;
//   setSelectedLocation: (location: string) => void;
//   selectedExperience: string;
//   setSelectedExperience: (experience: string) => void;
//   salaryRange: number;
//   setSalaryRange: (range: number) => void;
// }
// function JobFilters({
//   selectedJobTypes,
//   setSelectedJobTypes,
//   selectedLocation,
//   setSelectedLocation,
//   selectedExperience,
//   setSelectedExperience,
//   salaryRange,
//   setSalaryRange,
// }: JobFiltersProps) {
//   const toggleJobType = (type: string) => {
//     setSelectedJobTypes(
//       selectedJobTypes.includes(type)
//         ? selectedJobTypes.filter((t) => t !== type)
//         : [...selectedJobTypes, type]
//     );
//   };
//   const clearAll = () => {
//     setSelectedJobTypes([]);
//     setSelectedLocation('');
//     setSelectedExperience('');
//     setSalaryRange(10000);
//   };
//   return (
//     <aside className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-headline-sm font-bold text-on-surface">Filters</h2>
//         <button
//           className="text-body-md font-medium text-primary hover:underline"
//           onClick={clearAll}>
//           Clear All
//         </button>
//       </div>
//       {/* Job Type */}
//       <div className="space-y-3">
//         <h3 className="text-body-lg font-bold text-on-surface">Job Type</h3>
//         <div className="space-y-2">
//           {['Full-time', 'Contract', 'Freelance', 'Part-time'].map((type) => (
//             <label
//               key={type}
//               className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedJobTypes.includes(type)}
//                 onChange={() => toggleJobType(type)}
//                 className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
//               />
//               <span className="text-body-md text-on-surface-variant">
//                 {type}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//       <hr className="border-outline-variant/50" />
//       {/* Location */}
//       <div className="space-y-3">
//         <h3 className="text-body-lg font-bold text-on-surface">Location</h3>
//         <div className="relative">
//           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
//           <select
//             className="w-full pl-10 pr-8 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
//             value={selectedLocation}
//             onChange={(e) => setSelectedLocation(e.target.value)}>
//             <option value="">All Locations</option>
//             <option>Kathmandu</option>
//             <option>Pokhara</option>
//             <option>Lalitpur</option>
//             <option>Biratnagar</option>
//             <option>Remote</option>
//           </select>
//           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
//         </div>
//       </div>
//       <hr className="border-outline-variant/50" />
//       {/* Experience Level */}
//       <div className="space-y-3">
//         <h3 className="text-body-lg font-bold text-on-surface">
//           Experience Level
//         </h3>
//         <div className="space-y-2">
//           {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
//             <label
//               key={level}
//               className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="radio"
//                 name="experience"
//                 value={level}
//                 checked={selectedExperience === level}
//                 onChange={(e) => setSelectedExperience(e.target.value)}
//                 className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
//               />
//               <span className="text-body-md text-on-surface-variant">
//                 {level}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//       <hr className="border-outline-variant/50" />
//       {/* Salary Range */}
//       <div className="space-y-3">
//         <h3 className="text-body-lg font-bold text-on-surface">
//           Salary Range (Monthly)
//         </h3>
//         <div className="space-y-1">
//           <input
//             type="range"
//             min="0"
//             max="200000"
//             step="5000"
//             value={salaryRange}
//             onChange={(e) => setSalaryRange(Number(e.target.value))}
//             className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
//           />
//           <div className="flex justify-between text-body-md text-on-surface-variant">
//             <span>Rs. 10k</span>
//             <span>Rs. {salaryRange.toLocaleString()}+</span>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }
// export default JobFilters;
import { useMemo, useState } from 'react';

import { ChevronDown, MapPin } from 'lucide-react';

import type { BasicJobCategory, JobFilters } from '../jobTypes';

interface JobFiltersProps {
  categories: BasicJobCategory[];
  filters: JobFilters;
  onChange: (newFilters: JobFilters) => void;
  onReset: () => void;
  mapview?: boolean;
}

// Job types matching backend
const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
];

// Work modes matching backend
const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

// Experience levels matching backend
const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
];

// Placeholder skills – replace with API
const SKILLS_LIST = [
  { id: '1', name: 'React' },
  { id: '2', name: 'Python' },
  { id: '3', name: 'JavaScript' },
  { id: '4', name: 'UI/UX Design' },
  { id: '5', name: 'Project Management' },
  { id: '6', name: 'Data Analysis' },
];

const VISIBLE_LIMIT = 2;

export default function JobFilters({
  categories,
  filters,
  onChange,
  onReset,
  mapview = false,
}: JobFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryId: string) => {
    handleChange('category', filters.category === categoryId ? '' : categoryId);
  };

  const toggleSkill = (skillId: string) => {
    const updated = filters.skills.includes(skillId)
      ? filters.skills.filter((id) => id !== skillId)
      : [...filters.skills, skillId];
    handleChange('skills', updated);
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
  const visibleSkills = showAllSkills
    ? SKILLS_LIST
    : SKILLS_LIST.slice(0, VISIBLE_LIMIT);

  return (
    <aside
      className={`bg-surface-container-lowest rounded-lg p-6 space-y-6 
      ${
        mapview
          ? 'bg-surface-container-lowest/60 border-outline-variant/30 backdrop-blur-sm'
          : 'border border-outline-variant'
      }`}>
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Job Type */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Job Type</h3>
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Work Mode */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Work Mode</h3>
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Experience Level */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">
          Experience Level
        </h3>
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
      </div>

      <hr className="border-outline-variant/50" />

      {/* Experience Years */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">
          Experience (Years)
        </h3>
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
            <span>0 years</span>
            <span>{filters.experienceYears || 0}+ years</span>
          </div>
        </div>
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

      {/* Salary Range */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Salary Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <span className="text-on-surface-variant">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Currency (e.g. NPR, USD)"
            value={filters.currency || ''}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      <hr className="border-outline-variant/50" />

      {/* Location Filters */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Location</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="City"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="State"
            value={filters.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="Country"
            value={filters.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={filters.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

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
                handleChange('hasLocation', e.target.checked ? 'true' : null)
              }
            />
            <span className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </span>
        </label>
      </div>
    </aside>
  );
}
