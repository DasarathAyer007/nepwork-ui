import { Controller, useFormContext } from 'react-hook-form';

import SkillsInput from '@/components/SkillsInput';
import { DropDown, FormSection, Input, Label } from '@/components/ui/forms';

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
    <div className="space-y-6">
      <FormSection
        title="Skills Required"
        description="Add the skills a candidate should have for this role.">
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
      </FormSection>

      <FormSection
        title="Requirements"
        description="Add each requirement as a short label and detail, e.g. 'Education' → 'Bachelor's in CS or equivalent'.">
        <Controller
          control={control}
          name="requirements"
          render={({ field }) => (
            <KeyValueListInput
              label="Requirements"
              value={field.value}
              onChange={field.onChange}
              keyPlaceholder="e.g., Education"
              valuePlaceholder="e.g., Bachelor's degree or equivalent experience"
            />
          )}
        />
      </FormSection>

      <FormSection
        title="Compensation"
        description="Set the salary range and currency for this role.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Salary Min</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-semibold text-on-surface-variant">
                $
              </span>
              <Input
                {...register('salary_min')}
                className="pl-8"
                placeholder="0.00"
                type="number"
                step="0.01"
              />
            </div>
            {errors.salary_min && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.salary_min.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Salary Max</Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-semibold text-on-surface-variant">
                $
              </span>
              <Input
                {...register('salary_max')}
                className="pl-8"
                placeholder="0.00"
                type="number"
                step="0.01"
              />
            </div>
            {errors.salary_max && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.salary_max.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <DropDown
              {...register('currency')}
              options={CURRENCIES.map((c) => ({ label: c, value: c }))}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Benefits"
        description="List perks as a label and detail, e.g. 'Health' → 'Full medical, dental, and vision'.">
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <KeyValueListInput
              label="Benefits"
              value={field.value}
              onChange={field.onChange}
              keyPlaceholder="e.g., Health"
              valuePlaceholder="e.g., Full medical, dental, and vision"
            />
          )}
        />
      </FormSection>
    </div>
  );
}
