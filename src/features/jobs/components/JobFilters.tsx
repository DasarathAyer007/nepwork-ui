import { ChevronDown, MapPin } from 'lucide-react';

interface JobFiltersProps {
  selectedJobTypes: string[];
  setSelectedJobTypes: (types: string[]) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedExperience: string;
  setSelectedExperience: (experience: string) => void;
  salaryRange: number;
  setSalaryRange: (range: number) => void;
}

function JobFilters({
  selectedJobTypes,
  setSelectedJobTypes,
  selectedLocation,
  setSelectedLocation,
  selectedExperience,
  setSelectedExperience,
  salaryRange,
  setSalaryRange,
}: JobFiltersProps) {
  const toggleJobType = (type: string) => {
    setSelectedJobTypes(
      selectedJobTypes.includes(type)
        ? selectedJobTypes.filter((t) => t !== type)
        : [...selectedJobTypes, type]
    );
  };

  const clearAll = () => {
    setSelectedJobTypes([]);
    setSelectedLocation('');
    setSelectedExperience('');
    setSalaryRange(10000);
  };

  return (
    <aside className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm font-bold text-on-surface">Filters</h2>
        <button
          className="text-body-md font-medium text-primary hover:underline"
          onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* Job Type */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Job Type</h3>
        <div className="space-y-2">
          {['Full-time', 'Contract', 'Freelance', 'Part-time'].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedJobTypes.includes(type)}
                onChange={() => toggleJobType(type)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant/50" />

      {/* Location */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">Location</h3>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <select
            className="w-full pl-10 pr-8 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">All Locations</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Lalitpur</option>
            <option>Biratnagar</option>
            <option>Remote</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
        </div>
      </div>

      <hr className="border-outline-variant/50" />

      {/* Experience Level */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">
          Experience Level
        </h3>
        <div className="space-y-2">
          {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="experience"
                value={level}
                checked={selectedExperience === level}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-4 h-4 border-outline-variant text-primary focus:ring-primary/20"
              />
              <span className="text-body-md text-on-surface-variant">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant/50" />

      {/* Salary Range */}
      <div className="space-y-3">
        <h3 className="text-body-lg font-bold text-on-surface">
          Salary Range (Monthly)
        </h3>
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={salaryRange}
            onChange={(e) => setSalaryRange(Number(e.target.value))}
            className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Rs. 10k</span>
            <span>Rs. {salaryRange.toLocaleString()}+</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default JobFilters;
