import { useMemo, useState } from 'react';

import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import MyApplicationsFilters from '@/features/dashboard/components/myApplications/MyApplicationsFilters';
import MyApplicationsTable from '@/features/dashboard/components/myApplications/MyApplicationsTable';
import MyApplicationsTableSkeleton from '@/features/dashboard/components/myApplications/MyApplicationsTableSkeleton';
import { DEFAULT_MY_APPLICATIONS_FILTERS } from '@/features/dashboard/myApplicationsTypes';
import type { MyApplicationsFilters as MyApplicationsFiltersType } from '@/features/dashboard/myApplicationsTypes';
import { useGetJobApplicationsQuery } from '@/features/jobs/jobApi';
import type {
  JobApplicationQueryParams,
  JobApplicationResult,
} from '@/features/jobs/jobTypes';

import Pagination from '@/components/Pagination';

const EMPTY_APPLICATIONS: JobApplicationResult[] = [];
const PAGE_SIZE = 20;

export default function MyApplications() {
  const [filters, setFilters] = useState<MyApplicationsFiltersType>(
    DEFAULT_MY_APPLICATIONS_FILTERS
  );
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => {
    const params: JobApplicationQueryParams = {
      scope: 'applied',
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };

    if (filters.status) params.status = filters.status;

    return params;
  }, [page, filters.status]);

  const { data, isLoading, isError, refetch } =
    useGetJobApplicationsQuery(queryParams);

  const handleFiltersChange = (next: MyApplicationsFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_MY_APPLICATIONS_FILTERS);
    setPage(1);
  };

  const hasActiveFilters = Boolean(filters.status);

  const applications = data?.results ?? EMPTY_APPLICATIONS;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Applications"
        description="Track the jobs you've applied to and their current status."
        actionLabel="Browse Jobs"
        actionTo="/jobs"
      />

      <MyApplicationsFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {isLoading && <MyApplicationsTableSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          message="We couldn't load your applications. Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading &&
        !isError &&
        applications.length === 0 &&
        hasActiveFilters && (
          <EmptyState
            title="No applications found"
            description="Try adjusting your filters."
          />
        )}

      {!isLoading &&
        !isError &&
        applications.length === 0 &&
        !hasActiveFilters && (
          <EmptyState
            title="No applications yet"
            description="Browse open jobs and submit your first application."
            actionLabel="Browse Jobs"
            actionTo="/jobs"
          />
        )}

      {!isLoading && !isError && applications.length > 0 && (
        <>
          <MyApplicationsTable
            applications={applications}
            page={currentPage}
            pageSize={pageSize}
          />

          {totalPages > 1 && (
            <Pagination
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
