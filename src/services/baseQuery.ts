import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import type { RootState } from '../app/store';
import { logout, setCredentials } from '../features/auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

type RefreshResponse = {
  access_token: string;
};
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (cb: () => void): void => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (): void => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      const refreshResult = await rawBaseQuery(
        {
          url: '/users/token/refresh',
          method: 'POST',
          body: {
            refresh: refreshToken,
          },
        },
        api,
        extraOptions
      );

      isRefreshing = false;

      if (refreshResult.data) {
        const state = api.getState() as RootState;
        const data = refreshResult.data as RefreshResponse;

        api.dispatch(
          setCredentials({
            accessToken: data.access_token,
            refreshToken: state.auth.refreshToken ?? '',
            user: state.auth.user!,
          })
        );

        onRefreshed();

        return rawBaseQuery(args, api, extraOptions);
      }

      api.dispatch(logout());
      onRefreshed();
      return result;
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh(async () => {
        const retry = await rawBaseQuery(args, api, extraOptions);
        resolve(retry);
      });
    });
  }

  return result;
};
