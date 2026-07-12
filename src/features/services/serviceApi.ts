import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';
// import type { Service, ServiceDetail, ServiceUpdatePayload } from './types';
// // import type { Service, ServiceDetail } from './types';
// import type {
//   Category,
//   ServiceRequestListResponse,
//   ServiceRequestQueryParams,
//   ServiceRequestResult,
//   ServicesListResponse,
//   ServicesQueryParams,
// } from './types';
import type {
  Service,
  ServiceDetail,
  ServiceUpdatePayload,
  ServiceRequestCreatePayload,
} from './types';
import type {
  Category,
  ServiceRequestListResponse,
  ServiceRequestQueryParams,
  ServiceRequestResult,
  ServicesListResponse,
  ServicesQueryParams,
} from './types';

export const ServiceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery,
  tagTypes: ['User', 'Service', 'ServiceRequest'],

  endpoints: (builder) => ({
    getServicesList: builder.query<ServicesListResponse, ServicesQueryParams>({
      query: (params) => ({
        url: '/services/',
        params,
      }),
      providesTags: ['Service'],
    }),

    getCategory: builder.query<Category[], null>({
      query: () => ({
        url: '/services/category/',
      }),
    }),

    createService: builder.mutation<Service, FormData>({
      query: (body) => ({
        url: '/services/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),

    getServiceDetail: builder.query<ServiceDetail, string>({
      query: (serviceId) => ({
        url: `/services/${serviceId}/`,
      }),
      providesTags: (_result, _error, serviceId) => [
        { type: 'Service', id: serviceId },
      ],
    }),

    saveService: builder.mutation<unknown, { service_id: string }>({
      query: (body) => ({
        url: '/services/saved/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),

    unsaveService: builder.mutation<void, string>({
      query: (serviceId) => ({
        url: `/services/saved/${serviceId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),

    getMyServices: builder.query<ServicesListResponse, ServicesQueryParams>({
      query: (params) => ({
        url: '/services/my/',
        params,
      }),
      providesTags: ['Service'],
    }),

    getServiceRecommendations: builder.query<
      ServicesListResponse,
      ServicesQueryParams
    >({
      query: (params) => ({
        url: '/services/recommendations/',
        params,
      }),
      providesTags: ['Service'],
    }),

    // Body is a loosely-typed partial payload since this single endpoint
    // backs many independently-shaped section edits (see ManageServiceDetails).
    // updateService: builder.mutation<
    //   ServiceDetail,
    //   { id: string; body: Record<string, unknown> | FormData }
    // >({
    updateService: builder.mutation<
      ServiceDetail,
      { id: string; body: ServiceUpdatePayload | FormData }
     >({
      query: ({ id, body }) => ({
        url: `/services/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Service', id },
        'Service',
      ],
    }),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Service', id },
        'Service',
      ],
    }),
      createServiceRequest: builder.mutation<
            ServiceRequestResult,
            ServiceRequestCreatePayload
          >({
            query: (body) => ({
              url: '/services/requests/',
              method: 'POST',
              body,
            }),
            invalidatesTags: ['ServiceRequest'],
          }),
    getServiceRequests: builder.query<
      ServiceRequestListResponse,
      ServiceRequestQueryParams
    >({
      query: (params) => ({
        url: '/services/requests/',
        params,
      }),
      providesTags: ['ServiceRequest'],
    }),

    getServiceRequestDetail: builder.query<ServiceRequestResult, string>({
      query: (id) => ({
        url: `/services/requests/${id}/`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'ServiceRequest', id }],
    }),

    acceptServiceRequest: builder.mutation<ServiceRequestResult, string>({
      query: (id) => ({
        url: `/services/requests/${id}/accept/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ServiceRequest', id },
        'ServiceRequest',
      ],
    }),

    rejectServiceRequest: builder.mutation<ServiceRequestResult, string>({
      query: (id) => ({
        url: `/services/requests/${id}/reject/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ServiceRequest', id },
        'ServiceRequest',
      ],
    }),

    cancelServiceRequest: builder.mutation<ServiceRequestResult, string>({
      query: (id) => ({
        url: `/services/requests/${id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ServiceRequest', id },
        'ServiceRequest',
      ],
    }),

    deleteServiceRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/requests/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ServiceRequest', id },
        'ServiceRequest',
      ],
    }),
  }),
});

export const {
  useGetServicesListQuery,
  useGetCategoryQuery,
  useCreateServiceMutation,
  useGetServiceDetailQuery,
  useSaveServiceMutation,
  useUnsaveServiceMutation,
  useGetMyServicesQuery,
  useGetServiceRecommendationsQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCreateServiceRequestMutation,
  useGetServiceRequestsQuery,
  useGetServiceRequestDetailQuery,
  useAcceptServiceRequestMutation,
  useRejectServiceRequestMutation,
  useCancelServiceRequestMutation,
  useDeleteServiceRequestMutation,
} = ServiceApi;
