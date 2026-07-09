import clsx from 'clsx';
import { Loader2, LocateFixed } from 'lucide-react';

interface CurrentLocationButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  errored?: boolean;
  label?: string;
  className?: string;
}

/**
 * Presentational trigger for "use my current location". The actual
 * geolocation request/state is owned by the parent (MapComponent), which
 * wraps the existing useGeolocation() hook — this button just reflects
 * that state.
 */
export default function CurrentLocationButton({
  onClick,
  loading,
  disabled = false,
  errored = false,
  label = 'Use my current location',
  className,
}: CurrentLocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      title={disabled ? 'Geolocation is not supported by this browser' : label}
      className={clsx(
        'flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-md shadow-sm px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        className
      )}>
      {loading ? (
        <Loader2 size={16} className="animate-spin text-on-surface-variant" />
      ) : (
        <LocateFixed size={16} className="text-on-surface-variant" />
      )}
      <span className="truncate">{loading ? 'Locating…' : label}</span>
      {errored && !loading && (
        <span className="text-error text-label-sm ml-1 shrink-0">Failed</span>
      )}
    </button>
  );
}