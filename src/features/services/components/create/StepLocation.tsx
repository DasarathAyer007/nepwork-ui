import { Controller, useFormContext } from 'react-hook-form';

import MapComponent from '@/components/map/MapComponent';
import { FormSection, Input, Label } from '@/components/ui/forms';

import type { ServiceFormValues } from '../../serviceSchema';

export default function StepLocation() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();

  const latitude = watch('location.latitude');
  const longitude = watch('location.longitude');
  const radiusKm = watch('radius_km');

  function handleMapSelect(lat: number, lng: number) {
    setValue('location.latitude', Number(lat.toFixed(6)), {
      shouldValidate: true,
    });
    setValue('location.longitude', Number(lng.toFixed(6)), {
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-6">
      <FormSection
        title="Where you work"
        description="Click on the map to drop a marker, or expand it for a bigger view.">
        <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 shadow-inner bg-surface-container-low">
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            radiusKm={radiusKm}
            onSelect={handleMapSelect}
            height={280}
            showExpandButton
          />
        </div>
        {errors.location?.latitude && (
          <p className="text-xs text-error font-medium">
            {errors.location.latitude.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input
              value={latitude ?? ''}
              readOnly
              placeholder="Select on map"
              className="cursor-not-allowed bg-surface-container-low text-on-surface-variant font-mono"
            />
          </div>
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              {...register('location.city')}
              placeholder="e.g., Nepalgunj"
            />
          </div>
          <div className="space-y-2">
            <Label>State / Province</Label>
            <Input
              {...register('location.state')}
              placeholder="e.g., Lumbini"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              {...register('location.country')}
              placeholder="e.g., Nepal"
            />
          </div>
          <div className="space-y-2">
            <Label>Postal Code</Label>
            <Input
              {...register('location.postal_code')}
              placeholder="e.g., 21900"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Service radius"
        description="Clients within this distance from your pin can find and book this service.">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-on-surface">Radius</span>
          <span className="text-sm font-bold text-primary">{radiusKm} km</span>
        </div>
        <Controller
          control={control}
          name="radius_km"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={200}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <Input
                type="number"
                min={1}
                max={200}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          )}
        />
        {errors.radius_km && (
          <p className="text-xs text-error font-medium">
            {errors.radius_km.message}
          </p>
        )}
      </FormSection>

      <FormSection
        title="Available hours"
        description="Optional — let clients know when they can reach you.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Available From</Label>
            <Input {...register('available_from')} type="time" />
          </div>
          <div className="space-y-2">
            <Label>Available To</Label>
            <Input {...register('available_to')} type="time" />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Status"
        description="Active services are visible to clients right away.">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ] as const
              ).map((opt) => (
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
