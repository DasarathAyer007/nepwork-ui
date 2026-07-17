import { useCallback, useMemo, useState } from 'react';

import JobList from '@/features/jobs/components/JobList';
import { useGetJobsListQuery, useSaveJobMutation, useUnsaveJobMutation } from '@/features/jobs/jobApi';
import type { JobResult } from '@/features/jobs/jobTypes';
import { Link } from 'react-router-dom';

import { SpinnerLoader } from '@/components/loaders/SpinnerLoader';

import getApiErrorMessage from '../utils/getApiErrorMessage';

const EMPTY_JOBS: JobResult[] = [];
const PAGE_SIZE = 20;

export default function SavedJobs() {
  const [sortBy, setSortBy] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);

  // NOTE: /jobs/saved/ only returns { id, user, job: <uuid>, created_at } —
  // raw join-table records, not full job details. Until the backend returns
  // nested job objects there, we filter the regular jobs listing by
  // `is_saved` instead. Limitation: this only reflects saved jobs within the
  // current page of /jobs/ results, not every saved job platform-wide.
  const { data, isLoading, isError, error } = useGetJobsListQuery({
    page: currentPage,
    page_size: PAGE_SIZE,
    ordering: sortBy,
  });

  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  const handleSaveToggle = useCallback(
    async (job: JobResult) => {
      if (job.is_saved) {
        await unsaveJob(job.id);
        return;
      }
      await saveJob({ job_id: job.id });
    },
    [saveJob, unsaveJob]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const jobs = useMemo(
    () => (data?.results ?? EMPTY_JOBS).filter((job) => job.is_saved),
    [data]
  );
  const totalCount = jobs.length;
  const totalPages = 1;

  return (
    <div className="bg-background min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="mb-6">
          <h1 className="text-headline-md font-bold text-on-surface">
            Saved Jobs
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            <p className="text-body-md text-on-surface-variant mt-1">
            All the jobs you've saved for later.
            </p>
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <SpinnerLoader />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-12">
            <p className="text-error">
              {getApiErrorMessage({
                error,
                fallbackMessage: "We couldn't load your saved jobs.",
              })}
            </p>
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-body-lg font-semibold text-on-surface">
              No saved jobs yet
            </p>
            
            <Link
              to="/jobs"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95">
              Browse Jobs
            </Link>
          </div>
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <JobList
            jobs={jobs}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onPageChange={handlePageChange}
            onSaveToggle={handleSaveToggle}
          />
        )}
      </div>
    </div>
  );
}