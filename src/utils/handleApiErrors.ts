import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type ToastLike = {
  error: (message: string) => void;
};

const extractMessage = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    return typeof first === 'string' && first.trim() ? first : null;
  }

  return null;
};

export const handleApiErrors = <TFieldValues extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<TFieldValues>,
  toast: ToastLike
) => {
  const data = (err as { data?: unknown })?.data ?? err;

  if (!data) {
    toast.error('Something went wrong');
    return;
  }

  if (typeof data === 'string') {
    toast.error(data);
    return;
  }

  if (typeof data !== 'object') {
    toast.error('Something went wrong');
    return;
  }

  const record = data as Record<string, unknown>;
  let handledAtLeastOneError = false;

  Object.entries(record).forEach(([key, value]) => {
    const message = extractMessage(value);
    if (!message) {
      return;
    }

    if (key === 'detail' || key === 'message' || key === 'non_field_errors') {
      toast.error(message);
      handledAtLeastOneError = true;
      return;
    }

    setError(key as Path<TFieldValues>, {
      type: 'server',
      message,
    });
    handledAtLeastOneError = true;
  });

  if (!handledAtLeastOneError) {
    toast.error('Something went wrong');
  }
};
