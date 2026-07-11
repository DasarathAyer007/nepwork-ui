export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  const data = (err as { data?: unknown })?.data ?? err;

  if (typeof data === 'string' && data.trim()) return data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;

    for (const key of ['detail', 'message', 'non_field_errors']) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }

    for (const value of Object.values(record)) {
      if (typeof value === 'string' && value.trim()) return value;
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    }
  }

  return fallback;
}
