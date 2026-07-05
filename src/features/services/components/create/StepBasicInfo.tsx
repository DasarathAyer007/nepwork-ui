import { useRef } from 'react';

import { ImagePlus, X } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import type { ServiceFormValues } from '../../serviceSchema';
import CategorySelector from './CategorySelector';

export default function StepBasicInfo() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ServiceFormValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnail = watch('thumbnail');

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-md p-md md:p-lg shadow-sm">
      <div className="grid grid-cols-1 gap-md">
        <div className="space-y-xs">
          <label className="font-headline-sm text-headline-sm block text-on-surface">
            Service Title
          </label>
          <input
            {...register('title')}
            className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low"
            placeholder="e.g., Custom logo design in 48 hours"
            type="text"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Keep it short and specific. This is the first thing clients see.
          </p>
          {errors.title && (
            <p className="text-body-sm text-error">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-xs">
          <label className="font-headline-sm text-headline-sm block text-on-surface">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full px-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md bg-surface-container-low resize-none"
            placeholder="Describe exactly what you offer, your process, and what clients get..."
          />
          {errors.description && (
            <p className="text-body-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CategorySelector
              value={field.value}
              onChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <div className="space-y-xs">
          <label className="font-headline-sm text-headline-sm block text-on-surface">
            Thumbnail (Optional)
          </label>

          {!thumbnail ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-lg p-xl flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-full mb-md group-hover:scale-110 transition-transform">
                <ImagePlus size={28} className="text-primary" />
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                Click or drag a photo here
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-xs">
                One clear photo that represents your service. PNG or JPG.
              </p>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) =>
                  setValue('thumbnail', e.target.files?.[0] ?? null)
                }
              />
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-outline-variant h-48">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Service thumbnail preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setValue('thumbnail', null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest shadow-md hover:bg-surface-container transition-colors">
                <X size={16} className="text-on-surface-variant" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
