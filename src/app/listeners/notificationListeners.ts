/**
 * Cross-slice sync for notification read-state — moves the cache-patching
 * half of notificationsApi.ts's optimistic updates here, so it's defined
 * once instead of duplicated between markNotificationReadHttp and
 * markAllNotificationsReadHttp. notificationsApi.ts's onQueryStarted keeps
 * only the slice update + rollback; this listener reacts to that same
 * action (in both directions — apply AND rollback dispatch the identical
 * action shape) and patches the RTK Query caches accordingly.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from '../store';
import { notificationsApi } from '../../features/notifications/notificationsApi';
import {
  setAllNotificationsReadState,
  setNotificationReadState,
} from '../../features/notifications/notificationsSlice';

export const notificationListenerMiddleware = createListenerMiddleware();

const startListening =
  notificationListenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
  >();

startListening({
  actionCreator: setNotificationReadState,
  effect: (action, listenerApi) => {
    const { id, isRead } = action.payload;
    const state = listenerApi.getState();

    listenerApi.dispatch(
      notificationsApi.util.updateQueryData(
        'getLatestNotifications',
        undefined,
        (draft) => {
          const notif = draft.find((n) => n.id === id);
          if (notif) notif.is_read = isRead;
        }
      )
    );

    const cachedListArgs = notificationsApi.util.selectCachedArgsForQuery(
      state,
      'getNotifications'
    );
    cachedListArgs.forEach((arg) => {
      listenerApi.dispatch(
        notificationsApi.util.updateQueryData(
          'getNotifications',
          arg,
          (draft) => {
            const notif = draft.results.find((n) => n.id === id);
            if (notif) notif.is_read = isRead;
          }
        )
      );
    });
  },
});

startListening({
  actionCreator: setAllNotificationsReadState,
  effect: (action, listenerApi) => {
    const isRead = action.payload;
    const state = listenerApi.getState();

    listenerApi.dispatch(
      notificationsApi.util.updateQueryData(
        'getLatestNotifications',
        undefined,
        (draft) => {
          draft.forEach((n) => {
            n.is_read = isRead;
          });
        }
      )
    );

    const cachedListArgs = notificationsApi.util.selectCachedArgsForQuery(
      state,
      'getNotifications'
    );
    cachedListArgs.forEach((arg) => {
      listenerApi.dispatch(
        notificationsApi.util.updateQueryData(
          'getNotifications',
          arg,
          (draft) => {
            draft.results.forEach((n) => {
              n.is_read = isRead;
            });
          }
        )
      );
    });
  },
});
