import type { ApplicationStatus } from '@/features/jobs/jobTypes';

export interface MyApplicationsFilters {
  status: ApplicationStatus | '';
}

export const DEFAULT_MY_APPLICATIONS_FILTERS: MyApplicationsFilters = {
  status: '',
};
