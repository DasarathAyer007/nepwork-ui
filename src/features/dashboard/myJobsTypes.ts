import type { JobStatus, JobType, WorkMode } from '@/features/jobs/jobTypes';

export interface MyJobsFilters {
  search: string;
  jobType: JobType | '';
  workMode: WorkMode | '';
  status: JobStatus | '';
  category: string;
}

export const DEFAULT_MY_JOBS_FILTERS: MyJobsFilters = {
  search: '',
  jobType: '',
  workMode: '',
  status: '',
  category: '',
};
