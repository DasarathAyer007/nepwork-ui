import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type {
  ApplicationStatus,
  JobApplicationListResponse,
  JobApplicationQueryParams,
  JobApplicationResult,
  JobCategory,
  JobDetail,
  JobListQueryParams,
  JobListResponse,
} from './jobTypes';

export const JobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery,
  tagTypes: ['Job', 'JobApplication'],

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

    getMyJobs: builder.query<JobListResponse, JobListQueryParams>({
      query: (params) => ({
        url: '/jobs/my-jobs/',
        params,
      }),
      providesTags: ['Job'],
    }),

    getJobRecommendations: builder.query<JobListResponse, JobListQueryParams>({
      query: (params) => ({
        url: '/jobs/recommendations/',
        params,
      }),
      providesTags: ['Job'],
    }),

    // Body is a loosely-typed partial payload since this single endpoint
    // backs many independently-shaped section edits (see ManageJobDetails).
    updateJob: builder.mutation<
      JobDetail,
      { id: string; body: Record<string, unknown> | FormData }
    >({
      query: ({ id, body }) => ({
        url: `/jobs/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Job', id },
        'Job',
      ],
    }),

    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Job', id }, 'Job'],
    }),

    getJobApplications: builder.query<
      JobApplicationListResponse,
      JobApplicationQueryParams
    >({
      query: (params) => ({
        url: '/jobs/applications/',
        params,
      }),
      providesTags: ['JobApplication'],
    }),

    getJobApplicationDetail: builder.query<JobApplicationResult, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'JobApplication', id }],
    }),

    withdrawJobApplication: builder.mutation<JobApplicationResult, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/withdraw/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    // Employer-side status change: move an application to any non-terminal
    // status, optionally notifying the applicant via chat and/or email.
    changeJobApplicationStatus: builder.mutation<
      JobApplicationResult,
      {
        id: string;
        status: ApplicationStatus;
        message?: string;
        send_message?: boolean;
        send_email?: boolean;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/jobs/applications/${id}/change_status/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    deleteJobApplication: builder.mutation<void, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),
    applyJob: builder.mutation<JobApplicationResult, FormData>({
      query: (formData) => ({
        url: '/jobs/applications/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['JobApplication'],
    }),
  }),
});

export const {
  useGetJobCategoryQuery,
  useCreateJobMutation,
  useGetJobsListQuery,
  useGetJobDetailQuery,
  useGetMyJobsQuery,
  useGetJobRecommendationsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetJobApplicationsQuery,
  useGetJobApplicationDetailQuery,
  useWithdrawJobApplicationMutation,
  useChangeJobApplicationStatusMutation,
  useDeleteJobApplicationMutation,
  useApplyJobMutation,
} = JobApi;
