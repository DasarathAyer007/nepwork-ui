import { Controller, useFormContext } from 'react-hook-form';

import type { JobFormValues } from '../../jobSchema';
import LocationMapDialog from './LocationMapDialog';
import LocationPicker from './LocationPicker';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
] as const;

export default function StepJobLocationStatus() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobFormValues>();

  const latitude = watch('location.lat');
  const longitude = watch('location.lng');

  function handleMapSelect(lat: number, lng: number) {
    setValue('location.lat', Number(lat.toFixed(6)), {
      shouldValidate: true,
    });
    setValue('location.lng', Number(lng.toFixed(6)), {
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-md">
      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Where is this job based?
        </h2>

        <div className="relative">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onSelect={handleMapSelect}
            height={280}
          />
          <LocationMapDialog
            latitude={latitude}
            longitude={longitude}
            onSelect={handleMapSelect}
          />
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          Click on the map to drop a marker, or expand it for a bigger view.
          Skip this for fully remote roles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Latitude
            </span>
            <input
              value={latitude ?? ''}
              readOnly
              placeholder="Select on map"
              className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-high font-body-md text-on-surface-variant"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Longitude
            </span>
            <input
              value={longitude ?? ''}
              readOnly
              placeholder="Select on map"
              className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-high font-body-md text-on-surface-variant"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              City
            </span>
            <input
              {...register('location.city')}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Nepalgunj"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              State / Province
            </span>
            <input
              {...register('location.state')}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Lumbini"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Country
            </span>
            <input
              {...register('location.country')}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., Nepal"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Postal Code
            </span>
            <input
              {...register('location.postal_code')}
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
              placeholder="e.g., 21900"
            />
          </label>
        </div>
      </section>

      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Deadline & contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Application Deadline
            </span>
            <input
              {...register('deadline')}
              type="date"
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            />
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Contact Email
            </span>
            <input
              {...register('contact_email')}
              type="email"
              placeholder="hiring@company.com"
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            />
            {errors.contact_email && (
              <p className="text-body-sm text-error mt-1">
                {errors.contact_email.message}
              </p>
            )}
          </label>
          <label className="block">
            <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
              Contact Phone
            </span>
            <input
              {...register('contact_phone')}
              type="tel"
              placeholder="+977 98XXXXXXXX"
              className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            />
          </label>
        </div>
      </section>

      <section className="bg-surface-container-lowest p-md md:p-lg rounded-lg border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Status
        </h2>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`px-md py-sm rounded-lg border font-label-md transition-all ${
                    field.value === opt.value
                      ? 'border-primary bg-primary text-on-primary shadow-sm'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/50'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
          Jobs start as a draft by default — set to Open when you're ready for
          applicants.
        </p>
      </section>
    </div>
  );
}
