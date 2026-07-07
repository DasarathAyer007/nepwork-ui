import { useEffect, useState } from 'react';

import { List, Map, Search } from 'lucide-react';

interface JobSearchBarProps {
  searchTerm: string;
  viewMode: 'map' | 'list';
  setSearchTerm: (value: string) => void;
  onSearch: (value: string) => void;
  onViewModeChange: (mode: 'map' | 'list') => void;
}

export default function JobSearchBar({
  searchTerm,
  viewMode,
  setSearchTerm,
  onSearch,
  onViewModeChange,
}: JobSearchBarProps) {
  const [localTerm, setLocalTerm] = useState(searchTerm);

  const handleSearch = () => onSearch(localTerm);

  useEffect(() => {
    setSearchTerm(localTerm);
  }, [localTerm, setSearchTerm]);

  const isMapView = viewMode === 'map';

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 border rounded-lg p-3 transition-all duration-200 ${
        isMapView
          ? 'bg-surface-container-lowest/60 border-outline-variant/30 backdrop-blur-sm'
          : 'bg-surface-container-lowest border-outline-variant'
      }`}>
      <div
        className={`flex-1 flex items-center gap-3 px-3 border rounded-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${
          isMapView
            ? 'bg-surface-container-lowest/50 border-outline-variant/30'
            : 'bg-surface-container-lowest border-outline-variant/50'
        }`}>
        <Search className="w-5 h-5 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search for jobs, skills, or companies..."
          className="flex-1 bg-transparent border-none outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/60 py-1.5"
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
        />
        <Search
          className="w-5 h-5 text-on-surface-variant cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex border border-outline-variant/50 rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            aria-label="List view">
            <List size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={`p-2 ${viewMode === 'map' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            aria-label="Map view">
            <Map size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
