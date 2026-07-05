import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type {
  JobCategory,
  JobDetail,
  JobListQueryParams,
  JobListResponse,
} from './jobTypes';

export const JobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery,
  tagTypes: ['Job'],

  endpoints: (builder) => ({
    getJobCategory: builder.query<JobCategory[], null>({
      query: () => ({
        url: '/jobs/category/',
      }),
    }),

    createJob: builder.mutation<JobDetail, FormData>({
      query: (body) => ({
        url: '/jobs/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Job'],
    }),

    getJobsList: builder.query<JobListResponse, JobListQueryParams>({
      query: (params) => ({
        url: '/jobs/',
        params,
      }),
      providesTags: ['Job'],
    }),

    getJobDetail: builder.query<JobDetail, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/`,
      }),
      providesTags: (_result, _error, jobId) => [{ type: 'Job', id: jobId }],
    }),
  }),
});

export const {
  useGetJobCategoryQuery,
  useCreateJobMutation,
  useGetJobsListQuery,
  useGetJobDetailQuery,
} = JobApi;
