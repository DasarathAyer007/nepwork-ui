import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type {
  Category,
  ServicesListResponse,
  ServicesQueryParams,
} from './types';

export const ServiceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery,
  tagTypes: ['User'],

  endpoints: (builder) => ({
    getServicesList: builder.query<ServicesListResponse, ServicesQueryParams>({
      query: (params) => ({
        url: '/services/',
        params,
      }),
    }),

    getCategory: builder.query<Category[], null>({
      query: () => ({
        url: '/services/category/',
      }),
    }),
  }),
});

export const { useGetServicesListQuery, useGetCategoryQuery } = ServiceApi;
