import { useMemo, useState } from 'react';

import { selectUser } from '@/features/auth/authSelectors';
import EmptyState from '@/features/dashboard/components/EmptyState';
import ErrorState from '@/features/dashboard/components/ErrorState';
import RequestsReceivedTable from '@/features/dashboard/components/serviceRequests/RequestsReceivedTable';
import ServiceRequestsTableSkeleton from '@/features/dashboard/components/serviceRequests/ServiceRequestsTableSkeleton';
import {
  useGetServiceDetailQuery,
  useGetServiceRequestsQuery,
} from '@/features/services/serviceApi';
import type {
  ServiceRequestQueryParams,
  ServiceRequestResult,
  ServiceRequestStatus,
} from '@/features/services/types';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import Pagination from '@/components/Pagination';
import NotFound from '@/components/ui/NotFound';
import { DropDown } from '@/components/ui/forms';

import { useAppSelector } from '@/hooks/useSelectore';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

const EMPTY_REQUESTS: ServiceRequestResult[] = [];
const PAGE_SIZE = 20;

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <ShieldAlert size={26} />
      </div>
      <h1 className="text-headline-sm font-bold text-on-surface">
        You don't have access to this page
      </h1>
      <p className="text-body-md text-on-surface-variant mt-2 max-w-sm">
        Only the owner of this service can view its requests.
      </p>
      <Link
        to="/dashboard/services"
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium">
        <ArrowLeft size={16} />
        Back to My Services
      </Link>
    </div>
  );
}

export default function ServiceRequestsList() {
  const { id: serviceId } = useParams<{ id: string }>();
  const currentUser = useAppSelector(selectUser);

  const [status, setStatus] = useState<ServiceRequestStatus | ''>('');
  const [page, setPage] = useState(1);

  const {
    data: service,
    isLoading: isServiceLoading,
    isError: isServiceError,
  } = useGetServiceDetailQuery(serviceId ?? '', { skip: !serviceId });

  const queryParams = useMemo(() => {
    const params: ServiceRequestQueryParams = {
      scope: 'received',
      service_id: serviceId,
      page,
      page_size: PAGE_SIZE,
      ordering: '-created_at',
    };
    if (status) params.status = status;
    return params;
  }, [serviceId, status, page]);

  const {
    data,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
    refetch,
  } = useGetServiceRequestsQuery(queryParams, { skip: !serviceId });

  if (isServiceLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-surface-container-high rounded-lg" />
        <div className="h-64 bg-surface-container-high rounded-lg" />
      </div>
    );
  }

  if (isServiceError || !service) {
    return (
      <NotFound
        title="Service not found"
        actionLabel="Back to My Services"
        actionTo="/dashboard/services"
      />
    );
  }

  if (currentUser && service.user.id !== currentUser.id) {
    return <AccessDenied />;
  }

  const requests = data?.results ?? EMPTY_REQUESTS;
  const totalPages = data?.total_pages ?? 1;
  const currentPage = data?.page ?? page;
  const pageSize = data?.page_size ?? PAGE_SIZE;

  const handleStatusChange = (value: string) => {
    setStatus(value as ServiceRequestStatus | '');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/dashboard/services/${serviceId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          Back to Service
        </Link>
        <h1 className="text-headline-md font-bold text-on-surface mt-2">
          Requests for "{service.title}"
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Review and respond to requests clients have sent for this service.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-64">
            <DropDown
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isRequestsLoading && <ServiceRequestsTableSkeleton />}

      {!isRequestsLoading && isRequestsError && (
        <ErrorState
          message="We couldn't load requests. Please try again."
          onRetry={refetch}
        />
      )}

      {!isRequestsLoading && !isRequestsError && requests.length === 0 && (
        <EmptyState
          title="No requests yet"
          description="Once clients request this service, they'll show up here."
        />
      )}

      {!isRequestsLoading && !isRequestsError && requests.length > 0 && (
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
