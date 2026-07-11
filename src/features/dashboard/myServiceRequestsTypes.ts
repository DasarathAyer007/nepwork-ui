import type { ServiceRequestStatus } from '@/features/services/types';

export interface ServiceRequestsFilters {
  status: ServiceRequestStatus | '';
}

export const DEFAULT_SERVICE_REQUESTS_FILTERS: ServiceRequestsFilters = {
  status: '',
};
