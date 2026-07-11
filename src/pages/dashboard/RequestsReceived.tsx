import { useMemo, useState } from 'react';

import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import RequestsReceivedTable from '@/features/dashboard/components/serviceRequests/RequestsReceivedTable';
import ServiceRequestsFilters from '@/features/dashboard/components/serviceRequests/ServiceRequestsFilters';
import ServiceRequestsTableSkeleton from '@/features/dashboard/components/serviceRequests/ServiceRequestsTableSkeleton';
import { DEFAULT_SERVICE_REQUESTS_FILTERS } from '@/features/dashboard/myServiceRequestsTypes';
import type { ServiceRequestsFilters as ServiceRequestsFiltersType } from '@/features/dashboard/myServiceRequestsTypes';
import { useGetServiceRequestsQuery } from '@/features/services/serviceApi';
import type {
  ServiceRequestQueryParams,
  ServiceRequestResult,
} from '@/features/services/types';

import Pagination from '@/components/Pagination';

const EMPTY_REQUESTS: ServiceRequestResult[] = [];
const PAGE_SIZE = 20;

export default function RequestsReceived() {
  const [filters, setFilters] = useState<ServiceRequestsFiltersType>(
    DEFAULT_SERVICE_REQUESTS_FILTERS
  );
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => {
    const params: ServiceRequestQueryParams = {
      scope: 'received',
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };

    if (filters.status) params.status = filters.status;

    return params;
  }, [page, filters.status]);

  const { data, isLoading, isError, refetch } =
    useGetServiceRequestsQuery(queryParams);

  const handleFiltersChange = (next: ServiceRequestsFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_SERVICE_REQUESTS_FILTERS);
    setPage(1);
  };

  const hasActiveFilters = Boolean(filters.status);

  const requests = data?.results ?? EMPTY_REQUESTS;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Requests Received"
        description="Review and respond to requests clients have sent for your services."
      />

      <ServiceRequestsFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {isLoading && <ServiceRequestsTableSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          message="We couldn't load your requests. Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && requests.length === 0 && hasActiveFilters && (
        <EmptyState
          title="No requests found"
          description="Try adjusting your filters."
        />
      )}

      {!isLoading && !isError && requests.length === 0 && !hasActiveFilters && (
        <EmptyState
          title="No requests received yet"
          description="When clients request one of your services, they'll show up here."
        />
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <>
          <RequestsReceivedTable
            requests={requests}
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
