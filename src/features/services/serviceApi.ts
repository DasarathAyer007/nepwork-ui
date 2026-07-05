import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type { Service, ServiceCreatePayload} from './types';

import type {
  Category,
  ServicesListResponse,
  ServicesQueryParams,
} from './types';

export const ServiceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery,
  tagTypes: ["User", "Service"],
 
  endpoints: (builder) => ({
    getServicesList: builder.query<ServicesListResponse, ServicesQueryParams>({
      query: (params) => ({
        url: "/services/",
        params,
      }),
      providesTags: ["Service"],
    }),
 
    getCategory: builder.query<Category[], null>({
      query: () => ({
        url: "/services/category/",
      }),
    }),
 
    createService: builder.mutation<Service, ServiceCreatePayload>({
      query: (body) => ({
        url: "/services/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});
 
export const {
  useGetServicesListQuery,
  useGetCategoryQuery,
  useCreateServiceMutation,
} = ServiceApi;