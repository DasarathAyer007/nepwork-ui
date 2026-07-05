import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/services/baseQuery';

import type { Notification } from './types';

/**
 * RTK Query endpoints mirroring the Django REST views. Mark-as-read actions
 * are normally sent over the WebSocket (WebSocketService.markNotificationRead)
 * for instant feedback, but the HTTP mutations are kept here too as a
 * fallback / for non-socket contexts.
 */
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQuery,
  tagTypes: ['Notification'] as const,
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], boolean | void>({
      query: (unreadOnly) =>
        unreadOnly ? 'notifications/?unread=true' : 'notifications/',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Notification' as const,
                id,
              })),
              { type: 'Notification' as const, id: 'LIST' },
            ]
          : [{ type: 'Notification' as const, id: 'LIST' }],
    }),

    getUnreadCount: builder.query<{ unread_count: number }, void>({
      query: () => 'notifications/unread-count/',
    }),

    markNotificationReadHttp: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read/`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    markAllNotificationsReadHttp: builder.mutation<
      { marked_read: number },
      void
    >({
      query: () => ({
        url: 'notifications/read-all/',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadHttpMutation,
  useMarkAllNotificationsReadHttpMutation,
} = notificationsApi;
