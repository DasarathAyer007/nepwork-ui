import Pagination from '@/components/Pagination';

import type { JobResult } from '../jobTypes';
import ServiceCard from './JobCard';

const JOB_SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  { value: '-salary_max', label: 'Salary: High to Low' },
  { value: 'salary_min', label: 'Salary: Low to High' },
  { value: '-total_applications', label: 'Most Applied' },
  { value: 'total_applications', label: 'Least Applied' },
  { value: 'experience_years', label: 'Experience: Low to High' },
  { value: '-experience_years', label: 'Experience: High to Low' },
];

interface JobListProps {
  jobs: JobResult[];
  totalCount?: number;
  currentPage: number;
  totalPages: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
}

export default function JobList({
  jobs,
  totalCount,
  currentPage,
  totalPages,
  sortBy,
  onSortChange,
  onPageChange,
}: JobListProps) {
  const displayCount = totalCount ?? jobs.length;
  function handleSaveToggle(jobId: string) {
    // Implement the logic to toggle save status for the job with the given jobId
    console.log(`Toggling save for job ID: ${jobId}`);
  }
  return (
    <div className="grow flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-on-surface-variant">
          Showing{' '}
          <span className="font-bold text-on-surface">{displayCount}</span> jobs
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="job-sort-by"
            className="text-body-md text-on-surface-variant">
            Sort by
          </label>
          <select
            id="job-sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 border border-outline-variant/50 bg-surface-container-lowest rounded-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer">
            {JOB_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {jobs.map((job) => (
        <ServiceCard key={job.id} data={job} onSaveToggle={handleSaveToggle} />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
