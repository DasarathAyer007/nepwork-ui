import { CircleCheck, CircleX, Clock, MapPin, Tag, Wallet } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { ServiceFormValues } from '../../serviceSchema';

export default function StepReview() {
  const { watch } = useFormContext<ServiceFormValues>();
  const values = watch();

  return (
    <div className="space-y-6">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {values.thumbnail && (
            <img
              src={URL.createObjectURL(values.thumbnail)}
              alt="Service thumbnail"
              className="w-20 h-20 rounded-xl object-cover border border-outline-variant/40 shrink-0 shadow-sm"
            />
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Preview Mode
            </span>
            <h2 className="text-xl font-bold text-on-surface truncate mt-2">
              {values.title || 'Untitled service'}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1.5 line-clamp-3 leading-relaxed">
              {values.description || 'No description yet.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Pricing
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {values.price_type === 'hourly' ? 'Hourly' : 'Fixed'} —{' '}
              {values.currency} {values.price ?? '—'}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <Tag size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {values.skills.length ? (
                values.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full border border-outline-variant/20 shadow-sm">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-on-surface-variant">
                  None added
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Location & Radius
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {[
                values.location.city,
                values.location.state,
                values.location.country,
              ]
                .filter(Boolean)
                .join(', ') || 'Coordinates set on map'}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Serving within {values.radius_km} km
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Available Hours
            </h4>
            <p className="text-sm font-semibold text-on-surface mt-1">
              {values.available_from && values.available_to
                ? `${values.available_from} – ${values.available_to}`
                : 'Not specified'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm flex items-center gap-2.5">
        {values.status === 'active' ? (
          <CircleCheck size={18} className="text-primary" />
        ) : (
          <CircleX size={18} className="text-on-surface-variant" />
        )}
        <span className="text-sm text-on-surface leading-relaxed">
          This service will be posted as{' '}
          <strong className="text-primary font-bold">
            {values.status === 'active' ? 'Active' : 'Inactive'}
          </strong>
        </span>
      </section>
    </div>
  );
}
