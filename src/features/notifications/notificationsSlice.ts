import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import type {
  Notification,
  NotificationReadAllConfirmedPayload,
  NotificationReadConfirmedPayload,
} from './types';

interface NotificationsState {
  unreadCount: number;
  liveNotifications: Notification[];
  // True once an authoritative unread count has been applied (from the
  // socket's "connection.established" or the HTTP fallback). Guards the HTTP
  // fallback in Header so a late-resolving request can't clobber a count
  // that's already been live-incremented by a socket push in the meantime.
  hasHydratedUnreadCount: boolean;
}

const initialState: NotificationsState = {
  unreadCount: 0,
  liveNotifications: [],
  hasHydratedUnreadCount: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set on "connection.established" — initial unread count from server
    setInitialUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
      state.hasHydratedUnreadCount = true;
    },

    // Inbound from WebSocketService on "notification.new"
    notificationReceived: (state, action: PayloadAction<Notification>) => {
      state.liveNotifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    // Inbound from WebSocketService on "notification.read_confirmed"
    notificationReadConfirmed: (
      state,
      action: PayloadAction<NotificationReadConfirmedPayload>
    ) => {
      const { notification_id, unread_count } = action.payload;
      const notif = state.liveNotifications.find(
        (n) => n.id === notification_id
      );
      if (notif) notif.is_read = true;
      state.unreadCount = unread_count;
    },

    // Inbound from WebSocketService on "notification.read_all_confirmed"
    notificationReadAllConfirmed: (
      state,
      action: PayloadAction<NotificationReadAllConfirmedPayload>
    ) => {
      state.liveNotifications.forEach((n) => {
        n.is_read = true;
      });
      state.unreadCount = action.payload.unread_count;
    },

    // Optimistic setters — used by notificationsApi's onQueryStarted to
    // apply/rollback local state around the HTTP mark-read mutations,
    // without waiting on (or forcing) a refetch.
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    setNotificationReadState: (
      state,
      action: PayloadAction<{ id: number; isRead: boolean }>
    ) => {
      const notif = state.liveNotifications.find(
        (n) => n.id === action.payload.id
      );
      if (notif) notif.is_read = action.payload.isRead;
    },

    setAllNotificationsReadState: (state, action: PayloadAction<boolean>) => {
      state.liveNotifications.forEach((n) => {
        n.is_read = action.payload;
      });
    },
  },
});

export const {
  setInitialUnreadCount,
  notificationReceived,
  notificationReadConfirmed,
  notificationReadAllConfirmed,
  setUnreadCount,
  setNotificationReadState,
  setAllNotificationsReadState,
} = notificationsSlice.actions;

export const selectUnreadCount = (state: RootState): number =>
  state.notifications.unreadCount;
export const selectHasHydratedUnreadCount = (state: RootState): boolean =>
  state.notifications.hasHydratedUnreadCount;
export const selectLiveNotifications = (state: RootState): Notification[] =>
  state.notifications.liveNotifications;

export default notificationsSlice.reducer;
