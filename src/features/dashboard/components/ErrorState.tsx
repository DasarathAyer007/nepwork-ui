import { AlertTriangle, RotateCw } from 'lucide-react';

import { Card } from '@/components/ui/Card';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card
      variant="flat"
      className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="size-14 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
        <AlertTriangle size={26} />
      </div>
      <h3 className="text-title-md font-semibold text-on-surface">
        Failed to load
      </h3>
      <p className="mt-1.5 text-body-md text-on-surface-variant ">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-medium shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 active:scale-95">
          <RotateCw size={16} />
          Retry
        </button>
      )}
    </Card>
  );
}
