import Pagination from '@/components/Pagination';

import type { JobResult } from '../jobTypes';
import ServiceCard from './JobCard';

interface JobListProps {
  jobs: JobResult[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function JobList({
  jobs,
  currentPage,
  totalPages,
  onPageChange,
}: JobListProps) {
  function handleSaveToggle(jobId: string) {
    // Implement the logic to toggle save status for the job with the given jobId
    console.log(`Toggling save for job ID: ${jobId}`);
  }
  return (
    <div className="grow flex flex-col gap-4">
      {/* <div className="flex justify-between items-center mb-2">
        <p className="text-on-surface-variant">
          Showing <span className="font-bold text-on-surface">{totalCount}</span> services
        </p>
      </div> */}
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
