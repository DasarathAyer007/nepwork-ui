import { Search, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

interface JobSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function JobSearchBar({ searchTerm, setSearchTerm }: JobSearchBarProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-3">
      <div className="flex-1 flex items-center gap-3 px-3 bg-surface-container-lowest border border-outline-variant/50 rounded-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <Search className="w-5 h-5 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search for jobs, skills, or companies..."
          className="flex-1 bg-transparent border-none outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/60 py-1.5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <select className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/50 rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer">
          <option>Sort by: Newest</option>
          <option>Sort by: Salary (High-Low)</option>
          <option>Sort by: Salary (Low-High)</option>
        </select>

        <div className="flex border border-outline-variant/50 rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSearchBar;