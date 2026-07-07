import {
  Briefcase,
  Building2,
  Clock3,
  FileSignature,
  GraduationCap,
  Home,
  Laptop,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { JobFormValues } from '../../jobSchema';
import { Label, Input, DropDown, FormSection } from '@/components/ui/forms';

const JOB_TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full Time', Icon: Briefcase },
  { value: 'part_time', label: 'Part Time', Icon: Clock3 },
  { value: 'contract', label: 'Contract', Icon: FileSignature },
  { value: 'internship', label: 'Internship', Icon: GraduationCap },
  { value: 'freelance', label: 'Freelance', Icon: Laptop },
] as const;

const WORK_MODE_OPTIONS = [
  { value: 'onsite', label: 'Onsite', Icon: Building2 },
  { value: 'remote', label: 'Remote', Icon: Home },
  { value: 'hybrid', label: 'Hybrid', Icon: Laptop },
] as const;

const EXPERIENCE_OPTIONS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead' },
] as const;

export default function StepJobDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<JobFormValues>();

  return (
    <FormSection
      title="Job Details"
      description="Specify the job type, remote/onsite flexibility, and minimum experience requirements."
    >
      <div className="space-y-2">
        <Label>Job Type</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {JOB_TYPE_OPTIONS.map(({ value, label, Icon }) => (
            <label key={value} className="relative cursor-pointer group flex">
              <input
                {...register('job_type')}
                className="peer sr-only"
                type="radio"
                value={value}
              />
              <div className="w-full p-4 border-2 border-outline-variant/50 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/40 flex flex-col items-center justify-center text-center gap-2 group-hover:shadow-sm">
                <Icon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-on-surface">
                  {label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.job_type && (
          <p className="text-xs text-error font-medium">{errors.job_type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Work Mode</Label>
        <div className="grid grid-cols-3 gap-3">
          {WORK_MODE_OPTIONS.map(({ value, label, Icon }) => (
            <label key={value} className="relative cursor-pointer group flex">
              <input
                {...register('work_mode')}
                className="peer sr-only"
                type="radio"
                value={value}
              />
              <div className="w-full p-4 border-2 border-outline-variant/50 rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/40 flex flex-col items-center justify-center text-center gap-2 group-hover:shadow-sm">
                <Icon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs text-on-surface">
                  {label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.work_mode && (
          <p className="text-xs text-error font-medium">{errors.work_mode.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <DropDown
            {...register('experience_level')}
            options={EXPERIENCE_OPTIONS.map((opt) => ({
              label: opt.label,
              value: opt.value,
            }))}
          />
          {errors.experience_level && (
            <p className="text-xs text-error font-medium">
              {errors.experience_level.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Experience (Years)</Label>
          <Input
            {...register('experience_years')}
            type="number"
            min={0}
            max={50}
            placeholder="e.g., 3"
          />
          {errors.experience_years && (
            <p className="text-xs text-error font-medium">
              {errors.experience_years.message}
            </p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
