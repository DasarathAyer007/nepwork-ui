import type { RootState } from '../../app/store';

export const selectUser = (state: RootState) => state.auth.user;

export const userIdSelector = (state: RootState) => state.auth.user?.id;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) =>
  state.auth.refreshToken;

export const selectIsLoggedIn = (state: RootState) =>
  Boolean(state.auth.accessToken);

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user);
