import { useRef } from 'react';

import { Upload, X } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormSection, Input, Label, TextArea } from '@/components/ui/forms';

import type { JobFormValues } from '../../jobSchema';
import JobCategorySelector from './JobCategorySelector';

export default function StepJobBasicInfo() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JobFormValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnail = watch('thumbnail');

  return (
    <FormSection
      title="Role Information"
      description="Provide the title, description, category, and an optional thumbnail image for the job.">
      <div className="grid grid-cols-1 gap-6 ">
        <div className="space-y-2">
          <Label>Job Title</Label>
          <Input
            {...register('title')}
            placeholder="e.g., Senior Frontend Engineer"
            type="text"
          />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Keep it short and specific. This is the first thing candidates see.
          </p>
          {errors.title && (
            <p className="text-xs text-error font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <TextArea
            {...register('description')}
            rows={6}
            placeholder="Describe the role, responsibilities, and what a typical day looks like..."
          />
          {errors.description && (
            <p className="text-xs text-error font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <JobCategorySelector
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Thumbnail (Optional)</Label>

          {!thumbnail ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container/35 hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-14 h-14 bg-primary-container flex items-center justify-center rounded-full mb-3 group-hover:scale-105 transition-transform text-primary shadow-sm">
                <Upload size={24} />
              </div>
              <p className="font-semibold text-sm text-on-surface">
                Click to upload or drag & drop image
              </p>
              <p className="text-xs text-on-surface-variant text-center mt-1">
                A logo or cover image for this job posting (max. 2MB). PNG or
                JPG.
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
            <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 h-48 shadow-sm group">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Job thumbnail preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-on-background/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setValue('thumbnail', null)}
                  className="p-2 rounded-full bg-surface-container-lowest shadow-md hover:bg-error/10 hover:text-error transition-colors text-on-surface cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}
