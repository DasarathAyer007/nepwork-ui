import { useEffect, useMemo, useState } from 'react';

import DashboardPageHeader from '@/features/dashboard/components/DashboardPageHeader';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import MyServicesFilters from '@/features/dashboard/components/myServices/MyServicesFilters';
import MyServicesTable from '@/features/dashboard/components/myServices/MyServicesTable';
import MyServicesTableSkeleton from '@/features/dashboard/components/myServices/MyServicesTableSkeleton';
import { DEFAULT_MY_SERVICES_FILTERS } from '@/features/dashboard/myServicesTypes';
import type { MyServicesFilters as MyServicesFiltersType } from '@/features/dashboard/myServicesTypes';
import {
  useGetCategoryQuery,
  useGetMyServicesQuery,
} from '@/features/services/serviceApi';
import type {
  Category,
  ServiceResult,
  ServicesQueryParams,
} from '@/features/services/types';

import Pagination from '@/components/Pagination';

const EMPTY_SERVICES: ServiceResult[] = [];
const EMPTY_CATEGORIES: Category[] = [];
const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

export default function MyServices() {
  const [filters, setFilters] = useState<MyServicesFiltersType>(
    DEFAULT_MY_SERVICES_FILTERS
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

  const { data: categories } = useGetCategoryQuery(null);

  const queryParams = useMemo(() => {
    const params: ServicesQueryParams = {
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };

    if (committedSearch) params.search = committedSearch;
    if (filters.priceType) params.price_type = filters.priceType;
    if (filters.availabilityStatus)
      params.availability_status = filters.availabilityStatus;
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;

    return params;
  }, [
    page,
    committedSearch,
    filters.priceType,
    filters.availabilityStatus,
    filters.status,
    filters.category,
  ]);

  const { data, isLoading, isError, refetch } =
    useGetMyServicesQuery(queryParams);

  const handleFiltersChange = (next: MyServicesFiltersType) => {
    setFilters(next);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_MY_SERVICES_FILTERS);
    setCommittedSearch('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    committedSearch ||
    filters.priceType ||
    filters.availabilityStatus ||
    filters.status ||
    filters.category
  );

  const services = data?.results ?? EMPTY_SERVICES;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Services"
        description="Manage your posted services, track requests, and keep your listings up to date."
        actionLabel="Post New Service"
        actionTo="/create/service"
      />

      <MyServicesFilters
        filters={filters}
        categories={categories ?? EMPTY_CATEGORIES}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {isLoading && <MyServicesTableSkeleton />}

      {!isLoading && isError && (
        <ErrorState
          message="We couldn't load your services. Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && services.length === 0 && hasActiveFilters && (
        <EmptyState
          title="No services found"
          description="Try adjusting your filters or search term."
        />
      )}

      {!isLoading && !isError && services.length === 0 && !hasActiveFilters && (
        <EmptyState
          title="No services posted yet"
          description="Create your first service listing to start receiving requests."
          actionLabel="Post Your First Service"
          actionTo="/create/service"
        />
      )}

      {!isLoading && !isError && services.length > 0 && (
        <>
          <MyServicesTable
            services={services}
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
