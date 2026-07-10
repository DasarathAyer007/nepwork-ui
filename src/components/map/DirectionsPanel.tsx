import clsx from 'clsx';
import { Loader2, Navigation, X } from 'lucide-react';

interface DirectionsPanelProps {
  /** 'confirm': a start point was picked but directions weren't requested yet.
   *  'route': directions were requested — show loading/result/error. */
  mode: 'confirm' | 'route';
  pointLabel: string;
  onConfirm: () => void;
  distanceKm?: number;
  durationMin?: number;
  loading?: boolean;
  error?: string | null;
  onClear: () => void;
  className?: string;
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function formatDuration(min: number) {
  if (min < 1) return '< 1 min';
  if (min < 60) return `${Math.round(min)} min`;
  const hours = Math.floor(min / 60);
  const mins = Math.round(min % 60);
  return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
}

export default function DirectionsPanel({
  mode,
  pointLabel,
  onConfirm,
  distanceKm,
  durationMin,
  loading = false,
  error = null,
  onClear,
  className,
}: DirectionsPanelProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-md shadow-md px-3 py-2',
        className
      )}>
      <Navigation size={16} className="text-primary shrink-0" />

      <div className="flex-1 min-w-0">
        {mode === 'confirm' && (
          <p className="text-body-sm text-on-surface truncate">
            Start from <span className="font-medium">{pointLabel}</span>?
          </p>
        )}

        {mode === 'route' && loading && (
          <p className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" /> Calculating route…
          </p>
        )}

        {mode === 'route' && !loading && error && (
          <p className="text-body-sm text-error">{error}</p>
        )}

        {mode === 'route' && !loading && !error && distanceKm != null && durationMin != null && (
          <>
            <p className="text-body-sm text-on-surface font-medium">
              {formatDistance(distanceKm)} · {formatDuration(durationMin)}
            </p>
            <p className="text-label-sm text-on-surface-variant truncate">From {pointLabel}</p>
          </>
        )}
      </div>

      {mode === 'confirm' && (
        <button
          type="button"
          onClick={onConfirm}
          className="shrink-0 px-3 py-1.5 rounded-md bg-primary text-on-primary text-body-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
          Get Directions
        </button>
      )}

      <button
        type="button"
        onClick={onClear}
        aria-label="Clear"
        className="shrink-0 p-1 rounded hover:bg-surface-container transition-colors cursor-pointer">
        <X size={14} className="text-on-surface-variant" />
      </button>
    </div>
  );
}