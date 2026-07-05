import {
  Briefcase,
  CalendarClock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Tag,
  Wallet,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { JobFormValues } from '../../jobSchema';

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: 'Onsite',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  open: 'Open',
  paused: 'Paused',
  closed: 'Closed',
};

export default function StepJobReview() {
  const { watch } = useFormContext<JobFormValues>();
  const values = watch();

  return (
    <div className="space-y-md">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg shadow-sm">
        <div className="flex gap-md">
          {values.thumbnail && (
            <img
              src={URL.createObjectURL(values.thumbnail)}
              alt="Job thumbnail"
              className="w-24 h-24 rounded-lg object-cover border border-outline-variant shrink-0"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-headline-md text-headline-md text-on-surface truncate">
              {values.title || 'Untitled job'}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-3">
              {values.description || 'No description yet.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-primary-container rounded-lg text-primary shrink-0">
            <Briefcase size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Job Type & Mode
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {JOB_TYPE_LABELS[values.job_type]} —{' '}
              {WORK_MODE_LABELS[values.work_mode]}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-secondary-container rounded-lg text-secondary shrink-0">
            <GraduationCap size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Experience
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {EXPERIENCE_LABELS[values.experience_level]}
              {values.experience_years != null
                ? ` · ${values.experience_years} yrs`
                : ''}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-tertiary-container rounded-lg text-on-tertiary-container shrink-0">
            <Wallet size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Salary
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {values.salary_min != null || values.salary_max != null
                ? `${values.currency} ${values.salary_min ?? '—'} – ${values.salary_max ?? '—'}`
                : 'Not specified'}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-surface-container-high rounded-lg text-on-surface-variant shrink-0">
            <Tag size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Skills Required
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {values.skills_required.length ? (
                values.skills_required.map((s) => (
                  <span
                    key={s}
                    className="text-body-sm bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-body-sm text-on-surface-variant">
                  None added
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-primary-container rounded-lg text-primary shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Location
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {[
                values.location.city,
                values.location.state,
                values.location.country,
              ]
                .filter(Boolean)
                .join(', ') || 'Not specified'}
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex gap-md items-start">
          <div className="p-xs bg-secondary-container rounded-lg text-secondary shrink-0">
            <CalendarClock size={18} />
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface-variant uppercase">
              Deadline
            </h4>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              {values.deadline || 'No deadline set'}
            </p>
          </div>
        </div>
      </section>

      {(values.requirements.length > 0 || values.benefits.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {values.requirements.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
              <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
                Requirements
              </h4>
              <div className="space-y-1">
                {values.requirements.map((r, i) => (
                  <p key={i} className="text-body-sm text-on-surface">
                    <span className="font-medium">{r.key}:</span> {r.value}
                  </p>
                ))}
              </div>
            </div>
          )}
          {values.benefits.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
              <h4 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2">
                Benefits
              </h4>
              <div className="space-y-1">
                {values.benefits.map((b, i) => (
                  <p key={i} className="text-body-sm text-on-surface">
                    <span className="font-medium">{b.key}:</span> {b.value}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm flex flex-wrap gap-md items-center justify-between">
        <span className="font-body-md text-body-md text-on-surface flex items-center gap-2">
          This job will be posted as{' '}
          <strong>{STATUS_LABELS[values.status]}</strong>
        </span>
        <div className="flex items-center gap-md text-body-sm text-on-surface-variant">
          {values.contact_email && (
            <span className="flex items-center gap-1">
              <Mail size={14} /> {values.contact_email}
            </span>
          )}
          {values.contact_phone && (
            <span className="flex items-center gap-1">
              <Phone size={14} /> {values.contact_phone}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
