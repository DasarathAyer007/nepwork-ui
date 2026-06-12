import { useState, useMemo } from 'react';
import JobCard from '../features/jobs/components/JobCard';
import JobSearchBar from '../features/jobs/components/JobSearchBar';
import JobFilters from '../features/jobs/components/JobFilters';
import JobPagination from '../features/jobs/components/JobPagination';

// Mock data - replace with API data later
const JOBS_MOCK = [
  {
    id: '1',
    title: 'Senior Agronomist',
    company: 'GreenTerra Solutions',
    location: 'Pokhara, Nepal',
    salary: 'Rs. 85,000 - 120,000/mo',
    type: 'Full-time',
    postedAt: '2 hours ago',
    isUrgent: false,
  },
  {
    id: '2',
    title: 'Full-Stack Developer (React/Node)',
    company: 'Nepal Digital Labs',
    location: 'Kathmandu, Remote Friendly',
    salary: 'Rs. 150,000 - 200,000/mo',
    type: 'Contract',
    postedAt: '1 day ago',
    isUrgent: false,
  },
  {
    id: '3',
    title: 'Hospitality Manager',
    company: 'Everest View Resort',
    location: 'Namche Bazaar',
    salary: 'Rs. 45,000 - 60,000/mo',
    type: 'Full-time',
    postedAt: '3 days ago',
    isUrgent: false,
  },
  {
    id: '4',
    title: 'Civil Engineer (Infrastructure)',
    company: 'Kathmandu Builders Group',
    location: 'Lalitpur',
    salary: 'Rs. 90,000 - 130,000/mo',
    type: 'Full-time',
    postedAt: '5 hours ago',
    isUrgent: true,
  },
];

function Jobs() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState(10000);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Filter logic
  const filteredJobs = useMemo(() => {
    return JOBS_MOCK.filter((job) => {
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Job type filter
      const matchesJobType = 
        selectedJobTypes.length === 0 || 
        selectedJobTypes.includes(job.type);
      
      // Location filter
      const matchesLocation = 
        !selectedLocation || 
        job.location.includes(selectedLocation);
      
      // Experience filter (simplified)
      const matchesExperience = 
        !selectedExperience || 
        (selectedExperience === 'Entry Level' && job.title.includes('Junior')) ||
        (selectedExperience === 'Mid Level' && job.title.includes('Manager')) ||
        (selectedExperience === 'Senior Level' && job.title.includes('Senior'));
      
      // Salary filter (extract number from salary string)
      const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
      const matchesSalary = salaryNum >= salaryRange;
      
      return matchesSearch && matchesJobType && matchesLocation && matchesExperience && matchesSalary;
    });
  }, [searchTerm, selectedJobTypes, selectedLocation, selectedExperience, salaryRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <JobSearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <JobFilters 
                selectedJobTypes={selectedJobTypes}
                setSelectedJobTypes={setSelectedJobTypes}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedExperience={selectedExperience}
                setSelectedExperience={setSelectedExperience}
                salaryRange={salaryRange}
                setSalaryRange={setSalaryRange}
              />
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-3 space-y-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))
            ) : (
              <div className="text-center py-12 bg-surface-container-lowest rounded-lg border border-outline-variant">
                <h3 className="text-headline-sm text-on-surface-variant">
                  No jobs found matching your criteria
                </h3>
                <p className="text-body-md text-on-surface-variant mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 pt-4 border-t border-outline-variant/30">
                <JobPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;