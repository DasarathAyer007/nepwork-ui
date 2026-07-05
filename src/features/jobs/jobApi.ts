import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type { JobCategory, JobDetail } from './jobTypes';

// function buildJobFormData(payload: JobCreatePayload): FormData {
//   const formData = new FormData();

//   formData.append("title", payload.title);
//   formData.append("description", payload.description);
//   formData.append("category", payload.category);
//   formData.append("job_type", payload.job_type);
//   formData.append("work_mode", payload.work_mode);
//   formData.append("experience_level", payload.experience_level);
//   formData.append("currency", payload.currency);

//   if (payload.slug) formData.append("slug", payload.slug);
//   if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);
//   if (payload.organization) formData.append("organization", payload.organization);
//   if (payload.status) formData.append("status", payload.status);
//   if (payload.experience_years != null) {
//     formData.append("experience_years", String(payload.experience_years));
//   }
//   if (payload.salary_min != null) formData.append("salary_min", String(payload.salary_min));
//   if (payload.salary_max != null) formData.append("salary_max", String(payload.salary_max));
//   if (payload.contact_email) formData.append("contact_email", payload.contact_email);
//   if (payload.contact_phone) formData.append("contact_phone", payload.contact_phone);
//   if (payload.deadline) formData.append("deadline", payload.deadline);

//   payload.skills_required.forEach((skill) => formData.append("skills_required", skill));

//   if (payload.requirements?.length) {
//     formData.append("requirements", JSON.stringify(payload.requirements));
//   }
//   if (payload.benefits?.length) {
//     formData.append("benefits", JSON.stringify(payload.benefits));
//   }
//   if (payload.location) {
//     formData.append("location", JSON.stringify(payload.location));
//   }

//   return formData;
// }

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
  }),
});

export const { useGetJobCategoryQuery, useCreateJobMutation } = JobApi;
