import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiErrorOptions {
  error?: FetchBaseQueryError | SerializedError;
  fallbackMessage?: string;
}

export default function getApiErrorMessage({
  error,
  fallbackMessage = 'Something went wrong.',
}: ApiErrorOptions): string {
  if (!error) {
    return fallbackMessage;
  }

  if ('message' in error && error.message) {
    return error.message;
  }

  if ('status' in error) {
    const { data, status } = error;

    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      const apiError = data as Record<string, unknown>;

      if (typeof apiError.detail === 'string') {
        return apiError.detail;
      }

      if (typeof apiError.message === 'string') {
        return apiError.message;
      }

      if (typeof apiError.error === 'string') {
        return apiError.error;
      }
    }

    return `Request failed (${status})`;
  }

  return fallbackMessage;
}
