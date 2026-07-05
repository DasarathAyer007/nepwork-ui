import { CircleCheck, CircleX, Clock, MapPin, Tag, Wallet } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { ServiceFormValues } from '../../serviceSchema';

export default function StepReview() {
  const { watch } = useFormContext<ServiceFormValues>();
  const values = watch();

  return (
    <div className="space-y-md">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg shadow-sm">
        <div className="flex gap-md">
          {values.thumbnail && (
            <img
              src={URL.createObjectURL(values.thumbnail)}
              alt="Service thumbnail"
              className="w-24 h-24 rounded-lg object-cover border border-outline-variant shrink-0"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-headline-md text-headline-md text-on-surface truncate">
              {values.title || 'Untitled service'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-3">
              {values.description || 'No description yet.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-primary-container rounded-lg text-primary shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Pricing
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {values.price_type === 'HOURLY' ? 'Hourly' : 'Fixed'} —{' '}
              {values.currency} {values.price ?? '—'}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-secondary-container rounded-lg text-secondary shrink-0">
            <Tag size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {values.skills.length ? (
                values.skills.map((s) => (
                  <span
                    key={s}
                    className="text-body-sm bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-body-sm text-on-surface-variant">
                  None added
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-tertiary-container rounded-lg text-on-tertiary-container shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Location & Radius
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {[
                values.location.city,
                values.location.state,
                values.location.country,
              ]
                .filter(Boolean)
                .join(', ') || 'Coordinates set on map'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Serving within {values.radius_km} km
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-surface-container-high rounded-lg text-on-surface-variant shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Available Hours
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {values.available_from && values.available_to
                ? `${values.available_from} – ${values.available_to}`
                : 'Not specified'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex items-center gap-sm">
        {values.status === 'active' ? (
          <CircleCheck size={18} className="text-primary" />
        ) : (
          <CircleX size={18} className="text-on-surface-variant" />
        )}
        <span className="font-body-md text-body-md text-on-surface">
          This service will be posted as{' '}
          <strong>{values.status === 'active' ? 'Active' : 'Inactive'}</strong>
        </span>
      </section>
    </div>
  );
}
