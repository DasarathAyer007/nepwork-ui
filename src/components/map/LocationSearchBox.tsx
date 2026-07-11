import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { Loader2, MapPin, Search, X } from 'lucide-react';

import { useGeosearch } from '@/hooks/useGeoSearch';
import type { GeocodeResult } from '@/hooks/useGeoSearch';

interface LocationSearchBoxProps {
  placeholder?: string;
  onSelect: (result: GeocodeResult) => void;
  className?: string;
}

export default function LocationSearchBox({
  placeholder = 'Search for an address, city, or place',
  onSelect,
  className,
}: LocationSearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, loading, error } = useGeosearch(query);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodeResult) => {
    onSelect(result);
    setQuery(result.displayName);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const showDropdown =
    isOpen &&
    query.trim().length >= 3 &&
    (loading || results.length > 0 || !!error);

  return (
    <div ref={containerRef} className={clsx('relative w-full', className)}>
      <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-md shadow-sm px-3 py-2 focus-within:border-primary transition-colors">
        <Search size={16} className="text-on-surface-variant shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-body-sm text-on-surface placeholder:text-on-surface-variant min-w-0"
        />
        {loading && (
          <Loader2
            size={16}
            className="animate-spin text-on-surface-variant shrink-0"
          />
        )}
        {!loading && query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 p-0.5 rounded hover:bg-surface-container transition-colors cursor-pointer">
            <X size={14} className="text-on-surface-variant" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg max-h-64 overflow-y-auto z-[500]">
          {error && (
            <p className="px-3 py-2 text-body-sm text-error">{error}</p>
          )}
          {!error && !loading && results.length === 0 && (
            <p className="px-3 py-2 text-body-sm text-on-surface-variant">
              No matches found.
            </p>
          )}
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full flex items-start gap-2 text-left px-3 py-2 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant last:border-b-0">
              <MapPin
                size={14}
                className="text-on-surface-variant mt-0.5 shrink-0"
              />
              <span className="text-body-sm text-on-surface line-clamp-2">
                {result.displayName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
