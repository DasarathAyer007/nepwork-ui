import { createApi } from '@reduxjs/toolkit/query/react';

import type { RootState } from '@/app/store';
import { baseQuery } from '@/services/baseQuery';
import toast from 'react-hot-toast';

import {
  selectLiveNotifications,
  selectUnreadCount,
  setAllNotificationsReadState,
  setNotificationReadState,
  setUnreadCount,
} from './notificationsSlice';
import type { Notification, NotificationListResponse } from './types';

/**
 * RTK Query endpoints mirroring the Django REST views.
 *
 * The mark-read mutations only apply an optimistic update to
 * notificationsSlice (`liveNotifications`/`unreadCount`) and roll it back on
 * failure. Patching the `getNotifications`/`getLatestNotifications` RTK
 * Query caches to match happens once, in notificationListeners.ts, which
 * reacts to the same slice actions dispatched here — including on
 * rollback, since the rollback dispatches the identical action shape with
 * the previous value.
 */
export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQuery,
  tagTypes: ['Notification'] as const,
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      { page?: number; unread?: boolean } | void
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.page) search.set('page', String(params.page));
        if (params?.unread) search.set('unread', 'true');
        const qs = search.toString();
        return `notifications/${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Notification' as const,
                id,
              })),
              { type: 'Notification' as const, id: 'LIST' },
            ]
          : [{ type: 'Notification' as const, id: 'LIST' }],
    }),

    getLatestNotifications: builder.query<Notification[], void>({
      query: () => 'notifications/latest/',
      providesTags: [{ type: 'Notification', id: 'LATEST' }],
    }),

    getUnreadCount: builder.query<{ unread_count: number }, void>({
      query: () => 'notifications/unread-count/',
    }),

    markNotificationReadHttp: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read/`,
        method: 'PATCH',
      }),
      async onQueryStarted(
        notificationId,
        { dispatch, getState, queryFulfilled }
      ) {
        const previousUnreadCount = selectUnreadCount(getState() as RootState);

        dispatch(setNotificationReadState({ id: notificationId, isRead: true }));
        dispatch(setUnreadCount(Math.max(0, previousUnreadCount - 1)));

        try {
          await queryFulfilled;
        } catch {
          dispatch(
            setNotificationReadState({ id: notificationId, isRead: false })
          );
          dispatch(setUnreadCount(previousUnreadCount));
          toast.error('Could not mark notification as read. Please try again.');
        }
      },
    }),

    markAllNotificationsReadHttp: builder.mutation<
      { marked_read: number },
      void
    >({
      query: () => ({
        url: 'notifications/read-all/',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const previousUnreadCount = selectUnreadCount(state);
        const previousReadFlags = selectLiveNotifications(state).map((n) => ({
          id: n.id,
          isRead: n.is_read,
        }));

        dispatch(setAllNotificationsReadState(true));
        dispatch(setUnreadCount(0));

        try {
          await queryFulfilled;
        } catch {
          previousReadFlags.forEach(({ id, isRead }) =>
            dispatch(setNotificationReadState({ id, isRead }))
          );
          dispatch(setUnreadCount(previousUnreadCount));
          toast.error(
            'Could not mark all notifications as read. Please try again.'
          );
        }
      },
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'LATEST' },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetLatestNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadHttpMutation,
  useMarkAllNotificationsReadHttpMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
