import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import { AuthApi } from '../features/auth/services/authApi';
import { ProfileApi } from '../features/user/services/profileApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(AuthApi.middleware)
      .concat(ProfileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
