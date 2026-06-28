import { configureStore } from '@reduxjs/toolkit';

import { AuthApi } from '../features/auth/api/authApi';
import authReducer from '../features/auth/authSlice';
import { ProfileApi } from '../features/user/api/profileApi';

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
