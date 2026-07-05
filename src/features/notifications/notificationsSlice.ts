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
}

const initialState: NotificationsState = {
  unreadCount: 0,
  liveNotifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set on "connection.established" — initial unread count from server
    setInitialUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
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
  },
});

export const {
  setInitialUnreadCount,
  notificationReceived,
  notificationReadConfirmed,
  notificationReadAllConfirmed,
} = notificationsSlice.actions;

export const selectUnreadCount = (state: RootState): number =>
  state.notifications.unreadCount;
export const selectLiveNotifications = (state: RootState): Notification[] =>
  state.notifications.liveNotifications;

export default notificationsSlice.reducer;
