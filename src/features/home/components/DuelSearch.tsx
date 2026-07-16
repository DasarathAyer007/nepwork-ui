import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Briefcase, MapPin, Search } from 'lucide-react';

const jobSuggestions = [
  'Graphic Designer',
  'Software Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Project Manager',
  'Content Writer',
  'Marketing Manager',
  'Nurse',
  'Teacher',
  'Driver',
];

const locationSuggestions = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Chitwan',
  'Biratnagar',
  'Butwal',
  'Dharan',
  'Janakpur',
  'Hetauda',
  'Nepalgunj',
];

function DuelSearch() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const filteredSearch = jobSuggestions.filter((i) =>
    i.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLocation = locationSuggestions.filter((i) =>
    i.toLowerCase().includes(locationQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node)
      ) {
        setShowLocation(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (locationQuery.trim()) params.set('location', locationQuery.trim());

    const queryString = params.toString();
    navigate(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50">
      {/* Card */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-lg relative ">
        {/* Heading */}
        <div className="flex items-center gap-2 px-2 pb-3">
          <span className="flex items-center justify-center size-7 rounded-lg bg-primary text-on-primary">
            <Briefcase size={16} />
          </span>
          <h3 className="text-sm font-bold text-on-surface">Find Jobs</h3>
        </div>

        {/* Inputs */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1 " ref={searchRef}>
            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
              <Search className="w-5 h-5 text-primary" />
              <input
                className="w-full bg-transparent outline-none text-on-surface py-1"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
              />
            </div>

            {showSearch && filteredSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl max-h-48 overflow-auto z-100">
                {filteredSearch.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSearchQuery(item);
                      setShowSearch(false);
                    }}
                    className="px-3 py-2 hover:bg-surface-container cursor-pointer flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="relative flex-1 " ref={locationRef}>
            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
              <MapPin className="w-5 h-5 text-primary" />
              <input
                className="w-full bg-transparent outline-none text-on-surface py-1"
                placeholder="Location..."
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setShowLocation(true);
                }}
                onFocus={() => setShowLocation(true)}
              />
            </div>

            {showLocation && filteredLocation.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl max-h-48 overflow-auto z-100">
                {filteredLocation.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setLocationQuery(item);
                      setShowLocation(false);
                    }}
                    className="px-3 py-2 hover:bg-surface-container cursor-pointer flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Button */}
          <button
            onClick={handleSearch}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default DuelSearch;