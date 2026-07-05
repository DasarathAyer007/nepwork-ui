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
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg shadow-sm space-y-lg">
      <div className="space-y-xs">
        <label className="font-headline-sm text-headline-sm block text-on-surface">
          Job Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-sm">
          {JOB_TYPE_OPTIONS.map(({ value, label, Icon }) => (
            <label key={value} className="relative cursor-pointer group">
              <input
                {...register('job_type')}
                className="peer sr-only"
                type="radio"
                value={value}
              />
              <div className="h-full p-md border-2 border-outline-variant rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50 flex flex-col items-center text-center gap-xs">
                <Icon size={20} className="text-primary" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  {label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.job_type && (
          <p className="text-body-sm text-error">{errors.job_type.message}</p>
        )}
      </div>

      <div className="space-y-xs">
        <label className="font-headline-sm text-headline-sm block text-on-surface">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-sm">
          {WORK_MODE_OPTIONS.map(({ value, label, Icon }) => (
            <label key={value} className="relative cursor-pointer group">
              <input
                {...register('work_mode')}
                className="peer sr-only"
                type="radio"
                value={value}
              />
              <div className="h-full p-md border-2 border-outline-variant rounded-xl transition-all peer-checked:border-primary peer-checked:bg-primary/10 hover:border-primary/50 flex flex-col items-center text-center gap-xs">
                <Icon size={20} className="text-primary" />
                <span className="font-body-sm text-body-sm text-on-surface">
                  {label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.work_mode && (
          <p className="text-body-sm text-error">{errors.work_mode.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase">
            Experience Level
          </label>
          <select
            {...register('experience_level')}
            className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-low font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.experience_level && (
            <p className="text-body-sm text-error">
              {errors.experience_level.message}
            </p>
          )}
        </div>

        <div className="space-y-xs">
          <label className="font-label-md text-label-md text-on-surface-variant block uppercase">
            Experience (Years)
          </label>
          <input
            {...register('experience_years')}
            type="number"
            min={0}
            max={50}
            placeholder="e.g., 3"
            className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface-container-low font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {errors.experience_years && (
            <p className="text-body-sm text-error">
              {errors.experience_years.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
