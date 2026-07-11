import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type {
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

    // Employer-side status transitions.
    shortlistJobApplication: builder.mutation<JobApplicationResult, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/shortlist/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    markUnderReviewJobApplication: builder.mutation<
      JobApplicationResult,
      string
    >({
      query: (id) => ({
        url: `/jobs/applications/${id}/under_review/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    scheduleInterviewJobApplication: builder.mutation<
      JobApplicationResult,
      string
    >({
      query: (id) => ({
        url: `/jobs/applications/${id}/schedule_interview/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    markInterviewedJobApplication: builder.mutation<
      JobApplicationResult,
      string
    >({
      query: (id) => ({
        url: `/jobs/applications/${id}/mark_interviewed/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    offerJobApplication: builder.mutation<JobApplicationResult, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/offer/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'JobApplication', id },
        'JobApplication',
      ],
    }),

    rejectJobApplication: builder.mutation<JobApplicationResult, string>({
      query: (id) => ({
        url: `/jobs/applications/${id}/reject/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
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
    applyJob: builder.mutation({
    query: (formData) => ({
      url: '/jobs/applications/',
      method: 'POST',
      body: formData,
    }),
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
  useShortlistJobApplicationMutation,
  useMarkUnderReviewJobApplicationMutation,
  useScheduleInterviewJobApplicationMutation,
  useMarkInterviewedJobApplicationMutation,
  useOfferJobApplicationMutation,
  useRejectJobApplicationMutation,
  useDeleteJobApplicationMutation,
  useApplyJobMutation,
} = JobApi;
