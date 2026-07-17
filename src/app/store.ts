import { chatApi } from '@/features/chat/chatApi';
import { notificationsApi } from '@/features/notifications/notificationsApi';
import { ServiceApi } from '@/features/services/serviceApi';
import { configureStore } from '@reduxjs/toolkit';

import { AuthApi } from '../features/auth/api/authApi';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import { JobApi } from '../features/jobs/jobApi';
import notificationsReducer from '../features/notifications/notificationsSlice';
import socketReducer from '../features/socket/socketSlice';
import { ProfileApi } from '../features/user/api/profileApi';
import { chatListenerMiddleware } from './listeners/chatListeners';
import { notificationListenerMiddleware } from './listeners/notificationListeners';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
    socket: socketReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [ServiceApi.reducerPath]: ServiceApi.reducer,
    [JobApi.reducerPath]: JobApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(
        chatListenerMiddleware.middleware,
        notificationListenerMiddleware.middleware
      )
      .concat(AuthApi.middleware)
      .concat(ProfileApi.middleware)
      .concat(chatApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(ServiceApi.middleware)
      .concat(JobApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
