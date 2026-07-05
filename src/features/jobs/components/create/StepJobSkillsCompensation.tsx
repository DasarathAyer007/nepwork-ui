import { Controller, useFormContext } from 'react-hook-form';

import SkillsInput from '@/components/SkillsInput';

import type { JobFormValues } from '../../jobSchema';
import KeyValueListInput from './KeyValueListInput';

const CURRENCIES = ['USD', 'NPR', 'INR', 'EUR', 'GBP'];

export default function StepJobSkillsCompensation() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<JobFormValues>();

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg shadow-sm space-y-lg">
      <Controller
        control={control}
        name="skills_required"
        render={({ field }) => (
          <SkillsInput
            value={field.value}
            onChange={field.onChange}
            error={errors.skills_required?.message as string | undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="requirements"
        render={({ field }) => (
          <KeyValueListInput
            label="Requirements"
            helperText="Add each requirement as a short label and detail, e.g. 'Education' → 'Bachelor's in CS or equivalent'."
            value={field.value}
            onChange={field.onChange}
            keyPlaceholder="e.g., Education"
            valuePlaceholder="e.g., Bachelor's degree or equivalent experience"
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <label className="block">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
            Salary Min
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-md font-headline-md text-on-surface-variant">
              $
            </span>
            <input
              {...register('salary_min')}
              className="w-full pl-xl pr-md py-md rounded-lg border border-outline font-headline-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
          {errors.salary_min && (
            <p className="text-body-sm text-error mt-1">
              {errors.salary_min.message}
            </p>
          )}
        </label>

        <label className="block">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
            Salary Max
          </span>
          <div className="relative flex items-center">
            <span className="absolute left-md font-headline-md text-on-surface-variant">
              $
            </span>
            <input
              {...register('salary_max')}
              className="w-full pl-xl pr-md py-md rounded-lg border border-outline font-headline-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="0.00"
              type="number"
              step="0.01"
            />
          </div>
          {errors.salary_max && (
            <p className="text-body-sm text-error mt-1">
              {errors.salary_max.message}
            </p>
          )}
        </label>

        <label className="block">
          <span className="font-label-md text-label-md text-on-surface-variant block mb-xs uppercase">
            Currency
          </span>
          <select
            {...register('currency')}
            className="w-full px-md py-md rounded-lg border border-outline-variant bg-surface-container-low font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Controller
        control={control}
        name="benefits"
        render={({ field }) => (
          <KeyValueListInput
            label="Benefits"
            helperText="List perks as a label and detail, e.g. 'Health' → 'Full medical, dental, and vision'."
            value={field.value}
            onChange={field.onChange}
            keyPlaceholder="e.g., Health"
            valuePlaceholder="e.g., Full medical, dental, and vision"
          />
        )}
      />
    </section>
  );
}
