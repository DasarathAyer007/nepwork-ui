import { useEffect, useMemo, useState } from 'react';

import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import MyJobsFilters from '@/features/dashboard/components/myJobs/MyJobsFilters';
import MyJobsTable from '@/features/dashboard/components/myJobs/MyJobsTable';
import MyJobsTableSkeleton from '@/features/dashboard/components/myJobs/MyJobsTableSkeleton';
import { DEFAULT_MY_JOBS_FILTERS } from '@/features/dashboard/myJobsTypes';
import type { MyJobsFilters as MyJobsFiltersType } from '@/features/dashboard/myJobsTypes';
import JobPagination from '@/features/jobs/components/JobPagination';
import {
  useGetJobCategoryQuery,
  useGetMyJobsQuery,
} from '@/features/jobs/jobApi';
import type {
  JobCategory,
  JobListQueryParams,
  JobResult,
} from '@/features/jobs/jobTypes';

const EMPTY_JOBS: JobResult[] = [];
const EMPTY_CATEGORIES: JobCategory[] = [];
const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

export default function MyJobs() {
  const [filters, setFilters] = useState<MyJobsFiltersType>(
    DEFAULT_MY_JOBS_FILTERS
  );
  const [committedSearch, setCommittedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCommittedSearch(filters.search.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  const { data: categories } = useGetJobCategoryQuery(null);

  const queryParams = useMemo(() => {
    const params: JobListQueryParams = {
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };

    if (committedSearch) params.search = committedSearch;
    if (filters.jobType) params.job_type = filters.jobType;
    if (filters.workMode) params.work_mode = filters.workMode;
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;

    return params;
  }, [
    page,
    committedSearch,
    filters.jobType,
    filters.workMode,
    filters.status,
    filters.category,
  ]);

  const { data, isLoading, isError, refetch } = useGetMyJobsQuery(queryParams);

  const handleFiltersChange = (next: MyJobsFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_MY_JOBS_FILTERS);
    setCommittedSearch('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    committedSearch ||
    filters.jobType ||
    filters.workMode ||
    filters.status ||
    filters.category
  );

  const jobs = data?.results ?? EMPTY_JOBS;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Jobs"
        description="Manage your posted jobs, monitor applications, and keep your listings up to date."
        actionLabel="Post New Job"
        actionTo="/create/job"
      />

      <MyJobsFilters
        filters={filters}
        categories={categories ?? EMPTY_CATEGORIES}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {isLoading && <MyJobsTableSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          message="We couldn't load your jobs. Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && jobs.length === 0 && hasActiveFilters && (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your filters or search term."
        />
      )}

      {!isLoading && !isError && jobs.length === 0 && !hasActiveFilters && (
        <EmptyState
          title="No jobs posted yet"
          description="Create your first job posting to start receiving applications."
          actionLabel="Post Your First Job"
          actionTo="/create/job"
        />
      )}

      {!isLoading && !isError && jobs.length > 0 && (
        <>
          <MyJobsTable jobs={jobs} page={currentPage} pageSize={pageSize} />

          {totalPages > 1 && (
            <JobPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
