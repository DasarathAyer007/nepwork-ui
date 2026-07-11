import { Controller, useFormContext } from 'react-hook-form';

import MapComponent from '@/components/map/MapComponent';
import { FormSection, Input, Label } from '@/components/ui/forms';

import type { JobFormValues } from '../../jobSchema';

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
    <div className="space-y-6">
      <FormSection
        title="Job Location"
        description="Click on the map to drop a marker, or expand it for a bigger view. Skip this for fully remote roles.">
        <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 shadow-inner bg-surface-container-low">
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            onSelect={handleMapSelect}
            height={280}
            showExpandButton
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input
              value={latitude ?? ''}
              readOnly
              placeholder="Select on map"
              className="cursor-not-allowed bg-surface-container-low text-on-surface-variant font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input
              value={longitude ?? ''}
              readOnly
              placeholder="Select on map"
              className="cursor-not-allowed bg-surface-container-low text-on-surface-variant font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
          <div className="space-y-1.5">
            <Label>City</Label>
            <Input
              {...register('location.city')}
              placeholder="e.g., Nepalgunj"
            />
          </div>
          <div className="space-y-1.5">
            <Label>State / Province</Label>
            <Input
              {...register('location.state')}
              placeholder="e.g., Lumbini"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input
              {...register('location.country')}
              placeholder="e.g., Nepal"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Postal Code</Label>
            <Input
              {...register('location.postal_code')}
              placeholder="e.g., 21900"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Deadline & Contact"
        description="Specify application deadline and hiring contact details for potential applicants.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Application Deadline</Label>
            <Input {...register('deadline')} type="date" />
          </div>
          <div className="space-y-1.5">
            <Label>Contact Email</Label>
            <Input
              {...register('contact_email')}
              type="email"
              placeholder="hiring@company.com"
            />
            {errors.contact_email && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.contact_email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Contact Phone</Label>
            <Input
              {...register('contact_phone')}
              type="tel"
              placeholder="+977 98XXXXXXXX"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Status"
        description="Jobs start as a draft by default. Set to Open when you're ready for applicants.">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-150 ease-in-out cursor-pointer flex items-center justify-center ${
                    field.value === opt.value
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container-low text-on-surface hover:border-primary/45'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
